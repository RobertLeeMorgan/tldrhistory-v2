const emailThrottle = new Map<string, number>();

export function assertEmailCooldown(
  key: string,
  cooldownMs: number,
  message: string
) {
  const now = Date.now();
  const lastAttempt = emailThrottle.get(key);

  if (lastAttempt && now - lastAttempt < cooldownMs) {
    throw new Error(message);
  }

  emailThrottle.set(key, now);
}