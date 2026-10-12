import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

type ToastType = "success" | "error" | "info";

export interface Toast {
  id: number;
  message: string;
  type?: ToastType;
  duration?: number;
}

interface ToastContextValue {
  addToast: (toast: Omit<Toast, "id">) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef(new Map<number, number>());

  const dismissToast = useCallback((id: number) => {
    const timer = timers.current.get(id);
    if (timer) window.clearTimeout(timer);
    timers.current.delete(id);
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Date.now() + Math.random();
    const duration = toast.duration ?? 3000;

    setToasts((prev) => [...prev, { ...toast, id, duration }]);
    timers.current.set(id, window.setTimeout(() => dismissToast(id), duration));
  }, [dismissToast]);

  useEffect(() => () => {
    for (const timer of timers.current.values()) window.clearTimeout(timer);
    timers.current.clear();
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      <div className="fixed inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-[80] flex flex-col items-center gap-2 pointer-events-none" aria-live="polite" aria-atomic="false">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role={toast.type === "error" ? "alert" : "status"}
            className={`pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-xl border px-4 py-3 shadow-xl shadow-black/35 ${
              toast.type === "error"
                ? "border-danger/55 bg-surface-raised text-danger"
                : toast.type === "success"
                  ? "border-success/45 bg-surface-raised text-success"
                  : "border-divider bg-surface-raised text-content"
            }`}
          >
            <span className="flex-1 text-sm font-semibold leading-6">{toast.message}</span>
            <button type="button" onClick={() => dismissToast(toast.id)} className="min-h-8 min-w-8 rounded-md text-content-muted hover:bg-canvas hover:text-content" aria-label="Dismiss notification">×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
