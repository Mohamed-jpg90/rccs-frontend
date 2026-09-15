import React from "react";
import Image from "next/image";
import { MdOutlinePeople, MdEvent } from "react-icons/md";
import { formatDate } from "@/lib/Format";

export default function ClubHero({ club, baseUrl = "", eventsCount = 0 }) {
  if (!club) return null;

  const { clubName, description, coverImage, maxMembers, currentMembersCount, createdAt } = club;

  const imageSrc = coverImage
    ? coverImage.startsWith("http")
      ? coverImage
      : `${baseUrl}${coverImage}`
    : null;

  const isFull = currentMembersCount >= maxMembers;

  return (
    <div className="flex flex-col overflow-hidden rounded-[var(--radius-xl-value)] border border-[var(--border)] bg-[var(--bg-card)] shadow-[var(--shadow-sm-value)] md:flex-row">
      {/* Image side */}
      <div className="group relative h-64 w-full shrink-0 overflow-hidden md:h-auto md:w-2/5">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={clubName}
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[var(--bg-hover)] text-sm text-[var(--text-muted)]">
            No image
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-90" />

        <span
          className="absolute left-4 top-4 z-10 rounded-full px-3 py-1 text-xs font-semibold shadow-sm"
          style={{
            background: isFull ? "var(--danger)" : "var(--success)",
            color: "white",
          }}
        >
          {isFull ? "Full" : "Open"}
        </span>
      </div>

      {/* Details side */}
      <div className="flex flex-1 flex-col justify-center gap-4 p-6 md:p-8">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[var(--text-primary)] md:text-3xl">
            {clubName}
          </h1>
          {description && (
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{description}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-[var(--text-secondary)]">
          <span className="flex items-center gap-1.5">
            <MdOutlinePeople className="text-base text-[var(--primary)]" />
            {currentMembersCount}/{maxMembers} members
          </span>
          <span className="flex items-center gap-1.5">
            <MdEvent className="text-base text-[var(--primary)]" />
            {eventsCount} event{eventsCount === 1 ? "" : "s"}
          </span>
          {createdAt && (
            <span className="text-[var(--text-muted)]">Since {formatDate(createdAt)}</span>
          )}
        </div>
      </div>
    </div>
  );
}