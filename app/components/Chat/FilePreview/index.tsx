import React, { useCallback, useState, useEffect } from "react";
import {
  Image,
  FileText,
  Video,
  Headphones,
  File as FileIcon,
  Download,
  PlayCircle,
  FileSpreadsheet,
  X,
  ExternalLink,
} from "lucide-react";

import { convertBytesToMB } from "~/utils/convertSize";
import CustomAlert from "~/components/Alert";
import AudioPreview from "./AudioPreview";
import { useAuth } from "~/contexts/auth";

import {
  Container,
  FileContainer,
  FileIconContainer,
  FileInfosContainer,
  FileName,
  FileSize,
  FileOpenAction,
  FileButton,
  FileImagePreview,
  VideoPreviewWrapper,
  PlayIconOverlay,
  // Componentes do Modal
  Overlay,
  ModalContainer,
  ModalHeader,
  ModalHeaderButton,
  ModalTitle,
  ModalMediaContent,
  ModalImage,
  ModalVideo,
  ModalIFrame,
} from "./styles";

interface IFilePreviewProps {
  name: string;
  original_name: string;
  url?: string;
  uri?: string;
  size: number;
  type: string;
  deleted: boolean;
  antiPrint: boolean;
  conversationType: "GROUP" | "DIRECT";
}

type ModalType = "image" | "video" | "pdf" | null;

// Helper para garantir o MIME Type correto para a tag <video> ou <audio>
const inferMimeType = (
  filename: string,
  fileType: string,
  blobType: string,
) => {
  if (blobType && blobType !== "application/octet-stream") {
    return blobType;
  }

  const ext = filename?.split(".").pop()?.toLowerCase();

  if (
    fileType === "video" ||
    ext === "mp4" ||
    ext === "mov" ||
    ext === "webm"
  ) {
    return `video/${ext === "mov" ? "quicktime" : ext || "mp4"}`;
  }

  if (fileType === "audio" || ext === "m4a" || ext === "mp3" || ext === "ogg") {
    return `audio/${ext === "m4a" ? "mp4" : ext || "mpeg"}`;
  }

  if (
    fileType === "image" ||
    ext === "jpg" ||
    ext === "jpeg" ||
    ext === "png"
  ) {
    return `image/${ext === "jpg" ? "jpeg" : ext || "jpeg"}`;
  }

  if (ext === "pdf") {
    return "application/pdf";
  }

  return "application/octet-stream";
};

