import React from "react";
import { Trash2, Send } from "lucide-react";
import RecordingAudio from "~/components/Chat/RecordingAudio";
import {
  AudioRecordingContainer,
  CancelAudioButton,
  SendAudioButton,
} from "./styles";

interface AudioRecordingBarProps {
  audioDuration: number;
  onCancel: () => void;
  onSend: () => void;
}

export const AudioRecordingBar: React.FC<AudioRecordingBarProps> = ({
  audioDuration,
  onCancel,
  onSend,
}) => {
  return (
    <AudioRecordingContainer>
      <CancelAudioButton onClick={onCancel} type="button" title="Cancelar gravação">
        <Trash2 size={22} />
      </CancelAudioButton>

      <RecordingAudio audioDuration={audioDuration} />

      <SendAudioButton onClick={onSend} type="button" title="Enviar áudio">
        <Send size={20} />
      </SendAudioButton>
    </AudioRecordingContainer>
  );
};