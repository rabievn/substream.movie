import "server-only";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";
import Google from "next-auth/providers/google";
import Nodemailer from "next-auth/providers/nodemailer";
import { isGoogleAuthEnabled, serverEnv } from "@/config/server-env";
import { db } from "@/lib/db";
import { sendMagicLink } from "./send-magic-link";

const TRIAL_DAYS = 7;
const DAY_MS = 24 * 60 * 60 * 1000;

const providers: Provider[] = [
  Nodemailer({
    // A JSON transport keeps the provider valid when SMTP isn't configured (dev).
    server: serverEnv.EMAIL_SERVER ?? { jsonTransport: true },
    from: serverEnv.EMAIL_FROM,
    sendVerificationRequest: ({ identifier, url }) => sendMagicLink({ identifier, url }),
  }),
];

if (isGoogleAuthEnabled) {
  providers.push(Google);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "database" },
  providers,
  pages: {
    signIn: "/sign-in",
    verifyRequest: "/sign-in/check-email",
  },
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
  events: {
    // Every new account starts with a trial and the two system lists.
    async createUser({ user }) {
      if (!user.id) return;
      await db.$transaction([
        db.subscription.create({
          data: {
            userId: user.id,
            status: "TRIAL",
            expiresAt: new Date(Date.now() + TRIAL_DAYS * DAY_MS),
          },
        }),
        db.list.createMany({
          data: [
            { userId: user.id, name: "Watch later", systemKey: "watch-later" },
            { userId: user.id, name: "Favorites", systemKey: "favorites" },
          ],
        }),
      ]);
    },
  },
});
