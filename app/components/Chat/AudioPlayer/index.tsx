import React, { useEffect, useRef, useState, useCallback } from "react";
import { Play, Pause } from "lucide-react";
import { millisToTime, secondsToTime } from "~/utils/format";
import { AudioData } from "~/types/interfaces";
import { useAudioPlayer } from "~/contexts/audioPlayer";
import { useAuth } from "~/contexts/auth";

import {
  Container,
  AudioContainerWrapper,
  AudioControllerContainer,
  AudioController,
  SeekBarContainer,
  SeekBar,
  AudioDurationContainer,
  AudioDuration,
} from "./styles";

interface IAudioPlayer {
  audio: AudioData & { duration?: number };
}

const AudioPlayer = ({ audio }: IAudioPlayer) => {
  const { currentAudioName, setCurrentAudioName } = useAudioPlayer();
  const { token } = useAuth();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);

  // Normaliza a duração: se vier em milissegundos (> 1000), converte para segundos
  const initialDurationInSeconds = audio.duration
    ? audio.duration > 1000
      ? audio.duration / 1000
      : audio.duration
    : 0;

  const [duration, setDuration] = useState(initialDurationInSeconds);

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
          finalAudioUrl = audio.url;
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
        if (
          audioElement.duration &&
          !isNaN(audioElement.duration) &&
          audioElement.duration !== Infinity
        ) {
          setDuration(audioElement.duration);
        }
      };

      const handleTimeUpdate = () => {
        setCurrentPosition(audioElement.currentTime);
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
        console.error("Erro ao reproduzir áudio:", error);
        setIsPlaying(false);
      }
    }
  }, [isPlaying, audio.name, setCurrentAudioName]);

  const seekAudio = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newPos = Number(e.target.value);
    setCurrentPosition(newPos);
    if (audioRef.current) {
      audioRef.current.currentTime = newPos;
    }
  }, []);

  const displayTime =
    isPlaying || currentPosition > 0 ? currentPosition : duration;

  // Como o helper millisToTime espera milissegundos e secondsToTime espera segundos,
  // multiplicamos por 1000 caso sua função `millisToTime` seja a padrão do projeto para formatação:
  const formattedTime = millisToTime
    ? millisToTime(displayTime * 1000)
    : secondsToTime(displayTime);

  return (
    <Container>
      <AudioContainerWrapper>
        <AudioControllerContainer>
          <AudioController
            onClick={playAndPause}
            title={isPlaying ? "Pausar" : "Reproduzir"}
          >
            {isPlaying ? (
              <Pause size={22} />
            ) : (
              <Play size={22} style={{ marginLeft: 2 }} />
            )}
          </AudioController>

          <SeekBarContainer>
            <SeekBar
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentPosition}
              onChange={seekAudio}
              style={{
                backgroundSize: `${(currentPosition * 100) / (duration || 1)}% 100%`,
              }}
            />
          </SeekBarContainer>

          <AudioDurationContainer>
            <AudioDuration>{formattedTime}</AudioDuration>
          </AudioDurationContainer>
        </AudioControllerContainer>
      </AudioContainerWrapper>
    </Container>
  );
};

export default React.memo(AudioPlayer);
