import type { Role } from "../../../generated/prisma/enums";

export interface IRegisterPatientPayload {
  name: string;
  email: string;
  password: string;
  role?: Role | string;
}
export interface ILoginUserPayload {
  email: string;
  password: string;
}

export interface IChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
