const DAY_MS = 24 * 60 * 60 * 1000;

/** Whole days until expiry, never negative. Partial days round up. */
export const getDaysLeft = (expiresAt: Date, now: Date = new Date()) =>
  Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / DAY_MS));
