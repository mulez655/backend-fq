import type { Request } from "express";

export type AuthUser = {
  id: string;
  role?: "USER" | "ADMIN";
  email?: string;
};

export type AuthVendor = {
  id: string;
  role?: "VENDOR" | "ADMIN";
  email?: string;
};

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

export interface VendorAuthenticatedRequest extends Request {
  vendor?: AuthVendor;
  file?: Express.Multer.File;
}
