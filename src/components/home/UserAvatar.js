import React from "react";
import Image from "next/image";
export default function UserAvatar({ name, imageSrc, size = 40 }) {
  if (imageSrc) {
    return (
      <Image
        src={imageSrc}
        alt={name}
        className="shrink-0 rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full bg-[var(--primary-light)] text-[13px] font-semibold text-[var(--primary)]"
      style={{ width: size, height: size }}
    >
      {initials}
    </div>
  );
}