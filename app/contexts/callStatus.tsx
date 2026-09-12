import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { useCallRoom } from "~/hooks/useCallRoom";
import { RoomUser } from "~/types/interfaces";
interface ICallStatusContext {
  activeCallRoomId: string | null;
  setActiveCallRoom: (roomId: string | null) => void;
  clearActiveCallRoom: () => void;
  localStream: MediaStream | null;
  remoteStreams: { [socketId: string]: MediaStream };
  participants: RoomUser[];
  remoteVideoEnabled: { [socketId: string]: boolean };
  remoteAudioMuted: { [socketId: string]: boolean };
  toggleAudio: (isMuted: boolean) => void;
  toggleVideo: (enableVideo: boolean) => Promise<void>;
  endCall: () => void;
  isVideoEnabled: boolean;
  setVideoEnabled: (value: boolean) => Promise<void>;
}

const CallStatusContext = createContext<ICallStatusContext>({
  activeCallRoomId: null,
  setActiveCallRoom: () => undefined,
  clearActiveCallRoom: () => undefined,
  localStream: null,
  remoteStreams: {},
  participants: [],
  remoteVideoEnabled: {},
  remoteAudioMuted: {},
  toggleAudio: () => undefined,
  toggleVideo: async () => undefined,
  endCall: () => undefined,
  isVideoEnabled: false,
  setVideoEnabled: async () => undefined,
});

export const CallStatusProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeCallRoomId, setActiveCallRoomId] = useState<string | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState<boolean>(false);

  const onEndCall = useCallback(() => {
    setActiveCallRoomId(null);
    setIsVideoEnabled(false);
  }, [activeCallRoomId, isVideoEnabled]);

  const session = useCallRoom(activeCallRoomId, onEndCall);

  const setActiveCallRoom = useCallback((roomId: string | null) => {
    setActiveCallRoomId(roomId);
  }, []);

  const endCall = useCallback(() => {
    if (session?.endCall) {
      session.endCall();
    }
    setActiveCallRoomId(null);
    setIsVideoEnabled(false);
  }, [session]);

  const clearActiveCallRoom = useCallback(() => {
    endCall();
  }, [endCall]);

  const setVideoEnabled = useCallback(
    async (value: boolean) => {
      if (session?.toggleVideo) {
        await session.toggleVideo(value);
      }
      setIsVideoEnabled(value);
    },
    [session],
  );

  const value = useMemo(
    () => ({
      activeCallRoomId,
      setActiveCallRoom,
      clearActiveCallRoom,
      localStream: (session?.localStream as MediaStream) || null,
      remoteStreams:
        (session?.remoteStreams as { [socketId: string]: MediaStream }) || {},
      participants: session?.participants || [],
      remoteVideoEnabled: session?.remoteVideoEnabled || {},
      remoteAudioMuted: session?.remoteAudioMuted || {},
      toggleAudio: session?.toggleAudio || (() => undefined),
      toggleVideo: session?.toggleVideo || (async () => undefined),
      endCall,
      isVideoEnabled,
      setVideoEnabled,
    }),
    [
      activeCallRoomId,
      clearActiveCallRoom,
      endCall,
      isVideoEnabled,
      session,
      setActiveCallRoom,
      setVideoEnabled,
    ],
  );

  return (
    <CallStatusContext.Provider value={value}>
      {children}
    </CallStatusContext.Provider>
  );
};

export const useCallStatus = () => useContext(CallStatusContext);
