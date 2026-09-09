import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { X, ExternalLink } from "lucide-react";
import {
  Overlay,
  ModalContainer,
  Header,
  Title,
  HeaderButton,
  PlayerContainer,
  IFrame,
} from "./styles";

interface IYouTubeIFrame {
  videoUrl: string;
  title: string;
}

export interface IYouTubeIFrameRef {
  openYouTubeIFrameModal: () => void;
}

const YouTubeIFrame: React.ForwardRefRenderFunction<
  IYouTubeIFrameRef,
  IYouTubeIFrame
> = ({ videoUrl, title }, ref) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [videoTitle, setVideoTitle] = useState(title);

  const videoId = useMemo(() => {
    if (!videoUrl) return null;
    const regExp =
      /(?:[?&]v=|youtu\.be\/|\/(?:embed|v|shorts|live)\/)([a-zA-Z0-9_-]{11})/;
    const match = videoUrl.match(regExp);

    if (match && match[1]) {
      return match[1];
    }
    return null;
  }, [videoUrl]);

  useEffect(() => {
    const fetchTitle = async () => {
      if (videoId) {
        try {
          const response = await fetch(
            `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`
          );
          const data = await response.json();
          if (data.title) {
            setVideoTitle(data.title);
          }
        } catch (error) {
          console.error("Erro ao buscar título do vídeo:", error);
        }
      }
    };
    fetchTitle();
  }, [videoId]);

  const openYouTubeIFrameModal = useCallback(() => {
    setModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const openVideoOnYouTube = useCallback(() => {
    if (videoUrl) {
      window.open(videoUrl, "_blank", "noopener,noreferrer");
    }
  }, [videoUrl]);

  // Permite fechar o modal ao pressionar 'Escape'
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && modalVisible) {
        handleCloseModal();
      }
    };

    if (modalVisible) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [modalVisible, handleCloseModal]);

  useImperativeHandle(ref, () => ({
    openYouTubeIFrameModal,
  }));

  if (!videoId || !modalVisible) return null;

  return (
    <Overlay onClick={handleCloseModal}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Header>
          <HeaderButton onClick={handleCloseModal} title="Fechar modal">
            <X size={22} />
          </HeaderButton>

          <Title title={videoTitle}>{videoTitle}</Title>

          <HeaderButton
            onClick={openVideoOnYouTube}
            title="Abrir no YouTube"
          >
            <ExternalLink size={20} />
          </HeaderButton>
        </Header>

        <PlayerContainer>
          <IFrame
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title={videoTitle}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </PlayerContainer>
      </ModalContainer>
    </Overlay>
  );
};

export default forwardRef(YouTubeIFrame);