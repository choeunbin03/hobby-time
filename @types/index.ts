export type ApplicationStatusCode = "PENDING" | "APPROVED" | "CANCELLED";
export type UserRoleCode = "USER" | "ADMIN" | "GUEST";

export interface CommonCodeMaster {
  id: string;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommonCodeDetail {
  id: string;
  masterId: string;
  code: string;
  name: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
