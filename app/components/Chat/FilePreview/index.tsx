import React, { useCallback, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import {
  Image,
  FileText,
  FileMinus,
  Video,
  Headphones,
  File as FileIcon,
  Download,
  PlayCircle,
  FileSpreadsheet,
} from "lucide-react";

import { convertBytesToMB } from "~/utils/convertSize";
import CustomAlert from "~/components/Alert";
import AudioPreview from "./AudioPreview";

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
  const navigate = useNavigate();

  const handleDownloadFile = () => {
    setDownloadWarning(true);
  };

  const downloadFile = useCallback(async () => {
    setDownloadWarning(false);
    if (!url) return;

    try {
      const response = await fetch(url);
      const blob = await response.blob();
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
      // Fallback para abertura em nova aba se o CORS impedir fetch do Blob
      window.open(url, "_blank");
    }
  }, [url, original_name, name]);

  const handleGoImagePreview = () => {
    navigate(`/preview/image?url=${encodeURIComponent(url || "")}&title=${encodeURIComponent(original_name)}`);
  };

  const handleGoVideoPreview = () => {
    navigate(`/preview/video?url=${encodeURIComponent(url || "")}&title=${encodeURIComponent(original_name)}`);
  };

  const handleGoPdfPreview = () => {
    navigate(`/preview/pdf?url=${encodeURIComponent(url || "")}&title=${encodeURIComponent(original_name)}`);
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

  const renderPreview = () => {
    if (type === "image") {
      return (
        <FileButton onClick={handleGoImagePreview} title="Ver imagem">
          <FileImagePreview src={url} alt={original_name} loading="lazy" />
        </FileButton>
      );
    }

    if (type === "video") {
      return (
        <FileButton onClick={handleGoVideoPreview} title="Assistir vídeo">
          <VideoPreviewWrapper>
            <video src={`${url}#t=0.5`} preload="metadata" muted />
            <PlayIconOverlay>
              <PlayCircle size={22} color="#ffffff" />
            </PlayIconOverlay>
          </VideoPreviewWrapper>
        </FileButton>
      );
    }

    if (type === "application" && name.endsWith(".pdf")) {
      return (
        <FileButton onClick={handleGoPdfPreview} title="Abrir PDF">
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

  return (
    <>
      <Container>
        <CustomAlert
          title="Baixar Arquivo"
          content={`Deseja fazer o download do arquivo "${original_name}"?`}
          visible={downloadWarning}
          cancelButtonText="Cancelar"
          okButtonText="Baixar"
          okButtonAction={downloadFile}
          cancelButtonAction={() => setDownloadWarning(false)}
        />

        <FileContainer>
          <FileIconContainer>{renderIcon()}</FileIconContainer>
          <FileInfosContainer>
            <FileName title={original_name}>{original_name}</FileName>
            <FileSize>{convertBytesToMB(size)}</FileSize>
          </FileInfosContainer>
          <FileOpenAction>{renderPreview()}</FileOpenAction>
        </FileContainer>
      </Container>

      {type === "audio" && <AudioPreview audio={{ name, url: String(url) }} />}
    </>
  );
};

export default React.memo(FilePreview);