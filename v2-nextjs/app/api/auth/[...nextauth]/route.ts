import NextAuth, { type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      // This app currently uses Google as the only auth provider.
      // Allow safe linking by verified Google email to avoid OAuthAccountNotLinked lockouts.
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: 'select_account',
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Google accounts that require phone verification often have email_verified: false.
      // If the email is not verified by Google, block sign-in early to prevent
      // OAuthCreateAccount errors from the Prisma adapter.
      if (account?.provider === 'google') {
        const googleProfile = profile as { email_verified?: boolean; email?: string } | undefined;
        const isVerified = googleProfile?.email_verified;
        console.info('[NextAuth] Google signIn attempt:', {
          email: user.email,
          email_verified: isVerified,
        });
        if (!isVerified) {
          // Return a path to redirect to with a recognizable error code.
          return '/api/auth/signin?error=EmailNotVerified';
        }
      }
      return true;
    },
    async session({ session }) {
      if (!session.user?.email) {
        return session;
      }

      try {
        const fullUser = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: {
            id: true,
            encryptedOpenAIKey: true,
            encryptedGoogleKey: true,
            encryptedAnthropicKey: true,
          },
        });

        session.user.id = fullUser?.id ?? '';
        session.user.hasSavedApiKeys = Boolean(
          fullUser?.encryptedOpenAIKey ||
            fullUser?.encryptedGoogleKey ||
            fullUser?.encryptedAnthropicKey
        );

        try {
          const rows = await prisma.$queryRaw<Array<{ role: string | null }>>`
            SELECT "role" FROM "User" WHERE "email" = ${session.user.email} LIMIT 1
          `;
          session.user.role = rows[0]?.role === 'admin' ? 'admin' : 'user';
        } catch {
          session.user.role = 'user';
        }
      } catch {
        // Never block auth session on metadata lookup failure.
        session.user.id = '';
        session.user.hasSavedApiKeys = false;
        session.user.role = 'user';
      }

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
