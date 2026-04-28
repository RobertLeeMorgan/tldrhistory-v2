import rateLimit from "express-rate-limit";

function isAuthMutation(query?: string) {
  if (!query) return false;

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

export const graphqlAuthLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => !isAuthMutation(req.body?.query),
  keyGenerator: (req) => req.ip || "unknown",
  message: {
    errors: [
      {
        message: "Too many authentication attempts. Please try again later.",
        extensions: { code: "RATE_LIMITED" },
      },
    ],
  },
});