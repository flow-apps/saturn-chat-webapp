import { useEffect, useState } from "react";

export type ConversationType = "GROUP" | "DIRECT";

interface ScreenshotBlockedParams {
  antiPrint: boolean;
  conversationType?: ConversationType;
  settingsLoading: boolean;
}

export function isScreenshotBlocked({
  antiPrint,
  conversationType,
  settingsLoading,
}: ScreenshotBlockedParams) {
  if (settingsLoading) {
    return false;
  }

  if (conversationType !== "GROUP" && conversationType !== "DIRECT") {
    return false;
  }

  return antiPrint;
}

export function useScreenshotProtection(
  blocked: boolean,
  settingsLoading: boolean,
  key = "conversation"
) {
  const [screenshotAlertVisible, setScreenshotAlertVisible] = useState(false);

  useEffect(() => {
    if (settingsLoading || !blocked) {
      return;
    }

    // 1. Detecta o acionamento da tecla PrintScreen
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "PrintScreen" ||
        (event.ctrlKey && event.key === "p") || // Ctrl + P (Impressão)
        (event.metaKey && event.shiftKey && (event.key === "3" || event.key === "4" || event.key === "5")) // Atalhos do macOS
      ) {
        setScreenshotAlertVisible(true);
      }
    };

    // 2. Limpa o clipboard se o usuário tentar copiar imagem do print
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "PrintScreen") {
        navigator.clipboard?.writeText("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [blocked, settingsLoading]);

  return {
    screenshotAlertVisible,
    dismissScreenshotAlert: () => setScreenshotAlertVisible(false),
  };
}