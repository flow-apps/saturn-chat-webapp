import React, { useMemo, useEffect } from "react";
import { X, FileText } from "lucide-react";
import { motion } from "framer-motion";
import {
  FileContainer,
  ImageFile,
  OtherFile,
  RemoveFileButton,
} from "./styles";
import { File as FileType } from "../ChatInput/types";

interface SelectedFileProps {
  file: FileType;
  onRemoveFile: () => void;
}

const SelectedFile = ({ onRemoveFile, file }: SelectedFileProps) => {
  // Gera uma Object URL temporária para o navegador conseguir renderizar a prévia da imagem
  const imagePreviewUrl = useMemo(() => {
    if (file.type === "image" && file.file) {
      return URL.createObjectURL(file.file);
    }
    return null;
  }, [file]);

  // Libera a memória alocada pela URL temporária quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      <FileContainer>
        <RemoveFileButton
          onClick={onRemoveFile}
          type="button"
          title="Remover arquivo"
        >
          <X size={14} />
        </RemoveFileButton>

        {file.type === "image" && imagePreviewUrl ? (
          <ImageFile src={imagePreviewUrl} alt={file.file.name || "Prévia"} />
        ) : (
          <OtherFile title={file.file?.name}>
            <FileText size={28} />
          </OtherFile>
        )}
      </FileContainer>
    </motion.div>
  );
};

export default React.memo(SelectedFile);
