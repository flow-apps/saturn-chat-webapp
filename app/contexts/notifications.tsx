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
  const { signed, user } = useAuth();

  const platform = useMemo(() => "web", []);

  // 1. Envia o pushToken (Subscription ID) e a plataforma para salvar no PostgreSQL
  const registerTokenInBackend = useCallback(
    async (pushToken: string) => {
      if (!signed || !pushToken) return;

      try {
        const res = await api.post("/users/notify/register", {
          platform,
          language: navigator.language || "pt-BR",
          pushToken,
        });

        if (res.status === 200 || res.status === 201) {
          setEnabled(!!res.data.send_notification);
        }
      } catch (error) {
        console.error("Erro ao registrar token no backend:", error);
      }
    },
    [signed, platform],
  );

  // 2. Inicializa o SDK Web do OneSignal e configura os ouvintes de evento
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

        // Registra no backend quando houver alteração/ativação da inscrição (optIn)
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
    const handleOneSignalAuth = async () => {
      if (!initialized) return;

      if (signed && user?.id) {
        try {
          if (Notification.permission === "granted") {
            await OneSignal.User.PushSubscription.optIn();
          }

          if (OneSignal.User.PushSubscription.optedIn) {
            await OneSignal.login(user.id);
          }

          const pushToken = OneSignal.User.PushSubscription.id;
          if (pushToken && OneSignal.User.PushSubscription.optedIn) {
            await registerTokenInBackend(pushToken);
          }
        } catch (error) {
          console.error("Erro ao realizar login/registro no OneSignal:", error);
        }
      } else if (!signed) {
        try {
          await OneSignal.logout();
        } catch (error) {
          console.error("Erro ao realizar logout no OneSignal:", error);
        }
      }
    };

    handleOneSignalAuth();
  }, [signed, user?.id, initialized, registerTokenInBackend]);

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

      const pushToken = OneSignal.User.PushSubscription.id;
      if (pushToken && OneSignal.User.PushSubscription.optedIn) {
        await registerTokenInBackend(pushToken);
      }
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
