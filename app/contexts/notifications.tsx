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

  const registerTokenInBackend = useCallback(async (pushToken: string) => {
    if (!signed || !pushToken) return;

    try {
      const res = await api.post("/users/notify/register", {
        platform,
        language,
        pushToken,
      });

      if (res.status === 200 || res.status === 201) {
        setEnabled(!!res.data.send_notification);
      }
    } catch (error) {
      console.error("Erro ao registrar token no backend:", error);
    }
  }, [signed, platform, language]);

  useEffect(() => {
    const initOneSignal = async () => {
      try {
        await OneSignal.init({
          appId: config.OneSignalAppID,
          allowLocalhostAsSecureOrigin: true,
        });

        setInitialized(true);

        if (Notification.permission === "granted") {
          await OneSignal.User.PushSubscription.optIn();
        }

        OneSignal.User.PushSubscription.addEventListener(
          "change",
          async (event) => {
            if (event.current.id && event.current.optedIn) {
              await registerTokenInBackend(event.current.id);
            }
          },
        );

        if (
          OneSignal.User.PushSubscription.id &&
          OneSignal.User.PushSubscription.optedIn
        ) {
          await registerTokenInBackend(OneSignal.User.PushSubscription.id);
        }
      } catch (error) {
        console.error("Erro ao inicializar o OneSignal Web:", error);
      }
    };

    if (!initialized) {
      initOneSignal();
    }
  }, [initialized, registerTokenInBackend]);

  useEffect(() => {
    if (signed && initialized) {
      if (
        OneSignal.User.PushSubscription.id &&
        OneSignal.User.PushSubscription.optedIn
      ) {
        registerTokenInBackend(OneSignal.User.PushSubscription.id);
      }
    }
  }, [signed, initialized, registerTokenInBackend]);

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
      await OneSignal.User.PushSubscription.optIn();
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