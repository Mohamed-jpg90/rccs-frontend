"use client";

import { FaExclamationTriangle } from "react-icons/fa";

export default function DeleteVolunteerModal({ open, onClose, onConfirm, volunteer, deleting }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-xl-value)] shadow-[var(--shadow-lg-value)] p-6 text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
          <FaExclamationTriangle className="text-red-500 text-xl" />
        </div>
        <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-2">
          Delete Volunteer
        </h3>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          Are you sure you want to delete{" "}
          <span className="font-medium text-[var(--text-primary)]">{volunteer?.name}</span>?
          This will also remove their photo. This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-full border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 py-2.5 rounded-full bg-red-500 hover:bg-red-600 text-white font-medium transition-colors disabled:opacity-60"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}