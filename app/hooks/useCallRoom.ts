import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";

import configs from "~/config";
import { useWebsocket } from "~/contexts/websocket";
import { useAuth } from "~/contexts/auth";
import { RoomUser } from "~/types/interfaces";

const CALL_VIDEO_CONSTRAINTS: MediaTrackConstraints = {
  width: { ideal: 1280 },
  height: { ideal: 720 },
  frameRate: { ideal: 30 },
};

let activeCallRoomId: string | null = null;

// Captura a primeira webcam válida do computador/dispositivo
const getPreferredVideoDeviceId = async (): Promise<string | undefined> => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(
      (device) => device.kind === "videoinput",
    );

    if (videoDevices.length > 0) {
      return videoDevices[0].deviceId;
    }
  } catch (e) {
    console.warn("[Call] Não foi possível enumerar dispositivos de vídeo:", e);
  }
  return undefined;
};

export const useCallRoom = (roomId: string | null, onEnded?: () => void) => {
  const { socket } = useWebsocket();
  const { user } = useAuth();

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<{
    [socketId: string]: MediaStream;
  }>({});
  const [participants, setParticipants] = useState<RoomUser[]>([]);
  const [remoteVideoEnabled, setRemoteVideoEnabled] = useState<{
    [socketId: string]: boolean;
  }>({});
  const [remoteAudioMuted, setRemoteAudioMuted] = useState<{
    [socketId: string]: boolean;
  }>({});

  const streamRef = useRef<MediaStream | null>(null);
  const peersRef = useRef<{ [socketId: string]: RTCPeerConnection }>({});
  const iceCandidatesQueue = useRef<{ [socketId: string]: RTCIceCandidateInit[] }>({});
  const joinedRoomRef = useRef<{ roomId: string; socket: Socket } | null>(null);
  const videoEnabledRef = useRef(false);

  const joinCallRoom = () => {
    if (
      !socket ||
      !roomId ||
      (activeCallRoomId && activeCallRoomId !== roomId) ||
      (joinedRoomRef.current?.roomId === roomId &&
        joinedRoomRef.current.socket === socket)
    ) {
      return;
    }

    joinedRoomRef.current = { roomId, socket };
    socket.emit("join_call_room", { roomId });
  };

  const refreshMediaTracks = async () => {
    if (!socket || !roomId) return;

    try {
      const deviceId = await getPreferredVideoDeviceId();
      const nextStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: videoEnabledRef.current
          ? deviceId
            ? { deviceId: { exact: deviceId }, ...CALL_VIDEO_CONSTRAINTS }
            : CALL_VIDEO_CONSTRAINTS
          : false,
      });

      const audioTrack = nextStream.getAudioTracks()[0];
      const videoTrack = nextStream.getVideoTracks()[0];

      if (videoTrack) {
        videoTrack.enabled = videoEnabledRef.current;
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      } else if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }

      streamRef.current = nextStream;
      setLocalStream(nextStream);

      Object.values(peersRef.current).forEach((peer) => {
        const senders = peer.getSenders();
        const audioSender = senders.find((s) => s.track?.kind === "audio");
        const videoSender = senders.find((s) => s.track?.kind === "video");

        if (audioTrack) {
          if (audioSender) {
            audioSender.replaceTrack(audioTrack);
          } else {
            peer.addTrack(audioTrack, nextStream);
          }
        }

        if (videoTrack) {
          if (videoSender) {
            videoSender.replaceTrack(videoTrack);
          } else {
            peer.addTrack(videoTrack, nextStream);
          }
        }
      });
    } catch (error) {
      console.error("[Call] Erro ao reativar mídia na Web:", error);
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      if (roomId && (!activeCallRoomId || activeCallRoomId === roomId)) {
        joinedRoomRef.current = null;
        joinCallRoom();
      }
    };

    socket.on("connect", handleConnect);
    return () => {
      socket.off("connect", handleConnect);
    };
  }, [socket, roomId]);

  useEffect(() => {
    if (!roomId) {
      setParticipants([]);
      return;
    }

    if (activeCallRoomId && activeCallRoomId !== roomId) {
      console.warn(
        `[Call] Bloqueado: Já existe chamada ativa na sala ${activeCallRoomId}`,
      );

      setTimeout(() => {
        window.alert(
          "Você já está em uma chamada. Encerre a chamada atual antes de entrar em outra.",
        );
        onEnded?.();
      }, 150);

      return;
    }

    activeCallRoomId = roomId;
    let isMounted = true;

    if (user) {
      setParticipants([{ socketId: "local", user }]);
    }

    const initVoice = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });

        streamRef.current = stream;
        if (isMounted) setLocalStream(stream);

        const handleCurrentRoomUsers = async (users: RoomUser[]) => {
          if (!socket) return;

          setParticipants((prev) => {
            const localUser =
              prev.find((u) => u.socketId === "local") ||
              (user ? { socketId: "local", user } : null);
            const remoteUsers = users.filter(
              (u) =>
                u.socketId !== socket.id && (!user || u.user?.id !== user.id),
            );
            return localUser ? [localUser, ...remoteUsers] : remoteUsers;
          });

          const activeStream = streamRef.current;
          if (!activeStream) return;

          for (const targetUser of users) {
            if (targetUser.socketId === socket.id) continue;
            if (user?.id && targetUser.user?.id === user.id) continue;

            const peer = ensurePeer(targetUser.socketId, activeStream, socket);
            if (peer.signalingState !== "stable") continue;

            try {
              const offer = await peer.createOffer({});
              await peer.setLocalDescription(offer);

              socket.emit("sending_offer", {
                targetSocketId: targetUser.socketId,
                offer,
                roomId,
              });
            } catch (error) {
              console.error("[Call] Erro ao criar oferta:", error);
            }
          }
        };

        const handleUserJoined = (newUser: RoomUser) => {
          if (!socket) return;
          if (newUser.socketId === socket.id) return;
          if (user?.id && newUser.user?.id === user.id) return;

          setParticipants((prev) => {
            if (prev.some((u) => u.socketId === newUser.socketId)) return prev;
            return [...prev, newUser];
          });

          const activeStream = streamRef.current;
          if (activeStream) {
            ensurePeer(newUser.socketId, activeStream, socket);
          }
        };

        const handleReceiveOffer = async ({
          callerSocketId,
          offer,
        }: {
          callerSocketId: string;
          offer: RTCSessionDescriptionInit;
        }) => {
          if (!socket) return;

          const activeStream = streamRef.current;
          if (!activeStream) return;

          const peer = ensurePeer(callerSocketId, activeStream, socket);

          const isOfferCollision =
            offer.type === "offer" &&
            (peer.signalingState !== "stable" || peer.localDescription !== null);

          if (isOfferCollision) {
            const isPolite = (socket.id || "") < callerSocketId;
            if (!isPolite) {
              return;
            }
            try {
              await peer.setLocalDescription({ type: "rollback" });
            } catch (e) {
              console.warn("[Call] Rollback falhou:", e);
            }
          }

          try {
            await peer.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peer.createAnswer();
            await peer.setLocalDescription(answer);

            if (iceCandidatesQueue.current[callerSocketId]) {
              for (const candidate of iceCandidatesQueue.current[callerSocketId]) {
                try {
                  await peer.addIceCandidate(new RTCIceCandidate(candidate));
                } catch (e) {
                  console.warn("[Call] Erro ao adicionar ICE candidate da fila:", e);
                }
              }
              delete iceCandidatesQueue.current[callerSocketId];
            }

            socket.emit("sending_answer", {
              targetSocketId: callerSocketId,
              answer,
              roomId,
            });
          } catch (error) {
            console.error("[Call] Erro ao responder oferta:", error);
          }
        };

        const handleReceiveAnswer = async ({
          responderSocketId,
          answer,
        }: {
          responderSocketId: string;
          answer: RTCSessionDescriptionInit;
        }) => {
          const peer = peersRef.current[responderSocketId];
          if (!peer) return;

          if (peer.remoteDescription?.type === "answer") return;
          if (peer.signalingState !== "have-local-offer") return;

          try {
            await peer.setRemoteDescription(new RTCSessionDescription(answer));

            if (iceCandidatesQueue.current[responderSocketId]) {
              for (const candidate of iceCandidatesQueue.current[responderSocketId]) {
                try {
                  await peer.addIceCandidate(new RTCIceCandidate(candidate));
                } catch (e) {
                  console.warn("[Call] Erro ao aplicar ICE candidate após resposta:", e);
                }
              }
              delete iceCandidatesQueue.current[responderSocketId];
            }
          } catch (error) {
            console.error("[Call] Erro ao aplicar resposta:", error);
          }
        };

        const handleReceiveIceCandidate = async ({
          senderSocketId,
          candidate,
        }: {
          senderSocketId: string;
          candidate: RTCIceCandidateInit;
        }) => {
          const peer = peersRef.current[senderSocketId];

          if (peer && peer.remoteDescription && peer.remoteDescription.type) {
            try {
              await peer.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (e) {
              console.warn("[Call] Erro ao aplicar ICE candidate:", e);
            }
          } else {
            if (!iceCandidatesQueue.current[senderSocketId]) {
              iceCandidatesQueue.current[senderSocketId] = [];
            }
            iceCandidatesQueue.current[senderSocketId].push(candidate);
          }
        };

        const handleUserLeft = ({ socketId }: { socketId: string }) => {
          cleanupPeerConnection(socketId);
          setParticipants((prev) => prev.filter((u) => u.socketId !== socketId));
        };

        const handleUserToggleVideo = ({
          socketId,
          isVideoOn,
        }: {
          socketId: string;
          isVideoOn: boolean;
        }) => {
          setRemoteVideoEnabled((prev) => ({
            ...prev,
            [socketId]: isVideoOn,
          }));
        };

        const handleUserToggleAudio = ({
          socketId,
          isMuted,
        }: {
          socketId: string;
          isMuted: boolean;
        }) => {
          setRemoteAudioMuted((prev) => ({
            ...prev,
            [socketId]: isMuted,
          }));
        };

        socket?.on("current_room_users", handleCurrentRoomUsers);
        socket?.on("user_joined", handleUserJoined);
        socket?.on("receive_offer", handleReceiveOffer);
        socket?.on("receive_answer", handleReceiveAnswer);
        socket?.on("receive_ice_candidate", handleReceiveIceCandidate);
        socket?.on("user_left", handleUserLeft);
        socket?.on("user_toggle_video", handleUserToggleVideo);
        socket?.on("user_toggle_audio", handleUserToggleAudio);

        joinCallRoom();
      } catch (err) {
        console.error("[Call] Erro ao acessar microfone na Web:", err);
      }
    };

    initVoice();

    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible") {
        if (roomId && activeCallRoomId === roomId) {
          await refreshMediaTracks();
          joinCallRoom();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isMounted = false;
      joinedRoomRef.current = null;
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      if (activeCallRoomId === roomId) {
        activeCallRoomId = null;
      }

      socket?.off("current_room_users");
      socket?.off("user_joined");
      socket?.off("receive_offer");
      socket?.off("receive_answer");
      socket?.off("receive_ice_candidate");
      socket?.off("user_left");
      socket?.off("user_toggle_video");
      socket?.off("user_toggle_audio");

      Object.keys(peersRef.current).forEach((targetSocketId) => {
        cleanupPeerConnection(targetSocketId);
      });

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setLocalStream(null);
      setRemoteStreams({});
      setParticipants([]);
      setRemoteVideoEnabled({});
      setRemoteAudioMuted({});
    };
  }, [roomId, socket, user]);

  const renegotiatePeer = async (
    targetSocketId: string,
    peer: RTCPeerConnection,
  ) => {
    if (!socket || peer.signalingState !== "stable") return;

    try {
      const offer = await peer.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      await peer.setLocalDescription(offer);

      socket.emit("sending_offer", {
        targetSocketId,
        offer,
        roomId,
      });
    } catch (error) {
      console.error("[Call] Erro na renegociação com peer:", error);
    }
  };

  const cleanupPeerConnection = (targetSocketId: string) => {
    const peer = peersRef.current[targetSocketId];
    if (peer) {
      peer.getSenders().forEach((sender) => {
        if (sender.track) {
          sender.track.stop();
        }
      });
      peer.close();
      delete peersRef.current[targetSocketId];
    }

    delete iceCandidatesQueue.current[targetSocketId];
    setRemoteStreams((prev) => {
      const updated = { ...prev };
      delete updated[targetSocketId];
      return updated;
    });
    setRemoteVideoEnabled((prev) => {
      const updated = { ...prev };
      delete updated[targetSocketId];
      return updated;
    });
    setRemoteAudioMuted((prev) => {
      const updated = { ...prev };
      delete updated[targetSocketId];
      return updated;
    });
  };

  const endCall = () => {
    if (roomId) {
      socket?.emit("leave_voice_room", { roomId });
    }

    Object.keys(peersRef.current).forEach((targetSocketId) => {
      cleanupPeerConnection(targetSocketId);
    });

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }

    activeCallRoomId = null;
    videoEnabledRef.current = false;
    joinedRoomRef.current = null;

    setLocalStream(null);
    setRemoteStreams({});
    setParticipants([]);
    setRemoteVideoEnabled({});
    setRemoteAudioMuted({});

    socket?.off("current_room_users");
    socket?.off("user_joined");
    socket?.off("receive_offer");
    socket?.off("receive_answer");
    socket?.off("receive_ice_candidate");
    socket?.off("user_left");
    socket?.off("user_toggle_video");
    socket?.off("user_toggle_audio");

    onEnded?.();
  };

  const createPeer = (
    targetSocketId: string,
    stream: MediaStream,
    activeSocket: Socket,
  ) => {
    const existingPeer = peersRef.current[targetSocketId];
    if (existingPeer) {
      return existingPeer;
    }

    const peerConfig: RTCConfiguration = Array.isArray(configs.ICE_SERVERS_CONFIG)
      ? { iceServers: configs.ICE_SERVERS_CONFIG }
      : (configs.ICE_SERVERS_CONFIG as RTCConfiguration) || {
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        };

    const peer = new RTCPeerConnection(peerConfig);
    peersRef.current[targetSocketId] = peer;

    stream.getTracks().forEach((track) => peer.addTrack(track, stream));

    peer.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
      if (event.candidate) {
        activeSocket.emit("sending_ice_candidate", {
          targetSocketId,
          candidate: event.candidate,
          roomId,
        });
      }
    };

    peer.ontrack = (event: RTCTrackEvent) => {
      const updateRemoteStream = () => {
        setRemoteStreams((prev) => {
          const existingStream = prev[targetSocketId] || new MediaStream();
          if (!existingStream.getTracks().some((t) => t.id === event.track.id)) {
            existingStream.addTrack(event.track);
          }
          return {
            ...prev,
            [targetSocketId]: new MediaStream(existingStream.getTracks()),
          };
        });
      };

      event.track.onunmute = () => {
        updateRemoteStream();
      };

      updateRemoteStream();
    };

    peer.onconnectionstatechange = () => {
      if (["failed", "closed"].includes(peer.connectionState)) {
        cleanupPeerConnection(targetSocketId);
      }
    };

    return peer;
  };

  const ensurePeer = (
    targetSocketId: string,
    stream: MediaStream,
    activeSocket: Socket,
  ) => createPeer(targetSocketId, stream, activeSocket);

  const toggleAudio = (isMuted: boolean) => {
    const activeStream = streamRef.current || localStream;
    if (activeStream) {
      activeStream.getAudioTracks().forEach((track) => {
        track.enabled = !isMuted;
      });
    }

    socket?.emit("toggle_mute_audio", {
      roomId,
      isMuted,
    });
  };

  const toggleVideo = async (enableVideo: boolean) => {
    videoEnabledRef.current = enableVideo;

    try {
      let activeStream = streamRef.current || localStream;

      if (enableVideo) {
        const deviceId = await getPreferredVideoDeviceId();
        const videoStream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: deviceId
            ? { deviceId: { exact: deviceId } }
            : CALL_VIDEO_CONSTRAINTS,
        });

        const newVideoTrack = videoStream.getVideoTracks()[0];

        if (newVideoTrack) {
          if (!activeStream) {
            activeStream = new MediaStream([newVideoTrack]);
          } else {
            activeStream.getVideoTracks().forEach((t) => {
              t.stop();
              activeStream?.removeTrack(t);
            });
            activeStream.addTrack(newVideoTrack);
          }

          await Promise.all(
            Object.entries(peersRef.current).map(
              async ([targetSocketId, peer]) => {
                const senders = peer.getSenders();
                const videoSender = senders.find(
                  (s) => s.track?.kind === "video",
                );

                if (videoSender) {
                  await videoSender.replaceTrack(newVideoTrack);
                } else {
                  peer.addTrack(newVideoTrack, activeStream!);
                }

                await renegotiatePeer(targetSocketId, peer);
              },
            ),
          );
        }
      } else {
        if (activeStream) {
          activeStream.getVideoTracks().forEach((track) => {
            track.enabled = false;
            track.stop();
            activeStream?.removeTrack(track);
          });

          Object.values(peersRef.current).forEach((peer) => {
            const senders = peer.getSenders();
            const videoSender = senders.find((s) => s.track?.kind === "video");
            if (videoSender && videoSender.track) {
              videoSender.track.stop();
            }
          });
        }
      }

      streamRef.current = activeStream;
      setLocalStream(
        activeStream ? new MediaStream(activeStream.getTracks()) : null,
      );

      socket?.emit("toggle_video", {
        roomId,
        isVideoOn: enableVideo,
      });
    } catch (error) {
      console.error("[Call] Erro ao obter câmera no PC:", error);
      videoEnabledRef.current = false;
    }
  };

  return {
    localStream,
    remoteStreams,
    participants,
    remoteVideoEnabled,
    remoteAudioMuted,
    toggleAudio,
    toggleVideo,
    endCall,
    activeCallRoomId,
  };
};