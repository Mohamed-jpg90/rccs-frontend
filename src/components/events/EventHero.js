import React from "react";
import Image from "next/image";
import { HiOutlineCalendar, HiOutlineClock } from "react-icons/hi";
import { MdLocationOn, MdOutlinePeople } from "react-icons/md";
import { formatDate, formatTime } from "@/lib/Format";

const STATUS_STYLES = {
  Upcoming: "bg-[var(--primary)] text-white",
  Ongoing: "bg-[var(--success)] text-white",
  Finished: "bg-black/50 text-white",
  Cancelled: "bg-[var(--danger)] text-white",
};

export default function EventHero({ event, baseUrl = "" }) {
  if (!event) return null;

  const { title, description, coverImage, club, location, date, time, capacity, status } = event;

  const imageSrc = coverImage
    ? coverImage.startsWith("http")
      ? coverImage
      : `${baseUrl}${coverImage}`
    : null;

  return (
    <div className="flex flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] shadow-sm md:flex-row">
      {/* Image side */}
      <div className="group relative h-64 w-full shrink-0 overflow-hidden md:h-auto md:w-2/5">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[var(--bg-hover)] text-sm text-muted-foreground">
            No image
          </div>
        )}

        {/* Darken on hover so a caption/status stays legible */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-90" />

        {/* Diagonal light sweep on hover */}
        <div className="pointer-events-none absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />

        {status && (
          <span
            className={`absolute left-4 top-4 z-10 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${
              STATUS_STYLES[status] ?? "bg-black/50 text-white"
            }`}
          >
            {status}
          </span>
        )}

        {club?.clubName && (
          <span className="absolute bottom-4 left-4 z-10 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {club.clubName}
          </span>
        )}
      </div>

      {/* Details side */}
      <div className="flex flex-1 flex-col justify-center gap-4 p-6 md:p-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] md:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-[var(--text-secondary)]">
          <span className="flex items-center gap-1.5">
            <HiOutlineCalendar className="text-base text-[var(--primary)]" />
            {formatDate(date)}
          </span>
          {time && (
            <span className="flex items-center gap-1.5">
              <HiOutlineClock className="text-base text-[var(--primary)]" />
              {formatTime(time)}
            </span>
          )}
          {location && (
            <span className="flex items-center gap-1.5">
              <MdLocationOn className="text-base text-[var(--primary)]" />
              {location}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <MdOutlinePeople className="text-base text-[var(--primary)]" />
            {capacity} capacity
          </span>
        </div>
      </div>
    </div>
  );
}