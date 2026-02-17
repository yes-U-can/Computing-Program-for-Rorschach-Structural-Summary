import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      hasSavedApiKeys: boolean;
      role: 'user' | 'admin';
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    hasSavedApiKeys: boolean;
    role: 'user' | 'admin';
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    hasSavedApiKeys: boolean;
    role: 'user' | 'admin';
  }
}
