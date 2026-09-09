import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import api from "@services/api";
import * as auth from "@services/auth";
import { AxiosError } from "axios";
import configs from "~/config";
import { UserData } from "@customtypes/interfaces";

declare const websocket: any;

interface AuthContextData {
  signed: boolean;
  loading: boolean;
  loadingData: boolean;
  user: UserData | null;
  loginError: boolean;
  registerError: boolean;
  token: string;
  internalError: {
    has: boolean;
    reason: string;
  };
  getHeadersForAuthFiles: (url: string) =>
    | {
        [key: string]: string;
      }
    | undefined;
  updateUser: (data: { token?: string; user: UserData }) => Promise<void>;
  signIn(email: string, password: string): Promise<void>;
  signUp(data: FormData, email: string): Promise<void>;
  signOut: () => void;
}

const TOKEN_COOKIE_KEY = "@SaturnChat:token";
const USER_STORAGE_KEY = "@SaturnChat:user";

// Funções para leitura síncrona na inicialização do estado no browser
const getInitialToken = (): string => {
  if (typeof window === "undefined") return "";
  const storageToken = Cookies.get(TOKEN_COOKIE_KEY);
  return storageToken ? `Bearer ${storageToken}` : "";
};

const getInitialUser = (): UserData | null => {
  if (typeof window === "undefined") return null;
  const storageUser = localStorage.getItem(USER_STORAGE_KEY);
  return storageUser ? JSON.parse(storageUser) : null;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Inicialização síncrona dos estados para evitar perda de token no F5 / SSR Hydration
  const [token, setToken] = useState<string>(getInitialToken);
  const [user, setUser] = useState<UserData | null>(getInitialUser);
  const [loadingData, setLoadingData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [registerError, setRegisterError] = useState(false);
  const [internalError, setInternalError] = useState({
    has: false,
    reason: "",
  });

  const loadStorageData = () => {
    if (typeof window === "undefined") return;

    const storageToken = Cookies.get(TOKEN_COOKIE_KEY);
    const storageUser = localStorage.getItem(USER_STORAGE_KEY);

    if (storageToken && storageUser) {
      const headerToken = `Bearer ${storageToken}`;
      const parsedUser = JSON.parse(storageUser);

      api.defaults.headers.common["authorization"] = headerToken;

      if (typeof websocket !== "undefined") {
        if (!websocket.query) {
          websocket.query = {};
        }
        websocket.query.token = headerToken;
      }

      setToken(headerToken);
      setUser(parsedUser);
    }
  };

  const updateUser = async (data: { token?: string; user: UserData }) => {
    if (typeof window !== "undefined") {
      if (data.token) {
        const headerToken = `Bearer ${data.token}`;

        Cookies.set(TOKEN_COOKIE_KEY, data.token, {
          expires: 7,
          sameSite: "lax",
          secure: window.location.protocol === "https:",
        });

        api.defaults.headers.common["authorization"] = headerToken;

        if (typeof websocket !== "undefined") {
          if (!websocket.query) {
            websocket.query = {};
          }
          websocket.query.token = headerToken;
        }

        setToken(headerToken);
      }

      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
    }

    setUser(data.user);
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setLoginError(false);
    setInternalError({ has: false, reason: "" });

    try {
      const response = await auth.signIn(email, password);
      await updateUser(response.data);
      setLoginError(false);
      setInternalError({ has: false, reason: "" });
    } catch (error) {
      const err = error as AxiosError;
      if (err?.response?.status === 500) {
        setInternalError({
          has: true,
          reason: JSON.stringify(err.response?.data),
        });
      }
      setLoginError(true);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (data: FormData, email: string) => {
    setLoading(true);
    setRegisterError(false);

    try {
      const response = await auth.signUp(data);
      await updateUser(response.data);
      setRegisterError(false);
      setInternalError({ has: false, reason: "" });
    } catch (error) {
      const err = error as AxiosError;
      console.log(err.response?.data);

      if (err.response?.status === 500) {
        setInternalError({
          has: true,
          reason: JSON.stringify(err.response?.data),
        });
      }
      setRegisterError(true);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await api.delete("/users/notify/unregister?platform=web");
    } catch (error) {
      console.error("Erro ao desregistrar notificações:", error);
    } finally {
      if (typeof window !== "undefined") {
        Cookies.remove(TOKEN_COOKIE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
      }

      api.defaults.headers.common["authorization"] = "";
      if (typeof websocket !== "undefined" && websocket.query) {
        websocket.query.token = "";
      }
      setToken("");
      setUser(null);
    }
  };

  const getHeadersForAuthFiles = (url: string) => {
    if (
      url.includes(configs.STORAGE_URL) ||
      url.includes(configs.PROD_API_URL)
    ) {
      return {
        Authorization: token,
      };
    }

    return undefined;
  };

  useEffect(() => {
    loadStorageData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        loading,
        loadingData,
        user,
        signIn,
        signUp,
        signOut,
        updateUser,
        getHeadersForAuthFiles,
        token,
        registerError,
        loginError,
        internalError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthProvider, useAuth };
