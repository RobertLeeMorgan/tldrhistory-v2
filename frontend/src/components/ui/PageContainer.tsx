import type { ReactNode } from "react";

type PageVariant = "centered" | "discovery" | "form" | "reading";

type PageProps = {
  children: ReactNode;
  variant?: PageVariant;
  className?: string;
};

const variantClasses: Record<PageVariant, string> = {
  centered: "flex min-h-[calc(100dvh-var(--nav-height))] flex-col items-center justify-center",
  discovery: "min-h-[calc(100dvh-var(--nav-height))]",
  form: "flex min-h-[calc(100dvh-var(--nav-height))] flex-col items-center justify-center py-10 sm:py-16",
  reading: "min-h-[calc(100dvh-var(--nav-height))] py-10 sm:py-16",
};

export default function PageContainer({ children, variant = "centered", className = "" }: PageProps) {
  return <main className={`${variantClasses[variant]} min-w-0 ${className}`}>{children}</main>;
}
