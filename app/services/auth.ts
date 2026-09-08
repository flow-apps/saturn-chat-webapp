import { AxiosResponse } from "axios";
import api from "@services/api";
import { UserData } from "@customtypes/interfaces";

interface AuthResponse {
  token: string;
  user: UserData;
}

export async function signIn(
  email: string,
  password: string,
): Promise<AxiosResponse<AuthResponse>> {
  return await api.post<AuthResponse>("/auth", { email, password });
}

export async function signUp(
  data: FormData,
): Promise<AxiosResponse<AuthResponse>> {
  return await api.post<AuthResponse>("/users", data, {
    headers: {
      "Content-Type": undefined,
    },
  });
}
