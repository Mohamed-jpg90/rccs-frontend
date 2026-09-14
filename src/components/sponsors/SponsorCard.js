"use client";

import { FaEdit, FaTrash, FaBuilding } from "react-icons/fa";
import { useState } from "react";

const FILE_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
  "http://localhost:5000";

export default function SponsorCard({ sponsor, onEdit, onDelete }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="group relative bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-xl-value)] shadow-[var(--shadow-sm-value)] hover:shadow-[var(--shadow-lg-value)] transition-all duration-300 overflow-hidden">
      <div className="h-32 flex items-center justify-center bg-[var(--bg-surface)] p-5">
        {imageError ? (
          <FaBuilding className="text-3xl text-[var(--text-muted)]" />
        ) : (
          <img
            src={`${FILE_BASE_URL}${sponsor.image}`}
            alt={sponsor.name}
            onError={() => setImageError(true)}
            className="max-h-full max-w-full object-contain"
          />
        )}
      </div>

      <div className="p-4">
        {sponsor.sector && (
          <span className="text-[10px] font-semibold tracking-wider uppercase text-[var(--primary)]">
            {sponsor.sector}
          </span>
        )}
        <h3 className="font-display font-semibold text-[var(--text-primary)] truncate mt-0.5">
          {sponsor.name}
        </h3>
        {sponsor.title && (
          <p className="text-xs text-[var(--text-secondary)] truncate mt-0.5">{sponsor.title}</p>
        )}
      </div>

      {/* Action buttons — appear on hover */}
      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(sponsor)}
          title="Edit"
          className="h-8 w-8 flex items-center justify-center rounded-full bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--primary)] hover:border-[var(--primary)] shadow-sm transition-colors"
        >
          <FaEdit className="text-xs" />
        </button>
        <button
          onClick={() => onDelete(sponsor)}
          title="Delete"
          className="h-8 w-8 flex items-center justify-center rounded-full bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-red-500 hover:border-red-500 shadow-sm transition-colors"
        >
          <FaTrash className="text-xs" />
        </button>
      </div>
    </div>
  );
}