const FilePreview = ({
  name,
  original_name,
  size,
  url,
  type,
  deleted,
  antiPrint,
  conversationType,
}: IFilePreviewProps) => {
  const [downloadWarning, setDownloadWarning] = useState(false);
  const [protectedObjectUrl, setProtectedObjectUrl] = useState<string>("");
  const [loadingMedia, setLoadingMedia] = useState<boolean>(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const { token } = useAuth();

  useEffect(() => {
    let isMounted = true;
    let createdUrl = "";

    const loadMedia = async () => {
      if (!url) return;

      if (url.startsWith("blob:") || url.startsWith("data:")) {
        if (isMounted) {
          setProtectedObjectUrl(url);
          setLoadingMedia(false);
        }
        return;
      }

      if (!token) {
        return;
      }

      setLoadingMedia(true);

      try {
        // Envia Authorization com o A maiúsculo padrão HTTP
        const response = await fetch(url, {
          headers: {
            authorization: token,
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao carregar arquivo autenticado");
        }

        const rawBlob = await response.blob();

        // Garante a presença do MIME Type exato para liberar o player do navegador
        const exactMimeType = inferMimeType(
          original_name || name,
          type,
          rawBlob.type,
        );

        const blob = new Blob([rawBlob], { type: exactMimeType });
        createdUrl = window.URL.createObjectURL(blob);

        if (isMounted) {
          setProtectedObjectUrl(createdUrl);
        }
      } catch (error) {
        console.error("Erro no carregamento de mídia autenticada:", error);
        if (isMounted) {
          setProtectedObjectUrl(url);
        }
      } finally {
        if (isMounted) {
          setLoadingMedia(false);
        }
      }
    };

    loadMedia();

    return () => {
      isMounted = false;
      if (createdUrl) {
        window.URL.revokeObjectURL(createdUrl);
      }
    };
  }, [url, token, type, name, original_name]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && activeModal) {
        setActiveModal(null);
      }
    };

    if (activeModal) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeModal]);

  const handleDownloadFile = () => {
    setDownloadWarning(true);
  };

  const downloadFile = useCallback(async () => {
    setDownloadWarning(false);
    if (!url) return;

    try {
      if (protectedObjectUrl && protectedObjectUrl.startsWith("blob:")) {
        const link = document.createElement("a");
        link.href = protectedObjectUrl;
        link.download = original_name || name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }

      const response = await fetch(url, {
        headers: {
          authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao baixar arquivo autenticado");
      }

      const rawBlob = await response.blob();
      const exactMimeType = inferMimeType(
        original_name || name,
        type,
        rawBlob.type,
      );

      const blob = new Blob([rawBlob], { type: exactMimeType });
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = original_name || name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Erro ao baixar arquivo:", error);
      window.open(url, "_blank");
    }
  }, [url, token, original_name, name, protectedObjectUrl, type]);

  const handleOpenExternal = () => {
    const mediaSrc = protectedObjectUrl || url;
    if (mediaSrc) {
      window.open(mediaSrc, "_blank", "noopener,noreferrer");
    }
  };

  const renderIcon = () => {
    switch (type) {
      case "image":
        return <Image size={24} />;
      case "text":
        return <FileText size={24} />;
      case "application":
        return <FileSpreadsheet size={24} />;
      case "video":
        return <Video size={24} />;
      case "audio":
        return <Headphones size={24} />;
      default:
        return <FileIcon size={24} />;
    }
  };

  const renderPreviewButton = () => {
    const mediaSrc = protectedObjectUrl || url;

    if (type === "image") {
      return (
        <FileButton
          onClick={() => setActiveModal("image")}
          title="Ver imagem"
          disabled={loadingMedia}
        >
          <FileImagePreview src={mediaSrc} alt={original_name} loading="lazy" />
        </FileButton>
      );
    }

    if (type === "video") {
      return (
        <FileButton
          onClick={() => setActiveModal("video")}
          title="Assistir vídeo"
          disabled={loadingMedia}
        >
          <VideoPreviewWrapper>
            <video
              src={mediaSrc ? `${mediaSrc}#t=0.5` : undefined}
              preload="metadata"
              muted
            />
            <PlayIconOverlay>
              <PlayCircle size={22} color="#ffffff" />
            </PlayIconOverlay>
          </VideoPreviewWrapper>
        </FileButton>
      );
    }

    if (type === "application" && name.endsWith(".pdf")) {
      return (
        <FileButton
          onClick={() => setActiveModal("pdf")}
          title="Abrir PDF"
          disabled={loadingMedia}
        >
          <FileText size={26} color="#ef4444" />
        </FileButton>
      );
    }

    return (
      <FileButton onClick={handleDownloadFile} title="Baixar arquivo">
        <Download size={22} />
      </FileButton>
    );
  };

  const renderModalContent = () => {
    const mediaSrc = protectedObjectUrl || url;
    if (!mediaSrc) return null;

    if (activeModal === "image") {
      return <ModalImage src={mediaSrc} alt={original_name} />;
    }

    if (activeModal === "video") {
      return <ModalVideo src={mediaSrc} controls autoPlay />;
    }

    if (activeModal === "pdf") {
      return <ModalIFrame src={mediaSrc} title={original_name} />;
    }

    return null;
  };

  return (
    <>
      <Container>
        <FileContainer>
          <FileIconContainer>{renderIcon()}</FileIconContainer>
          <FileInfosContainer>
            <FileName title={original_name}>{original_name}</FileName>
            <FileSize>{convertBytesToMB(size)}</FileSize>
          </FileInfosContainer>
          <FileOpenAction>{renderPreviewButton()}</FileOpenAction>
        </FileContainer>
      </Container>

      {type === "audio" && (
        <AudioPreview
          audio={{ name, url: String(protectedObjectUrl || url) }}
        />
      )}

      {activeModal && (
        <Overlay onClick={() => setActiveModal(null)}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalHeaderButton
                onClick={() => setActiveModal(null)}
                title="Fechar"
              >
                <X size={22} />
              </ModalHeaderButton>

              <ModalTitle title={original_name}>{original_name}</ModalTitle>

              <ModalHeaderButton
                onClick={handleDownloadFile}
                title="Baixar arquivo"
              >
                <Download size={20} />
              </ModalHeaderButton>

              <ModalHeaderButton
                onClick={handleOpenExternal}
                title="Abrir em nova aba"
              >
                <ExternalLink size={20} />
              </ModalHeaderButton>
            </ModalHeader>

            <ModalMediaContent>{renderModalContent()}</ModalMediaContent>
          </ModalContainer>
        </Overlay>
      )}

      <CustomAlert
        title="Baixar Arquivo"
        content={`Deseja fazer o download do arquivo "${original_name}"?`}
        visible={downloadWarning}
        cancelButtonText="Cancelar"
        okButtonText="Baixar"
        okButtonAction={downloadFile}
        cancelButtonAction={() => setDownloadWarning(false)}
      />
    </>
  );
};

export default React.memo(FilePreview);
