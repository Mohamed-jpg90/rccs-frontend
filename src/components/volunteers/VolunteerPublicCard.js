"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUser } from "react-icons/fa";

const FILE_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
  "https://rccs-backend-production.up.railway.app";

export default function VolunteerPublicCard({ volunteer }) {
  const [imageError, setImageError] = useState(false);
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(`/volunteers/${volunteer._id}`)}
      className="group text-left bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-xl-value)] shadow-[var(--shadow-sm-value)] hover:shadow-[var(--shadow-lg-value)] transition-all duration-300 hover:-translate-y-1 overflow-hidden"
    >
      <div className="h-52 w-full overflow-hidden bg-[var(--bg-surface)]">
        {imageError ? (
          <div className="h-full w-full flex items-center justify-center">
            <FaUser className="text-3xl text-[var(--text-muted)]" />
          </div>
        ) : (
          <img
            src={`${FILE_BASE_URL}${volunteer.image}`}
            alt={volunteer.name}
            onError={() => setImageError(true)}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
      </div>
      <div className="p-5">
        <h3 className="font-display font-semibold text-lg text-[var(--text-primary)] truncate">
          {volunteer.name}
        </h3>
        {volunteer.description && (
          <p className="text-sm text-[var(--text-secondary)] mt-2 line-clamp-2">
            {volunteer.description}
          </p>
        )}
      </div>
    </button>
  );
}