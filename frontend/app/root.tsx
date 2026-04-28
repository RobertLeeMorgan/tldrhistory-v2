import type { ReactNode } from "react";
import type { LinksFunction } from "react-router";
import { Links, Meta, Outlet, Scripts } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../src/lib/queryClient";
import { AuthProvider } from "../src/context/AuthContext";
import { ToastProvider } from "../src/context/ToastContext";
import RootLayout from "../src/pages/RootLayout";
import "../src/index.css";
import ScrollManager from "../src/components/ui/ScrollManager";

export const links: LinksFunction = () => [
  { rel: "icon", type: "image/png", href: "/tldr-logo-192.png" },
  { rel: "apple-touch-icon", href: "/tldr-logo-192.png" },
  { rel: "manifest", href: "/manifest.webmanifest" },
  {
    rel: "preload",
    as: "image",
    href: "/bg-home.webp",
    type: "image/webp",
  },
];

function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>{children}</AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <AppProviders>
      <ScrollManager />
      <RootLayout>
        <Outlet />
      </RootLayout>
    </AppProviders>
  );
}
