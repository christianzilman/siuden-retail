import { create } from "zustand";
import type { AuthSession, LoginResult } from "../types/auth.types";

type AuthStatus = "checking" | "authenticated" | "anonymous";

interface AuthState {
  accessToken: string | null;
  session: AuthSession | null;
  status: AuthStatus;
  setAuthenticated: (result: LoginResult) => void;
  setAnonymous: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  session: null,
  status: "checking",
  setAuthenticated: ({ accessToken, session }) =>
    set({ accessToken, session, status: "authenticated" }),
  setAnonymous: () =>
    set({ accessToken: null, session: null, status: "anonymous" }),
}));
