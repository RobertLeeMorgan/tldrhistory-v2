import type { ReactNode } from "react";

type PageVariant = "centered" | "discovery" | "form" | "reading";

type PageProps = {
  children: ReactNode;
  variant?: PageVariant;
  className?: string;
};

const variantClasses: Record<PageVariant, string> = {
  centered: "flex min-h-dvh flex-col items-center justify-center pt-[var(--nav-height)]",
  discovery: "min-h-dvh",
  form: "flex min-h-dvh flex-col items-center justify-center pb-10 pt-[calc(var(--nav-height)+2.5rem)] sm:pb-16 sm:pt-[calc(var(--nav-height)+4rem)]",
  reading: "min-h-dvh pb-10 pt-[calc(var(--nav-height)+2.5rem)] sm:pb-16 sm:pt-[calc(var(--nav-height)+4rem)]",
};

export default function PageContainer({ children, variant = "centered", className = "" }: PageProps) {
  return <main className={`${variantClasses[variant]} min-w-0 ${className}`}>{children}</main>;
}
