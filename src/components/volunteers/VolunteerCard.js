"use client";

import { useState } from "react";
import { FaEdit, FaTrash, FaUser, FaLink } from "react-icons/fa";

const FILE_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
  "http://localhost:5000";

export default function VolunteerCard({ volunteer, onEdit, onDelete }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="group relative bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-xl-value)] shadow-[var(--shadow-sm-value)] hover:shadow-[var(--shadow-lg-value)] transition-all duration-300 overflow-hidden p-5 text-center">
      <div className="h-24 w-24 mx-auto rounded-full overflow-hidden bg-[var(--bg-surface)] border border-[var(--border)] flex items-center justify-center mb-4">
        {imageError ? (
          <FaUser className="text-2xl text-[var(--text-muted)]" />
        ) : (
          <img
            src={`${FILE_BASE_URL}${volunteer.image}`}
            alt={volunteer.name}
            onError={() => setImageError(true)}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <h3 className="font-display font-semibold text-[var(--text-primary)] truncate">
        {volunteer.name}
      </h3>
      {volunteer.email && (
        <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">{volunteer.email}</p>
      )}
      {volunteer.description && (
        <p className="text-xs text-[var(--text-secondary)] mt-2 line-clamp-2">
          {volunteer.description}
        </p>
      )}
      {volunteer.linkedUser && (
        <span className="inline-flex items-center gap-1 mt-3 text-[10px] font-medium text-[var(--primary)] bg-[var(--primary-light)] px-2.5 py-1 rounded-full">
          <FaLink className="text-[9px]" />
          Linked account
        </span>
      )}

      {/* Action buttons — appear on hover */}
      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(volunteer)}
          title="Edit"
          className="h-8 w-8 flex items-center justify-center rounded-full bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--primary)] hover:border-[var(--primary)] shadow-sm transition-colors"
        >
          <FaEdit className="text-xs" />
        </button>
        <button
          onClick={() => onDelete(volunteer)}
          title="Delete"
          className="h-8 w-8 flex items-center justify-center rounded-full bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-red-500 hover:border-red-500 shadow-sm transition-colors"
        >
          <FaTrash className="text-xs" />
        </button>
      </div>
    </div>
  );
}