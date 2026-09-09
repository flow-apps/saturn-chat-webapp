import React, { useEffect, useRef, useState, useCallback } from "react";
import { Play, Pause } from "lucide-react";
import { secondsToTime } from "~/utils/format";
import { AudioData } from "~/types/interfaces";
import { useAudioPlayer } from "~/contexts/audioPlayer";

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
  audio: AudioData;
}

const AudioPlayer = ({ audio }: IAudioPlayer) => {
  const { currentAudioName, setCurrentAudioName } = useAudioPlayer();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Inicializa a instância do áudio nativo do navegador
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

  // Se outro áudio do chat começar a tocar, pausa este
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

  const seekAudio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPos = Number(e.target.value);
    setCurrentPosition(newPos);
    if (audioRef.current) {
      audioRef.current.currentTime = newPos;
    }
  };

  return (
    <Container>
      <AudioContainerWrapper>
        <AudioControllerContainer>
          <AudioController onClick={playAndPause} title={isPlaying ? "Pausar" : "Reproduzir"}>
            {isPlaying ? <Pause size={22} /> : <Play size={22} style={{ marginLeft: 2 }} />}
          </AudioController>

          <SeekBarContainer>
            <SeekBar
              type="range"
              min={0}
              max={duration || 100}
              value={currentPosition}
              onChange={seekAudio}
              style={{
                backgroundSize: `${(currentPosition * 100) / (duration || 1)}% 100%`,
              }}
            />
          </SeekBarContainer>

          <AudioDurationContainer>
            <AudioDuration>
              {isPlaying || currentPosition > 0
                ? secondsToTime(currentPosition)
                : secondsToTime(duration)}
            </AudioDuration>
          </AudioDurationContainer>
        </AudioControllerContainer>
      </AudioContainerWrapper>
    </Container>
  );
};

export default React.memo(AudioPlayer);