import React from 'react'
import Image from 'next/image'
/**
 * UserAvatar — shows profileImage if present, otherwise initials on a
 * flat colored circle (deterministic color from the name so the same
 * user always gets the same color).
 */
const COLORS = ['#3b5dc8', '#8b5cf6', '#0891b2', '#b45309', '#4d7c0f', '#be123c']

function colorFor(name = '') {
  const sum = [...name].reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  return COLORS[sum % COLORS.length]
}

function initials(name = '') {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

export default function UserAvatar({ name, imageSrc, baseUrl = '', size = 40 }) {
  if (imageSrc) {
    return (
      <Image
        src={imageSrc.startsWith('http') ? imageSrc : `${baseUrl}${imageSrc}`}
        alt={name}
        style={{ width: size, height: size }}
        className="shrink-0 rounded-full object-cover"
      />
    )
  }

  return (
    <div
      style={{ width: size, height: size, backgroundColor: colorFor(name) }}
      className="flex shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
    >
      {initials(name)}
    </div>
  )
}