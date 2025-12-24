import type { Request } from "express";

export type AuthUser = {
  id: string;
  role?: string; // "USER" | "ADMIN" etc
};

export type AuthVendor = {
  id: string;
  role?: string;
};

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

export interface VendorAuthenticatedRequest extends Request {
  vendor?: AuthVendor;
  file?: Express.Multer.File; // <-- enables req.file typing
}
