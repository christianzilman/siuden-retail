export interface AuthSession {
  userId: string;
  email: string;
  accountId: string;
  tenantId: string;
  customerId: string | null;
  role: string;
  permissions: string[];
}

export interface LoginResult {
  accessToken: string;
  accessTokenExpiresAtUtc: string;
  session: AuthSession;
}
