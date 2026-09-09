import React, { useMemo, useEffect } from "react";
import { X, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { FileContainer, ImageFile, OtherFile, RemoveFileButton } from "./styles";

export interface SelectedFileType {
  file: File;
  type: string;
}

interface FileProps {
  file: SelectedFileType;
  onRemoveFile: () => void;
}

const SelectedFile = ({ onRemoveFile, file }: FileProps) => {
  // Gera URL temporária para o pré-visualizador de imagem do navegador
  const imagePreviewUrl = useMemo(() => {
    if (file.type === "image" && file.file) {
      return URL.createObjectURL(file.file);
    }
    return null;
  }, [file]);

  // Libera a memória da URL criada quando o componente for desmontado
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
        <RemoveFileButton onClick={onRemoveFile} type="button" title="Remover arquivo">
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