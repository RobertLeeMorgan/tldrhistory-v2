import rateLimit from "express-rate-limit";
import { createHash, timingSafeEqual } from "crypto";
import type { Request } from "express";

export function isTrustedSsr(req: Request): boolean {
  const expected = process.env.SSR_API_KEY;
  const supplied = req.get("X-TLDR-SSR-Key");
  if (!expected || !supplied) return false;
  return timingSafeEqual(createHash("sha256").update(expected).digest(),
    createHash("sha256").update(supplied).digest());
}

function isAuthMutation(query?: string) {
  if (typeof query !== "string") return false;

  return [
    "register",
    "login",
    "forgotPassword",
    "resetPassword",
    "verifyEmail",
    "resendVerificationEmail",
  ].some((name) => query.includes(name));
}

export const graphqlGeneralLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  skip: isTrustedSsr,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    errors: [
      {
        message: "Too many requests. Please try again later.",
        extensions: { code: "RATE_LIMITED" },
      },
    ],
  },
});

// SSR has a separate, still bounded aggregate budget. Caddy strips this secret
// header from public requests; only the private frontend holds the key.
export const graphqlSsrLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 600,
  keyGenerator: () => "ssr",
  skip: (req) => !isTrustedSsr(req),
  standardHeaders: true,
  legacyHeaders: false,
});

export const graphqlAuthLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => !isAuthMutation(req.body?.query),
  message: {
    errors: [
      {
        message: "Too many authentication attempts. Please try again later.",
        extensions: { code: "RATE_LIMITED" },
      },
    ],
  },
});

export const authApiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many authentication requests. Please try again later.",
    code: "RATE_LIMITED",
  },
});
