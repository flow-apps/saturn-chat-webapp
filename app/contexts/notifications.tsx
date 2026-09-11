import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import OneSignal from "react-onesignal";

import api from "~/services/api";
import config from "~/config";
import { useAuth } from "./auth";

interface NotificationsContextProps {
  enabled: boolean;
  toggleEnabledNotifications: () => Promise<void>;
  requestPermission: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextProps>(
  {} as NotificationsContextProps,
);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [enabled, setEnabled] = useState<boolean>(true);
  const [initialized, setInitialized] = useState<boolean>(false);
  const { signed } = useAuth();

  const platform = useMemo(() => "web", []);
  const language = useMemo(() => navigator.language || "pt-BR", []);

  useEffect(() => {
    const initOneSignal = async () => {
      try {
        await OneSignal.init({
          appId: config.OneSignalAppID,
          allowLocalhostAsSecureOrigin: import.meta.env.DEV,
        });

        setInitialized(true);

        if (OneSignal.Notifications.permission === false) {
          await OneSignal.Notifications.requestPermission();
        }

        OneSignal.User.PushSubscription.addEventListener(
          "change",
          async (event) => {
            if (event.current.id && signed) {
              await api.post("/users/notify/register", {
                platform,
                language,
                pushToken: event.current.id,
              });
            }
          },
        );
      } catch (error) {
        console.error("Erro ao inicializar o OneSignal Web:", error);
      }
    };

    if (!initialized) {
      initOneSignal();
    }
  }, [initialized, signed, platform, language]);

  const sendTokenToBackend = useCallback(async () => {
    if (!signed || !initialized) return;

    try {
      if (Notification.permission !== "granted") {
        return;
      }

      const pushToken = OneSignal.User.PushSubscription.id;

      if (!pushToken) {
        return;
      }

      const res = await api.post("/users/notify/register", {
        platform,
        language,
        pushToken,
      });

      if (res.status === 200 || res.status === 201) {
        setEnabled(!!res.data.send_notification);
      }
    } catch (error) {
      console.error("Erro ao enviar token de notificação ao backend:", error);
    }
  }, [signed, initialized, platform, language]);

  useEffect(() => {
    if (signed && initialized) {
      sendTokenToBackend();
    }
  }, [signed, initialized, sendTokenToBackend]);

  const toggleEnabledNotifications = async () => {
    if (!signed) return;

    const nextState = !enabled;
    setEnabled(nextState);

    try {
      await api.patch(
        `/users/notify/toggle?enabled=${nextState ? "1" : "0"}&platform=${platform}`,
      );
    } catch (error) {
      console.error("Erro ao alternar permissão de notificação:", error);
      setEnabled(!nextState);
    }
  };

  const requestPermission = async () => {
    try {
      await OneSignal.Notifications.requestPermission();
    } catch (error) {
      console.error("Erro ao solicitar permissão no navegador:", error);
    }
  };

  return (
    <NotificationsContext.Provider
      value={{
        enabled,
        toggleEnabledNotifications,
        requestPermission,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      "useNotifications deve ser usado dentro de um NotificationsProvider",
    );
  }
  return context;
};
