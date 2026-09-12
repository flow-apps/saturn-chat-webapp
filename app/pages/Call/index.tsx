import React, { useEffect, useState, useRef } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Users,
  X,
  ArrowLeft,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";

import CustomAlert from "~/components/Alert";
import { useWebsocket } from "~/contexts/websocket";
import { useAuth } from "~/contexts/auth";
import { useCallStatus } from "~/contexts/callStatus";
import { RoomUser } from "~/types/interfaces";

import {
  Container,
  Header,
  HeaderTitle,
  ParticipantCount,
  GridContainer,
  ParticipantCard,
  Avatar,
  AvatarImage,
  NameContainer,
  Name,
  ControlsBar,
  ControlButton,
  EndCallButton,
  DirectCallContainer,
  FullscreenCard,
  MiniCard,
  VideoElement,
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalContent,
} from "./styles";

const MAX_DISPLAY = 12;

// Componente para vincular o MediaStream nativo da Web na tag <video>
const WebStreamPlayer: React.FC<{
  stream: MediaStream | null;
  isLocal?: boolean;
}> = ({ stream, isLocal = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  if (!stream) return null;

  return (
    <VideoElement
      ref={videoRef}
      autoPlay
      playsInline
      muted={isLocal}
      style={{ transform: isLocal ? "scaleX(-1)" : "none" }}
    />
  );
};

export const Call: React.FC = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isLocalPrimary, setIsLocalPrimary] = useState(false);
  const [isParticipantsModalVisible, setParticipantsModalVisible] =
    useState(false);
  const [focusedParticipant, setFocusedParticipant] = useState<RoomUser | null>(
    null,
  );
  const [callAlert, setCallAlert] = useState({
    visible: false,
    title: "",
    content: "",
  });

  const navigate = useNavigate();
  const { groupId } = useParams<{ groupId: string }>();

  const { socket } = useWebsocket();
  const { user } = useAuth();
  const {
    localStream,
    remoteStreams,
    participants: roomParticipants,
    remoteVideoEnabled,
    remoteAudioMuted,
    toggleAudio,
    endCall,
    setActiveCallRoom,
    isVideoEnabled,
    setVideoEnabled,
    activeCallRoomId,
  } = useCallStatus();

  useEffect(() => {
    if (groupId) {
      if (activeCallRoomId && activeCallRoomId !== groupId) {
        showCallAlert("Você já está em uma chamada em andamento.");
        return;
      }
      setActiveCallRoom(groupId);
    }
  }, [groupId, activeCallRoomId, setActiveCallRoom]);

  const participants =
    roomParticipants && roomParticipants.length > 0
      ? roomParticipants
      : user
        ? [{ socketId: "local", user }]
        : [];

  const totalParticipants = participants.length;
  const localParticipant = participants.find(
    (item) => item.socketId === "local",
  );
  const remoteParticipant = participants.find(
    (item) => item.socketId !== "local",
  );
  const isDirectCall =
    totalParticipants === 2 && !!localParticipant && !!remoteParticipant;
  const primaryParticipant = isLocalPrimary
    ? localParticipant
    : remoteParticipant;
  const secondaryParticipant = isLocalPrimary
    ? remoteParticipant
    : localParticipant;

  const hasMore = totalParticipants > MAX_DISPLAY;
  const visibleParticipants = hasMore
    ? participants.slice(0, MAX_DISPLAY - 1)
    : participants.slice(0, MAX_DISPLAY);

  const displayedCardsCount = hasMore
    ? visibleParticipants.length + 1
    : visibleParticipants.length;

  const handleToggleMute = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    toggleAudio(nextState);
  };

  const handleToggleVideo = async () => {
    const nextState = !isVideoEnabled;
    await setVideoEnabled(nextState);
  };

  // Minimiza a tela de chamada (apenas navega sem destruir o WebRTC)
  const handleMinimize = () => {
    navigate(-1);
  };

  // Encerra a chamada por completo
  const handleEndCall = () => {
    endCall();
    setActiveCallRoom(null);
    navigate(-1);
  };

  const showCallAlert = (
    message: string,
    fallbackTitle = "Erro na chamada",
  ) => {
    const lowerMessage = message.toLowerCase();
    let title = fallbackTitle;
    let content = message;

    if (
      lowerMessage.includes("already_in_call") ||
      lowerMessage.includes("já está em uma chamada")
    ) {
      title = "Chamada em andamento";
      content =
        "Você já está em uma chamada ativada. Encerre a chamada atual para iniciar outra.";
    } else if (lowerMessage.includes("banned")) {
      title = "Acesso Bloqueado";
      content = "Você foi banido deste grupo.";
    } else if (lowerMessage.includes("not in this group")) {
      title = "Grupo Inválido";
      content = "Você não faz parte deste grupo.";
    }

    setCallAlert({ visible: true, title, content });
  };

  const closeCallAlert = () => {
    setCallAlert({ visible: false, title: "", content: "" });
    setActiveCallRoom(null);
    navigate(-1);
  };

  const renderParticipantContent = (item: RoomUser) => {
    const isLocal = item.socketId === "local";
    const stream = isLocal ? localStream : remoteStreams?.[item.socketId];
    const isRemoteVideoOn = remoteVideoEnabled?.[item.socketId] ?? false;

    const videoTrack = stream?.getVideoTracks()?.[0];

    const isLocalVideoOn =
      isLocal &&
      videoTrack &&
      videoTrack.enabled &&
      videoTrack.readyState === "live";

    const isRemoteVideoValid =
      !isLocal &&
      isRemoteVideoOn &&
      videoTrack &&
      videoTrack.readyState === "live";

    const shouldShowVideo = isLocal ? isLocalVideoOn : isRemoteVideoValid;

    const avatarUrl = item.user?.avatar?.url;
    const displayName = item.user?.name || "Participante";

    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          backgroundColor: "#29292E",
          overflow: "hidden",
          borderRadius: 12,
        }}
      >
        {shouldShowVideo && stream ? (
          <WebStreamPlayer stream={stream} isLocal={isLocal} />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#29292E",
            }}
          >
            <Avatar>
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt={displayName} />
              ) : (
                <div style={{ color: "#fff", fontWeight: 700 }}>
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
            </Avatar>
          </div>
        )}

        {remoteAudioMuted && !isLocal && (
          <div
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              borderRadius: 12,
              padding: 6,
              zIndex: 5,
            }}
          >
            <MicOff size={14} color="#E83F5B" />
          </div>
        )}

        <NameContainer>
          <Name>{isLocal ? `${displayName} (Você)` : displayName}</Name>
        </NameContainer>
      </div>
    );
  };

  useEffect(() => {
    const handleRoomError = ({ message }: { message?: string }) => {
      if (message) showCallAlert(message);
    };

    const handleRoomClosed = ({ reason }: { reason?: string }) => {
      if (reason === "inactivity_timeout") {
        showCallAlert("Chamada encerrada por inatividade.");
        return;
      }
      showCallAlert("A sala de chamada foi encerrada.");
    };

    socket?.on("call_error", handleRoomError);
    socket?.on("error_join_call_room", handleRoomError);
    socket?.on("call_room_closed", handleRoomClosed);

    return () => {
      socket?.off("call_error", handleRoomError);
      socket?.off("error_join_call_room", handleRoomError);
      socket?.off("call_room_closed", handleRoomClosed);
    };
  }, [socket]);

  return (
    <Container>
      <Header>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Botão de minimizar/voltar sem encerrar a chamada */}
          <button
            onClick={handleMinimize}
            title="Minimizar chamada"
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              border: "none",
              color: "#FFF",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: "50%",
              transition: "background 0.2s",
            }}
          >
            <ArrowLeft size={20} />
          </button>

          <HeaderTitle>Sala de Chamada</HeaderTitle>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ParticipantCount>
            {totalParticipants} participante{totalParticipants > 1 ? "s" : ""}
          </ParticipantCount>

          {hasMore && (
            <button
              onClick={() => setParticipantsModalVisible(true)}
              style={{
                background: "none",
                border: "none",
                color: "#FF9D00",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Users size={18} />
            </button>
          )}
        </div>
      </Header>

      {focusedParticipant ? (
        <DirectCallContainer>
          <FullscreenCard>
            {renderParticipantContent(focusedParticipant)}
          </FullscreenCard>
          <MiniCard onClick={() => setIsLocalPrimary((prev) => !prev)}>
            {renderParticipantContent(localParticipant ?? participants[0])}
          </MiniCard>
        </DirectCallContainer>
      ) : isDirectCall && primaryParticipant && secondaryParticipant ? (
        <DirectCallContainer>
          <FullscreenCard>
            {renderParticipantContent(primaryParticipant)}
          </FullscreenCard>
          <MiniCard onClick={() => setIsLocalPrimary((prev) => !prev)}>
            {renderParticipantContent(secondaryParticipant)}
          </MiniCard>
        </DirectCallContainer>
      ) : (
        <GridContainer>
          {visibleParticipants.map((item) => (
            <ParticipantCard
              key={item.socketId}
              totalItems={displayedCardsCount}
            >
              {renderParticipantContent(item)}
            </ParticipantCard>
          ))}
        </GridContainer>
      )}

      {/* Modal de Lista de Participantes */}
      {isParticipantsModalVisible && (
        <ModalOverlay onClick={() => setParticipantsModalVisible(false)}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <HeaderTitle style={{ fontSize: 18 }}>
                Participantes ({totalParticipants})
              </HeaderTitle>
              <button
                onClick={() => setParticipantsModalVisible(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                <X size={20} />
              </button>
            </ModalHeader>

            <ModalContent>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                {participants.map((item) => (
                  <div
                    key={item.socketId}
                    onClick={() => {
                      setParticipantsModalVisible(false);
                      setFocusedParticipant(item);
                    }}
                    style={{
                      height: 140,
                      borderRadius: 12,
                      overflow: "hidden",
                      cursor: "pointer",
                    }}
                  >
                    {renderParticipantContent(item)}
                  </div>
                ))}
              </div>
            </ModalContent>
          </ModalContainer>
        </ModalOverlay>
      )}

      <CustomAlert
        title={callAlert.title}
        content={callAlert.content}
        visible={callAlert.visible}
        okButtonText="OK"
        okButtonAction={closeCallAlert}
      />

      <ControlsBar>
        <ControlButton onClick={handleToggleMute} isActive={!isMuted}>
          {isMuted ? (
            <MicOff size={22} color="#FFF" />
          ) : (
            <Mic size={22} color="#FFF" />
          )}
        </ControlButton>

        <ControlButton onClick={handleToggleVideo} isActive={isVideoEnabled}>
          {isVideoEnabled ? (
            <Video size={22} color="#FFF" />
          ) : (
            <VideoOff size={22} color="#FFF" />
          )}
        </ControlButton>

        <EndCallButton onClick={handleEndCall}>
          <PhoneOff size={22} color="#FFF" />
        </EndCallButton>
      </ControlsBar>
    </Container>
  );
};

export default Call;
