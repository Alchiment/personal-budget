import { JWTPayload } from "@/app/lib/auth";
import { NextRequest } from "next/server";

/**
 * Response type for middleware
 */
export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}