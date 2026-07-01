import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, XCircle, Info, X, AlertTriangle } from "lucide-react";

const ToastContext = createContext(null);
const TOAST_DURATION = 3500;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [confirms, setConfirms] = useState([]);

  const showToast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, TOAST_DURATION);
  }, []);

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Returns a Promise<boolean> - resolves true if user confirms, false if cancelled
  const confirmToast = useCallback((message, options = {}) => {
    return new Promise((resolve) => {
      const id = Date.now() + Math.random();
      setConfirms((prev) => [
        ...prev,
        {
          id,
          message,
          confirmLabel: options.confirmLabel || "Delete",
          cancelLabel: options.cancelLabel || "Cancel",
          resolve,
        },
      ]);
    });
  }, []);

  const resolveConfirm = (id, result) => {
    setConfirms((prev) => {
      const target = prev.find((c) => c.id === id);
      if (target) target.resolve(result);
      return prev.filter((c) => c.id !== id);
    });
  };

  return (
    <ToastContext.Provider value={{ showToast, confirmToast }}>
      {children}

      <div className="fixed top-5 right-5 z-9999 space-y-2 w-80">
        {toasts.map((toast) => {
          const isSuccess = toast.type === "success";
          const isError = toast.type === "error";
          const Icon = isSuccess ? CheckCircle2 : isError ? XCircle : Info;

          return (
            <div
              key={toast.id}
              className="relative bg-white border border-gray-100 rounded-lg shadow-lg overflow-hidden animate-slide-in"
            >
              <div className="flex items-start gap-2.5 p-3.5">
                <Icon
                  size={17}
                  className={`mt-0.5 shrink-0 ${
                    isSuccess
                      ? "text-emerald-500"
                      : isError
                      ? "text-red-500"
                      : "text-gray-500"
                  }`}
                />
                <p className="text-xs text-gray-700 flex-1">{toast.message}</p>
                <button
                  onClick={() => dismissToast(toast.id)}
                  className="text-gray-300 hover:text-gray-500 transition"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Shrinking progress bar */}
              <div className="h-0.75 w-full bg-gray-100">
                <div
                  className={`h-full ${isSuccess ? "bg-emerald-500" : isError ? "bg-red-500" : "bg-gray-400"}`}
                  style={{
                    animation: `toast-shrink ${TOAST_DURATION}ms linear forwards`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation toasts - separate stack, no auto-dismiss, no progress bar */}
      <div className="fixed top-5 right-5 z-9999 space-y-2 w-80">
        {confirms.map((confirm) => (
          <div
            key={confirm.id}
            className="relative bg-white border border-gray-100 rounded-lg shadow-lg overflow-hidden animate-slide-in"
          >
            <div className="flex items-start gap-2.5 p-3.5">
              <AlertTriangle size={17} className="mt-0.5 shrink-0 text-amber-500" />
              <p className="text-xs text-gray-700 flex-1">{confirm.message}</p>
            </div>

            <div className="flex items-center justify-end gap-2 px-3.5 pb-3.5">
              <button
                onClick={() => resolveConfirm(confirm.id, false)}
                className="px-3 py-1.5 rounded-md text-xs font-medium text-gray-600 hover:bg-gray-50 border border-gray-200 transition"
              >
                {confirm.cancelLabel}
              </button>
              <button
                onClick={() => resolveConfirm(confirm.id, true)}
                className="px-3 py-1.5 rounded-md text-xs font-medium text-white bg-red-500 hover:bg-red-600 transition"
              >
                {confirm.confirmLabel}
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}