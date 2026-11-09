import { randomBytes } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import "dotenv/config";
import { Client } from "pg";

export const DEMO_EMAIL = "demo@substream.movie";
export const STORAGE_STATE = path.join(__dirname, ".auth", "demo.json");

/**
 * Signs the seeded demo user in by inserting an Auth.js database session
 * and saving the cookie as Playwright storage state (no email round-trip).
 */
export default async function globalSetup() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    const { rows } = await client.query<{ id: string }>("SELECT id FROM users WHERE email = $1", [
      DEMO_EMAIL,
    ]);
    const userId = rows[0]?.id;
    if (!userId)
      throw new Error(`Seeded user ${DEMO_EMAIL} not found — run "npm run db:seed" first.`);

    const sessionToken = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await client.query(
      `INSERT INTO sessions (session_token, user_id, expires, created_at, updated_at) VALUES ($1, $2, $3, now(), now())`,
      [sessionToken, userId, expires],
    );

    mkdirSync(path.dirname(STORAGE_STATE), { recursive: true });
    writeFileSync(
      STORAGE_STATE,
      JSON.stringify({
        cookies: [
          {
            name: "authjs.session-token",
            value: sessionToken,
            domain: "localhost",
            path: "/",
            expires: Math.floor(expires.getTime() / 1000),
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
          },
          {
            name: "locale",
            value: "en",
            domain: "localhost",
            path: "/",
            expires: -1,
            httpOnly: false,
            secure: false,
            sameSite: "Lax",
          },
        ],
        origins: [],
      }),
    );
  } finally {
    await client.end();
  }
}
