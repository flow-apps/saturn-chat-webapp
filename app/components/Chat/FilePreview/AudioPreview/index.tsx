import React, { useEffect, useRef, useState, useCallback } from "react";
import { Play, Pause } from "lucide-react";
import { secondsToTime } from "~/utils/format";
import { useAudioPlayer } from "~/contexts/audioPlayer";
import { useAuth } from "~/contexts/auth";

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
  const { token } = useAuth();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string>("");

  useEffect(() => {
    let isMounted = true;

    const setupAudio = async () => {
      if (!audio.url) return;

      let finalAudioUrl = audio.url;

      if (!audio.url.startsWith("blob:") && !audio.url.startsWith("data:")) {
        if (!token) return;

        try {
          const response = await fetch(audio.url, {
            headers: {
              authorization: token,
            },
          });

          if (!response.ok) {
            throw new Error("Erro ao carregar áudio autenticado");
          }

          const rawBlob = await response.blob();
          const mimeType = rawBlob.type || "audio/*";
          const blob = new Blob([rawBlob], { type: mimeType });
          
          finalAudioUrl = window.URL.createObjectURL(blob);
          objectUrlRef.current = finalAudioUrl;
        } catch (error) {
          console.error("Erro no carregamento do áudio protegido:", error);
          finalAudioUrl = audio.url; // Fallback
        }
      }

      if (!isMounted) {
        if (objectUrlRef.current) {
          window.URL.revokeObjectURL(objectUrlRef.current);
        }
        return;
      }

      const audioElement = new Audio(finalAudioUrl);
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
    };

    setupAudio();

    return () => {
      isMounted = false;
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (objectUrlRef.current) {
        window.URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, [audio.url, token, setCurrentAudioName]);

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