import axios from "axios";
import { config } from "../../config/config";
import type { User, UserRole } from "../state/auth.slice";

const api = axios.create({
  baseURL: config.API_BASE_URL,
  withCredentials: true, // send/receive the httpOnly auth cookie
});

export interface RegisterPayload {
  fullname: string;
  email: string;
  contact: string;
  password: string;
  role: UserRole;
}

interface AuthResponse {
  message: string;
  user: User;
}
/**
 * Registration
 * /auth/Registration
 */

export async function registerUser(payload: RegisterPayload): Promise<User> {
  const { data } = await api.post<AuthResponse>("/auth/register", payload);
  return data.user;
}

// Turns backend error responses into one readable message
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; errors?: { msg: string }[] }
      | undefined;

    if (data?.errors?.length) return data.errors[0].msg;
    if (data?.message) return data.message;
    if (!error.response)
      return "Cannot reach the server. Is the backend running?";
  }
  return "Something went wrong. Please try again.";
}
