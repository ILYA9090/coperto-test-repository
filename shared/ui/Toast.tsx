"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useToastStore } from "./toast-store";

const VARIANT_CLASSES: Record<"error" | "success", string> = {
  error: "bg-accent text-white",
  success: "bg-foreground text-background",
};

export function ToastViewport() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            role="alert"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`flex items-center gap-3 rounded-md px-4 py-3 text-sm shadow-lg ${VARIANT_CLASSES[toast.variant]}`}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => dismiss(toast.id)}
              aria-label="Закрыть уведомление"
              className="ml-auto opacity-70 hover:opacity-100"
            >
              ✕
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
