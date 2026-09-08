import React, { createContext, useContext, useEffect, useState } from "react";
import api from "@services/api";
import * as auth from "@services/auth";
import { AxiosError } from "axios";
import configs from "~/config";
import { UserData } from "@customtypes/interfaces";

// Variável global/instância do websocket (garanta que esteja importada do seu projeto se necessário)
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

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState("");
  const [user, setUser] = useState<UserData | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [registerError, setRegisterError] = useState(false);
  const [internalError, setInternalError] = useState({
    has: false,
    reason: "",
  });

  const loadStorageData = () => {
    setLoadingData(true);
    const storageUser = localStorage.getItem("@SaturnChat:user");
    const storageToken = localStorage.getItem("@SaturnChat:token");

    if (storageUser && storageToken) {
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
    setLoadingData(false);
  };

  const updateUser = async (data: { token?: string; user: UserData }) => {
    if (data.token) {
      const headerToken = `Bearer ${data.token}`;
      localStorage.setItem("@SaturnChat:token", data.token);

      api.defaults.headers.common["authorization"] = headerToken;
      if (typeof websocket !== "undefined") {
        if (!websocket.query) {
          websocket.query = {};
        }
        websocket.query.token = headerToken;
      }
      setToken(headerToken);
    }

    localStorage.setItem("@SaturnChat:user", JSON.stringify(data.user));
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

  const signUp = async (data: FormData) => {
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
      localStorage.removeItem("@SaturnChat:user");
      localStorage.removeItem("@SaturnChat:token");

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
