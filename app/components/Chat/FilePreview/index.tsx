import React, { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Image,
  FileText,
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
  const [protectedObjectUrl, setProtectedObjectUrl] = useState<string>("");
  const [loadingMedia, setLoadingMedia] = useState<boolean>(false);

  const navigate = useNavigate();
  const { token } = useAuth();

  // Busca a mídia enviando os headers de autenticação e gera uma Object URL local
  useEffect(() => {
    let isMounted = true;
    let createdUrl = "";

    const fetchProtectedMedia = async () => {
      if (!url) return;

      // Se a URL já for um blob local ou base64, utiliza diretamente
      if (url.startsWith("blob:") || url.startsWith("data:")) {
        setProtectedObjectUrl(url);
        return;
      }

      setLoadingMedia(true);

      try {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao carregar mídia autenticada");
        }

        const blob = await response.blob();
        createdUrl = window.URL.createObjectURL(blob);

        if (isMounted) {
          setProtectedObjectUrl(createdUrl);
        }
      } catch (error) {
        console.error("Erro no carregamento de mídia com cabeçalho:", error);
      } finally {
        if (isMounted) {
          setLoadingMedia(false);
        }
      }
    };

    fetchProtectedMedia();

    // Revoga a Object URL para evitar vazamentos de memória no navegador
    return () => {
      isMounted = false;
      if (createdUrl) {
        window.URL.revokeObjectURL(createdUrl);
      }
    };
  }, [url, token]);

  const handleDownloadFile = () => {
    setDownloadWarning(true);
  };

  const downloadFile = useCallback(async () => {
    setDownloadWarning(false);
    if (!url) return;

    try {
      console.log(token);
      
      const response = await fetch(url, {
        headers: {
          Authorization: `${token}`,
        },
      });

      

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
      if (protectedObjectUrl) {
        const link = document.createElement("a");
        link.href = protectedObjectUrl;
        link.download = original_name || name;
        link.click();
      }
    }
  }, [url, token, original_name, name, protectedObjectUrl]);

  const handleGoImagePreview = () => {
    const targetUrl = protectedObjectUrl || url || "";
    navigate(
      `/preview/image?url=${encodeURIComponent(
        targetUrl
      )}&title=${encodeURIComponent(original_name)}`
    );
  };

  const handleGoVideoPreview = () => {
    const targetUrl = protectedObjectUrl || url || "";
    navigate(
      `/preview/video?url=${encodeURIComponent(
        targetUrl
      )}&title=${encodeURIComponent(original_name)}`
    );
  };

  const handleGoPdfPreview = () => {
    const targetUrl = protectedObjectUrl || url || "";
    navigate(
      `/preview/pdf?url=${encodeURIComponent(
        targetUrl
      )}&title=${encodeURIComponent(original_name)}`
    );
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
    const mediaSrc = protectedObjectUrl || url;

    if (type === "image") {
      return (
        <FileButton
          onClick={handleGoImagePreview}
          title="Ver imagem"
          disabled={loadingMedia}
        >
          <FileImagePreview
            src={mediaSrc}
            alt={original_name}
            loading="lazy"
          />
        </FileButton>
      );
    }

    if (type === "video") {
      return (
        <FileButton
          onClick={handleGoVideoPreview}
          title="Assistir vídeo"
          disabled={loadingMedia}
        >
          <VideoPreviewWrapper>
            <video src={mediaSrc ? `${mediaSrc}#t=0.5` : undefined} preload="metadata" muted />
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

      {type === "audio" && (
        <AudioPreview
          audio={{ name, url: String(protectedObjectUrl || url) }}
        />
      )}
    </>
  );
};

export default React.memo(FilePreview);