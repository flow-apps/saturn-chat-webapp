import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import SelectedFile from "~/components/Chat/SelectedFile";
import { FilesContainer, FilesList } from "./styles";

export interface FileItem {
  file: File;
  type: string;
}

interface SelectedFilesProps {
  files: FileItem[];
  onFileRemove: (index: number) => void;
}

const SelectedFiles = ({ files, onFileRemove }: SelectedFilesProps) => {
  if (!files || files.length === 0) return null;

  return (
    <FilesContainer>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 100 }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        style={{ width: "100%", height: "100%" }}
      >
        <FilesList>
          <AnimatePresence>
            {files.map((item, index) => (
              <SelectedFile
                key={`${item.file?.name || "file"}-${index}`}
                file={item}
                onRemoveFile={() => onFileRemove(index)}
              />
            ))}
          </AnimatePresence>
        </FilesList>
      </motion.div>
    </FilesContainer>
  );
};

export default React.memo(SelectedFiles);