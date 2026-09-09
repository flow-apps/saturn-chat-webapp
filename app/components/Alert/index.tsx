import React, { memo, useCallback, useEffect } from "react";
import {
  Overlay,
  AlertModal,
  AlertTitle,
  AlertContent,
  AlertButtonsContainer,
  AlertOkButton,
  AlertCancelButton,
  AlertExtraButton,
  AlertOptionsContainer,
  AlertOptionButton,
} from "./styles";

interface AlertProps {
  options?: { text: string; action: () => any }[];
  title: string;
  content: string;
  okButtonText?: string;
  cancelButtonText?: string;
  extraButtonText?: string;
  okButtonAction?: () => any;
  cancelButtonAction?: () => any;
  extraButtonAction?: () => any;
  extraButton?: boolean;
  visible: boolean;
}

const Alert = ({
  options,
  title,
  content,
  okButtonText,
  cancelButtonText,
  okButtonAction,
  cancelButtonAction,
  extraButton = false,
  extraButtonText,
  extraButtonAction,
  visible,
}: AlertProps) => {
  const handleOkButton = useCallback(() => {
    if (okButtonAction) {
      return okButtonAction();
    }
  }, [okButtonAction]);

  const handleCancelButton = useCallback(() => {
    if (cancelButtonAction) {
      return cancelButtonAction();
    }
  }, [cancelButtonAction]);

  const handleExtraButton = useCallback(() => {
    if (extraButtonAction) {
      return extraButtonAction();
    }
  }, [extraButtonAction]);

  // Suporte para fechar o modal ao pressionar 'Escape' na Web
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && visible && cancelButtonAction) {
        cancelButtonAction();
      }
    };

    if (visible) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [visible, cancelButtonAction]);

  if (!visible) return null;

  return (
    <Overlay onClick={cancelButtonAction}>
      <AlertModal onClick={(e) => e.stopPropagation()}>
        <AlertTitle>{title}</AlertTitle>
        <AlertContent>{content}</AlertContent>

        {options?.length ? (
          <AlertOptionsContainer>
            {options.map(({ text, action }) => (
              <AlertOptionButton key={text} onClick={action}>
                {text}
              </AlertOptionButton>
            ))}
          </AlertOptionsContainer>
        ) : (
          <AlertButtonsContainer>
            <AlertOkButton onClick={handleOkButton}>
              {okButtonText || "OK"}
            </AlertOkButton>

            {cancelButtonAction && (
              <AlertCancelButton onClick={handleCancelButton}>
                {cancelButtonText || "Cancelar"}
              </AlertCancelButton>
            )}

            {extraButton && extraButtonText && (
              <AlertExtraButton onClick={handleExtraButton}>
                {extraButtonText}
              </AlertExtraButton>
            )}
          </AlertButtonsContainer>
        )}
      </AlertModal>
    </Overlay>
  );
};

export default memo(Alert);