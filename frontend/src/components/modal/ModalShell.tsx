import { useEffect, useId, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

interface ModalShellProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  panelClassName?: string;
  overlayClassName?: string;
  ariaLabel?: string;
}

const overlayStack: string[] = [];
let originalBodyOverflow = "";
let appRoot: HTMLElement | null = null;
let appRootWasInert = false;
const subscribeToHydration = () => () => {};

function focusableElements(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => !element.hidden && element.getAttribute("aria-hidden") !== "true");
}

export default function ModalShell({
  open,
  onClose,
  children,
  panelClassName = "",
  overlayClassName = "",
  ariaLabel = "Dialog",
}: ModalShellProps) {
  const id = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const isClient = useSyncExternalStore(subscribeToHydration, () => true, () => false);

  useEffect(() => {
    if (!open) return;
    returnFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    overlayStack.push(id);
    if (overlayStack.length === 1) {
      originalBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      appRoot = document.querySelector<HTMLElement>("[data-app-root]");
      if (appRoot) {
        appRootWasInert = appRoot.inert;
        appRoot.inert = true;
      }
    }

    const focusFrame = window.requestAnimationFrame(() => {
      const panel = panelRef.current;
      if (!panel) return;
      (focusableElements(panel)[0] ?? panel).focus();
    });

    return () => {
      window.cancelAnimationFrame(focusFrame);
      const position = overlayStack.lastIndexOf(id);
      if (position >= 0) overlayStack.splice(position, 1);
      if (overlayStack.length === 0) {
        document.body.style.overflow = originalBodyOverflow;
        if (appRoot) appRoot.inert = appRootWasInert;
        appRoot = null;
      }
      const returnTarget = returnFocusRef.current;
      if (returnTarget?.isConnected) {
        window.requestAnimationFrame(() => returnTarget.focus());
      }
    };
  }, [id, open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (overlayStack.at(-1) !== id) return;
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = focusableElements(panelRef.current);
      if (focusable.length === 0) {
        event.preventDefault();
        panelRef.current.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [id, onClose, open]);

  if (!isClient || !open) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center bg-black/72 p-2 backdrop-blur-sm sm:p-5 ${overlayClassName}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && overlayStack.at(-1) === id) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        tabIndex={-1}
        className={`relative max-h-[calc(100dvh-1rem)] w-full overflow-hidden rounded-2xl border border-divider bg-surface shadow-2xl shadow-black/55 sm:max-h-[calc(100dvh-2.5rem)] ${panelClassName}`}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
