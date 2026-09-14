"use client";

import { Toaster } from "react-hot-toast";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3500,
        style: {
          background: "var(--bg-card)",
          color: "var(--text-primary)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg-value)",
          padding: "12px 16px",
          fontSize: "14px",
          fontWeight: 500,
          boxShadow: "var(--shadow-lg-value)",
        },
        success: {
          iconTheme: {
            primary: "var(--success)",
            secondary: "var(--bg-card)",
          },
          style: {
            borderColor: "var(--success)",
          },
        },
        error: {
          iconTheme: {
            primary: "var(--danger)",
            secondary: "var(--bg-card)",
          },
          style: {
            borderColor: "var(--danger)",
          },
        },
        loading: {
          iconTheme: {
            primary: "var(--primary)",
            secondary: "var(--bg-card)",
          },
        },
      }}
    />
  );
}