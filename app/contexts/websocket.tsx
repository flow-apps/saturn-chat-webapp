import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import io, { Socket } from "socket.io-client";
import websocketConfig from "~/config";
import config from "~/config";
import { useAuth } from "./auth";

interface IWebsocketContext {
  socket: Socket | null;
}

const WebsocketContext = createContext<IWebsocketContext>({ socket: null });

const API_PREFERENCE_KEY = "@SaturnChat:useDevApi";

const WebsocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const isConnectingRef = useRef(false);

  const { token } = useAuth();

  useEffect(() => {
    let isCancelled = false;
    let activeSocket: Socket | null = null;

    const setupSocket = () => {
      if (!token) {
        if (socket) {
          socket.disconnect();
        }
        setSocket(null);
        return;
      }

      if (isConnectingRef.current) return;
      
      isConnectingRef.current = true;
      setIsConnecting(true);

      let currentBaseURL = config.PROD_API_URL;

      try {
        if (typeof window !== "undefined") {
          const storedPreference = localStorage.getItem(API_PREFERENCE_KEY);
          const useDev =
            storedPreference && import.meta.env.DEV
              ? JSON.parse(storedPreference)
              : false;
          currentBaseURL = useDev ? config.DEV_API_URL : config.PROD_API_URL;
        }
      } catch (error) {
        console.error("Erro ao ler localStorage do WebSocket:", error);
      }

      if (isCancelled) {
        isConnectingRef.current = false;
        setIsConnecting(false);
        return;
      }

      console.log(`[Websocket] Criando nova conexão em: ${currentBaseURL}`);

      activeSocket = io(currentBaseURL, {
        ...websocketConfig,
        query: { token },
      });

      setSocket(activeSocket);

      activeSocket.on("connect", () => {
        console.log("[Websocket] Conectado com sucesso. ID:", activeSocket?.id);
        isConnectingRef.current = false;
        setIsConnecting(false);
      });

      activeSocket.on("disconnect", (reason) => {
        console.log(`[Websocket] Desconectado. Razão: ${reason}`);
        isConnectingRef.current = false;
        setIsConnecting(false);
      });

      activeSocket.on("connect_error", (error) => {
        console.error("[Websocket] Erro de conexão:", error.message);
        isConnectingRef.current = false;
        setIsConnecting(false);
      });
    };

    setupSocket();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("[Websocket] Aba ativa novamente. Verificando estado...");
        setSocket((currentSocket) => {
          if (currentSocket) {
            if (!currentSocket.connected) {
              currentSocket.connect();
            }
          } else if (token) {
            setupSocket();
          }
          return currentSocket;
        });
      }
    };

    if (typeof window !== "undefined") {
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }

    return () => {
      isCancelled = true;
      if (typeof window !== "undefined") {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      }
      if (activeSocket) {
        console.log("[Websocket] Desconectando socket no cleanup...");
        activeSocket.disconnect();
      }
    };
  }, [token]);

  return (
    <WebsocketContext.Provider value={{ socket }}>
      {children}
    </WebsocketContext.Provider>
  );
};

const useWebsocket = () => {
  return useContext(WebsocketContext);
};

export { WebsocketProvider, useWebsocket };