import React from "react";
import Image from "next/image";

/**
 * Card — a shared, reusable card container.
 *
 * Supports an optional background image with a bottom glass/fade panel,
 * so it can be reused for events, clubs, or any other image-backed card.
 *
 * Props:
 * - image:     optional background image URL. If omitted, renders a plain card.
 * - aspect:    tailwind aspect-ratio class for the image card (default 4:5)
 * - topSlot:   content pinned to the top-right (e.g. a status badge)
 * - footer:    content rendered inside the bottom glass panel
 * - children:  extra content rendered above the footer (rarely needed)
 * - className: extra classes on the outer card
 * - onClick:   optional click handler, makes the card interactive
 */
export default function Card({
  image,
  aspect = "aspect-[4/5]",
  topSlot,
  footer,
  children,
  className = "",
  onClick,
}) {
  const isInteractive = typeof onClick === "function";

  return (
    <div
      onClick={onClick}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      className={`group relative overflow-hidden rounded-3xl bg-[var(--bg-card)] shadow-[var(--shadow-card-value)] ${
        image ? aspect : ""
      } ${
        isInteractive
          ? "cursor-pointer transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
          : ""
      } ${className}`}
    >
      {/* Background image */}
      {image && (
        <Image
          src={image}
          alt=""
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      )}

      {/* Darkening gradient so bottom text stays legible over any photo */}
      {image && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
      )}

      {/* Top-right slot, e.g. a status badge */}
      {topSlot && <div className="absolute right-3 top-3 z-20">{topSlot}</div>}

      {children}

      {/* Bottom glass panel */}
      {footer && (
        <div className="absolute inset-x-0 bottom-0 z-20 rounded-b-3xl border-t border-white/10 bg-white/10 p-5 backdrop-blur-md">
          {footer}
        </div>
      )}
    </div>
  );
}