"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

type ErrorDetail = {
  message: string;
  status?: number;
};

export function GlobalErrorModal() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<number | null>(null);

  useEffect(() => {
    const handler = (e: CustomEvent<ErrorDetail>) => {
      const { message, status } = e.detail;

      setMessage(message);
      setStatus(status || null);
      setOpen(true);
    };

    window.addEventListener("api-error", handler as EventListener);

    return () =>
      window.removeEventListener("api-error", handler as EventListener);
  }, []);

  const config = {
    401: {
      title: "Session expired",
      color: "yellow",
    },
    403: {
      title: "Access denied",
      color: "orange",
    },
    500: {
      title: "Server error",
      color: "red",
    },
  };

  const current = config[status as keyof typeof config] || {
    title: "Something went wrong",
    color: "red",
  };

  const colorStyles = {
    red: {
      bg: "bg-red-100",
      text: "text-red-600",
      button: "bg-red-600 hover:bg-red-700",
    },
    yellow: {
      bg: "bg-yellow-100",
      text: "text-yellow-600",
      button: "bg-yellow-500 hover:bg-yellow-600",
    },
    orange: {
      bg: "bg-orange-100",
      text: "text-orange-600",
      button: "bg-orange-500 hover:bg-orange-600",
    },
  };

  const style = colorStyles[current.color as keyof typeof colorStyles];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-[90%] max-w-sm rounded-2xl bg-background border shadow-xl p-6 text-center"
          >
            <div
              className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${style.bg}`}
            >
              <AlertTriangle className={`h-7 w-7 ${style.text}`} />
            </div>

            <h2 className="text-lg font-semibold text-foreground">
              {current.title}
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              {status} {message}
            </p>

            <button
              onClick={() => {
                setOpen(false);
                if (status === 401) {
                  window.location.href = "/login";
                }
              }}
              className={`mt-5 w-full rounded-lg py-2.5 text-sm font-medium text-white transition ${style.button}`}
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
