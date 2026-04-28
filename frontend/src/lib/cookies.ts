export const cookies = {
  parse: (cookieHeader: string) => {
    if (!cookieHeader) return {};
    
    const cookies: Record<string, string> = {};
    cookieHeader.split(";").forEach((cookie) => {
      const [name, value] = cookie.trim().split("=");
      if (name) cookies[name] = decodeURIComponent(value || "");
    });
    return cookies;
  },
  serialize: (name: string, value: string, options?: any) => {
    return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Lax`;
  },
};