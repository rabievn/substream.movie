import "server-only";
import { createTransport } from "nodemailer";
import { serverEnv } from "@/config/server-env";

interface SendMagicLinkParams {
  identifier: string;
  url: string;
}

/**
 * Sends the sign-in link. Without EMAIL_SERVER the link is printed to the server log —
 * always in development, and in production only with AUTH_LOG_MAGIC_LINKS=true (local/e2e).
 */
export async function sendMagicLink({ identifier, url }: SendMagicLinkParams) {
  if (!serverEnv.EMAIL_SERVER) {
    const canLogLinks = serverEnv.NODE_ENV !== "production" || serverEnv.AUTH_LOG_MAGIC_LINKS;
    if (!canLogLinks) throw new Error("EMAIL_SERVER must be configured in production");
    console.info(`\n[auth] Magic link for ${identifier}:\n${url}\n`);
    return;
  }

  const { host } = new URL(url);
  const transport = createTransport(serverEnv.EMAIL_SERVER);
  const result = await transport.sendMail({
    to: identifier,
    from: serverEnv.EMAIL_FROM,
    subject: `Sign in to ${host}`,
    text: `Sign in to ${host}\n\n${url}\n\nIf you didn't request this email, you can ignore it.`,
    html: `<p>Sign in to <strong>${host}</strong></p><p><a href="${url}">Sign in</a></p><p>If you didn't request this email, you can ignore it.</p>`,
  });

  const failed = [...result.rejected, ...(result.pending ?? [])].filter(Boolean);
  if (failed.length) throw new Error(`Email could not be sent to ${failed.join(", ")}`);
}
