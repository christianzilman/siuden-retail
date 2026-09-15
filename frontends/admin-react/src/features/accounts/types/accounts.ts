import type { ISODateString } from "@/types/common";

export type AccountStatus = "TRIAL" | "ACTIVE" | "SUSPENDED" | "CANCELLED";

export type AccountMemberStatus = "INVITED" | "ACTIVE" | "BLOCKED";

export interface Account {
  id: string;
  name: string;
  status: AccountStatus;
}

export interface AccountMember {
  id: string;
  accountId: string;
  userId: string;
  roleId: string;
  status: AccountMemberStatus;
  joinedAt: ISODateString | null;
}
