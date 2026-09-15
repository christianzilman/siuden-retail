import type { AuthSession } from "@/features/auth/types/auth";

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthService {
  login(input: LoginInput): Promise<AuthSession>;
  me(): Promise<AuthSession | null>;
  logout(): Promise<void>;
}
