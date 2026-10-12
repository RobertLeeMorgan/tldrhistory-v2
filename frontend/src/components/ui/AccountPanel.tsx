import type { ReactNode } from "react";
import PageContainer from "./PageContainer";

type AccountPanelProps = {
  children: ReactNode;
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
};

export default function AccountPanel({ children, eyebrow = "Your account", title, description, className = "" }: AccountPanelProps) {
  return (
    <PageContainer variant="form" className="relative overflow-hidden bg-canvas px-4">
      <div className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(circle_at_15%_15%,rgba(214,173,104,.13),transparent_28%),radial-gradient(circle_at_85%_80%,rgba(70,102,95,.22),transparent_30%)]" aria-hidden="true" />
      <section className={`atlas-surface relative z-10 w-full max-w-lg overflow-hidden rounded-2xl ${className}`}>
        <header className="border-b border-divider px-6 py-6 text-center sm:px-8 sm:py-8">
          <p className="atlas-eyebrow">{eyebrow}</p>
          <h1 className="mt-2 text-3xl font-bold text-content sm:text-4xl">{title}</h1>
          {description && <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-content-muted sm:text-base">{description}</p>}
        </header>
        <div className="p-6 sm:p-8">{children}</div>
      </section>
    </PageContainer>
  );
}

export function AccountStatusMark({ tone = "success", children }: { tone?: "success" | "danger" | "info"; children: ReactNode }) {
  const colors = tone === "danger" ? "border-danger text-danger bg-danger/10" : tone === "info" ? "border-control text-content-muted bg-canvas/45" : "border-success text-success bg-success/10";
  return <div className={`mx-auto grid size-16 place-items-center rounded-full border-2 text-2xl font-bold ${colors}`} aria-hidden="true">{children}</div>;
}
