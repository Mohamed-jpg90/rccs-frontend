"use client";

import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const SCOPE_OPTIONS = [
  {
    value: "club",
    label: "Remove from Club Only",
    hint: "The account will remain active, but the user will be removed from the club.",
  },
  {
    value: "system",
    label: "Delete Account Permanently",
    hint: "The user will be removed from the club and their account will be permanently deleted.",
  },
];

export default function ReasonModal({
  isOpen,
  onClose,
  onConfirm, // (reason, scope) => void
  isSubmitting,
  title,
  description,
  confirmLabel = "Confirm",
  showScopeSelector = false, // true → admin picks club/system via radio buttons
  fixedScope = "club", // used when showScopeSelector is false
}) {
  const [reason, setReason] = useState("");
  const [scope, setScope] = useState("club");

  useEffect(() => {
    if (isOpen) {
      setReason("");
      setScope("club");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!reason.trim()) return;
    onConfirm(reason.trim(), showScopeSelector ? scope : fixedScope);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-[var(--radius-xl-value)] bg-[var(--bg-card)] border border-[var(--border)] p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-display text-lg font-semibold text-[var(--text-primary)]">
            {title}
          </h3>

          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] disabled:opacity-50"
          >
            <FaTimes />
          </button>
        </div>

        {description && (
          <p className="text-sm text-[var(--text-muted)] mb-4">
            {description}
          </p>
        )}

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter the reason..."
          rows={3}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] p-3 text-sm focus:outline-none focus:border-[var(--border-focus)] resize-none"
        />

        {showScopeSelector && (
          <div className="mt-4 flex flex-col gap-2">
            <p className="text-xs font-medium text-[var(--text-secondary)]">
              Request Type
            </p>

            {SCOPE_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={`flex items-start gap-2.5 rounded-lg border px-3 py-2.5 cursor-pointer transition-colors ${
                  scope === opt.value
                    ? "border-[var(--primary)] bg-[var(--primary-light)]"
                    : "border-[var(--border)]"
                }`}
              >
                <input
                  type="radio"
                  name="removal-scope"
                  value={opt.value}
                  checked={scope === opt.value}
                  onChange={() => setScope(opt.value)}
                  className="mt-0.5"
                />

                <span>
                  <span className="block text-sm font-medium text-[var(--text-primary)]">
                    {opt.label}
                  </span>
                  <span className="block text-xs text-[var(--text-muted)]">
                    {opt.hint}
                  </span>
                </span>
              </label>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            disabled={isSubmitting || !reason.trim()}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--danger)] text-white disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}