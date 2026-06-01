"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  ReactNode,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ToastVariant = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}

// ─── Styling maps ─────────────────────────────────────────────────────────────

const VARIANT_STYLES: Record<ToastVariant, string> = {
  success:
    "bg-green-50 dark:bg-green-900/30 border-green-400 dark:border-green-600 text-green-800 dark:text-green-200",
  error:
    "bg-red-50 dark:bg-red-900/30 border-red-400 dark:border-red-600 text-red-800 dark:text-red-200",
  info:
    "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-400 dark:border-indigo-600 text-indigo-800 dark:text-indigo-200",
  warning:
    "bg-yellow-50 dark:bg-yellow-900/30 border-yellow-400 dark:border-yellow-600 text-yellow-800 dark:text-yellow-200",
};

const ICON_COLOR: Record<ToastVariant, string> = {
  success: "text-green-500",
  error: "text-red-500",
  info: "text-indigo-500",
  warning: "text-yellow-500",
};

const CLOSE_BTN_STYLES: Record<ToastVariant, string> = {
  success: "hover:bg-green-100 dark:hover:bg-green-800/40",
  error: "hover:bg-red-100 dark:hover:bg-red-800/40",
  info: "hover:bg-indigo-100 dark:hover:bg-indigo-800/40",
  warning: "hover:bg-yellow-100 dark:hover:bg-yellow-800/40",
};

// ─── Icon components ──────────────────────────────────────────────────────────

function ToastIcon({ variant }: { variant: ToastVariant }) {
  const cls = `w-5 h-5 flex-shrink-0 ${ICON_COLOR[variant]}`;

  switch (variant) {
    case "success":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      );
    case "error":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      );
    case "warning":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      );
    case "info":
    default:
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      );
  }
}

// ─── Single Toast item ────────────────────────────────────────────────────────

const AUTO_DISMISS_MS = 4000;

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    setVisible(false);
    // Wait for exit animation then remove
    setTimeout(() => onDismiss(toast.id), 300);
  }, [onDismiss, toast.id]);

  useEffect(() => {
    // Trigger enter animation
    const enterTimer = setTimeout(() => setVisible(true), 10);
    // Auto-dismiss
    timerRef.current = setTimeout(dismiss, AUTO_DISMISS_MS);

    return () => {
      clearTimeout(enterTimer);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [dismiss]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className={`flex items-start gap-3 w-80 max-w-[calc(100vw-2rem)] p-4 rounded-xl border shadow-lg transition-all duration-300 ease-out ${
        VARIANT_STYLES[toast.variant]
      } ${
        visible
          ? "translate-x-0 opacity-100"
          : "translate-x-full opacity-0"
      }`}
    >
      <ToastIcon variant={toast.variant} />

      <p className="flex-1 text-sm font-medium leading-snug break-words">
        {toast.message}
      </p>

      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss notification"
        className={`flex-shrink-0 p-1 rounded-md transition-colors ${CLOSE_BTN_STYLES[toast.variant]} focus:outline-none focus-visible:ring-2 focus-visible:ring-current`}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}

// ─── Toaster (render target) ──────────────────────────────────────────────────

interface ToasterState {
  toasts: Toast[];
}

let toasterRef: ((toast: Toast) => void) | null = null;

export function Toaster() {
  const [toasts, setToasts] = useState<ToasterState["toasts"]>([]);

  const addToast = useCallback((toast: Toast) => {
    setToasts((prev) => [...prev, toast]);
  }, []);

  useEffect(() => {
    toasterRef = addToast;
    return () => {
      toasterRef = null;
    };
  }, [addToast]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <div
      aria-label="Notifications"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 items-end pointer-events-none"
    >
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} onDismiss={removeToast} />
        </div>
      ))}
    </div>
  );
}

// ─── ToastProvider ────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: ReactNode }) {
  const toast = useCallback(
    (message: string, variant: ToastVariant = "info") => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const newToast: Toast = { id, message, variant };
      if (toasterRef) {
        toasterRef(newToast);
      }
    },
    []
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <Toaster />
    </ToastContext.Provider>
  );
}
