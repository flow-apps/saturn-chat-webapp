import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router";
import { PlayCircle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify"; // Ou a biblioteca de toast de sua preferência

import { LinkData } from "~/types/interfaces";
import YouTubeIFrame, {
  IYouTubeIFrameRef,
} from "~/components/Chat/RichContent/YouTubeIFrame";

import {
  Container,
  WebsiteNameContainer,
  WebsiteName,
  WebsiteHeaderContainer,
  WebsiteTitleContainer,
  WebsiteFaviconContainer,
  WebsiteFavicon,
  WebsiteTitle,
  WebsiteDescriptionContainer,
  WebsiteDescription,
  WebsiteImageContainer,
  WebsiteImage,
  VideoIndicatorContainer,
  VideoIndicator,
  VideoIndicatorText,
} from "./styles";

interface LinkPreviewProps {
  link: LinkData;
  openLink: (link: string) => void;
  antiPrint: boolean;
  conversationType: "GROUP" | "DIRECT";
}

const LinkPreview: React.FC<LinkPreviewProps> = ({
  link,
  openLink,
  antiPrint,
  conversationType,
}) => {
  const ytIFrameRef = useRef<IYouTubeIFrameRef>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [displayTitle, setDisplayTitle] = useState(link.title || link.link);
  const [imageError, setImageError] = useState(false);

  const navigate = useNavigate();

  const isYoutubeLink = useMemo(() => !!videoId, [videoId]);

  const imageUri = useMemo(() => {
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
    return link.image;
  }, [videoId, link.image]);

  const copyLink = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      try {
        await navigator.clipboard.writeText(link.link);
        toast.success("Link copiado para a área de transferência!");
      } catch (err) {
        console.error("Erro ao copiar link:", err);
      }
    },
    [link.link],
  );

  const handlePreview = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      if (isYoutubeLink) {
        return ytIFrameRef.current?.openYouTubeIFrameModal();
      }

      if (link.image) {
        navigate(
          `/preview/image?url=${encodeURIComponent(
            link.image,
          )}&title=${encodeURIComponent(link.link)}`,
        );
      }
    },
    [isYoutubeLink, link.image, link.link, navigate],
  );

  useEffect(() => {
    const fetchYouTubeData = async () => {
      const regExp =
        /(?:[?&]v=|youtu\.be\/|\/(?:embed|v|shorts|live)\/)([a-zA-Z0-9_-]{11})/;
      const match = link.link.match(regExp);
      if (match && match[1]) {
        const currentVideoId = match[1];
        setVideoId(currentVideoId);
        try {
          const response = await fetch(
            `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${currentVideoId}`,
          );
          const data = await response.json();
          if (data.title) {
            setDisplayTitle(data.title);
          }
        } catch (error) {
          console.error("Erro ao buscar dados do YouTube:", error);
        }
      } else {
        setVideoId(null);
        setDisplayTitle(link.title || link.link);
      }
    };
    fetchYouTubeData();
  }, [link.link, link.title]);

  return (
    <>
      {isYoutubeLink && (
        <YouTubeIFrame
          ref={ytIFrameRef}
          title={displayTitle}
          videoUrl={link.link}
        />
      )}
      <Container onClick={() => openLink(link.link)}>
        {!!link.siteName && (
          <WebsiteNameContainer>
            <WebsiteName>{link.siteName}</WebsiteName>
          </WebsiteNameContainer>
        )}

        <WebsiteHeaderContainer>
          <WebsiteTitleContainer
            onClick={(e) => {
              e.stopPropagation();
              openLink(link.link);
            }}
            onContextMenu={copyLink}
            title="Clique para abrir, botão direito para copiar"
          >
            {!!link.favicon && (
              <WebsiteFaviconContainer>
                <WebsiteFavicon
                  src={link.favicon}
                  alt={link.siteName || "Favicon"}
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </WebsiteFaviconContainer>
            )}
            <WebsiteTitle>{displayTitle}</WebsiteTitle>
          </WebsiteTitleContainer>
        </WebsiteHeaderContainer>

        {!!link.description && (
          <WebsiteDescriptionContainer>
            <WebsiteDescription>{link.description}</WebsiteDescription>
          </WebsiteDescriptionContainer>
        )}

        {!!imageUri && !imageError && (
          <WebsiteImageContainer onClick={handlePreview}>
            <WebsiteImage
              src={imageUri}
              alt={displayTitle}
              onError={() => setImageError(true)}
              loading="lazy"
            />
            {isYoutubeLink && (
              <VideoIndicatorContainer onClick={handlePreview}>
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <VideoIndicator>
                    <PlayCircle size={36} color="#ffffff" />
                    <VideoIndicatorText>Assistir Vídeo</VideoIndicatorText>
                  </VideoIndicator>
                </motion.div>
              </VideoIndicatorContainer>
            )}
          </WebsiteImageContainer>
        )}
      </Container>
    </>
  );
};

export default memo(LinkPreview, (prev, next) => {
  return prev.link.link === next.link.link;
});
