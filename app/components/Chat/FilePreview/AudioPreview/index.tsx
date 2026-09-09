import React, { useEffect, useRef, useState, useCallback } from "react";
import { Play, Pause } from "lucide-react";
import { secondsToTime } from "~/utils/format";
import { useAudioPlayer } from "~/contexts/audioPlayer";

import {
  Container,
  AudioPreviewContainer,
  AudioPreviewControllersWrapper,
  AudioPreviewButton,
  AudioPreviewSeekContainer,
  AudioPreviewSeek,
  AudioPreviewDurationContainer,
  AudioPreviewDuration,
} from "./styles";

interface AudioPreviewProps {
  audio: {
    name: string;
    url: string;
  };
}

const AudioPreview: React.FC<AudioPreviewProps> = ({ audio }) => {
  const { currentAudioName, setCurrentAudioName } = useAudioPlayer();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audioElement = new Audio(audio.url);
    audioRef.current = audioElement;

    const handleLoadedMetadata = () => {
      setDuration(Math.ceil(audioElement.duration || 0));
    };

    const handleTimeUpdate = () => {
      setCurrentPosition(Math.ceil(audioElement.currentTime));
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentPosition(0);
      setCurrentAudioName("");
    };

    audioElement.addEventListener("loadedmetadata", handleLoadedMetadata);
    audioElement.addEventListener("timeupdate", handleTimeUpdate);
    audioElement.addEventListener("ended", handleEnded);

    return () => {
      audioElement.pause();
      audioElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audioElement.removeEventListener("timeupdate", handleTimeUpdate);
      audioElement.removeEventListener("ended", handleEnded);
    };
  }, [audio.url, setCurrentAudioName]);

  useEffect(() => {
    if (currentAudioName !== audio.name && isPlaying) {
      setIsPlaying(false);
      audioRef.current?.pause();
    }
  }, [currentAudioName, audio.name, isPlaying]);

  const playAndPause = useCallback(async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      setCurrentAudioName("");
      setIsPlaying(false);
      audioRef.current.pause();
    } else {
      setCurrentAudioName(audio.name);
      setIsPlaying(true);
      try {
        await audioRef.current.play();
      } catch (error) {
        console.error("Erro ao reproduzir preview de áudio:", error);
        setIsPlaying(false);
      }
    }
  }, [isPlaying, audio.name, setCurrentAudioName]);

  const seekAudio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPos = Number(e.target.value);
    setCurrentPosition(newPos);
    if (audioRef.current) {
      audioRef.current.currentTime = newPos;
    }
  };

  return (
    <Container>
      <AudioPreviewContainer>
        <AudioPreviewControllersWrapper>
          <AudioPreviewButton onClick={playAndPause} title={isPlaying ? "Pausar" : "Reproduzir"}>
            {isPlaying ? (
              <Pause size={18} />
            ) : (
              <Play size={18} style={{ marginLeft: 2 }} />
            )}
          </AudioPreviewButton>

          <AudioPreviewSeekContainer>
            <AudioPreviewSeek
              type="range"
              min={0}
              max={duration || 100}
              value={currentPosition}
              onChange={seekAudio}
              style={{
                backgroundSize: `${(currentPosition * 100) / (duration || 1)}% 100%`,
              }}
            />
          </AudioPreviewSeekContainer>

          <AudioPreviewDurationContainer>
            <AudioPreviewDuration>
              {isPlaying || currentPosition > 0
                ? secondsToTime(currentPosition)
                : secondsToTime(duration)}
            </AudioPreviewDuration>
          </AudioPreviewDurationContainer>
        </AudioPreviewControllersWrapper>
      </AudioPreviewContainer>
    </Container>
  );
};

export default React.memo(AudioPreview);