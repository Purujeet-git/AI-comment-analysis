import { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id?: string;

      facebookUserId?: string;
      facebookName?: string;
      facebookEmail?: string;

      pageId?: string;
      pageName?: string;

      instagramBusinessId?: string;
      instagramUsername?: string;

      role?: "USER" | "ADMIN";
    };

    provider?: string;

    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    provider?: string;

    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;

    facebookUserId?: string;
    facebookName?: string;
    facebookEmail?: string;

    pageId?: string;
    pageName?: string;

    instagramBusinessId?: string;
    instagramUsername?: string;

    role?: "USER" | "ADMIN";
  }
}