import React from "react";
import { Mic } from "lucide-react";
import { secondsToTime } from "~/utils/format";
import {
  RecordingAudioContainer,
  RecordingAudioWrapper,
  RecordingAudioText,
  RecordingAudioDuration,
  RecordingPulseDot,
} from "./styles";

interface RecordingAudioProps {
  audioDuration: number; // Duração em milissegundos ou segundos
}

const RecordingAudio: React.FC<RecordingAudioProps> = ({ audioDuration }) => {
  // Converte de milissegundos para segundos se necessário
  const durationInSeconds =
    audioDuration > 1000
      ? Math.round(audioDuration / 1000)
      : audioDuration;

  return (
    <RecordingAudioContainer>
      <RecordingAudioWrapper>
        <RecordingPulseDot />
        <Mic size={18} style={{ color: "#ef4444" }} />
        <RecordingAudioText>Gravando áudio...</RecordingAudioText>
      </RecordingAudioWrapper>

      <RecordingAudioDuration>
        {secondsToTime(durationInSeconds)}
      </RecordingAudioDuration>
    </RecordingAudioContainer>
  );
};

export default React.memo(RecordingAudio);