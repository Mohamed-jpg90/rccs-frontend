'use client'

import React, { useState } from 'react'
import { FaStar, FaRegStar } from 'react-icons/fa'

export default function StarRating({ value = 0, onChange, readOnly = false, size = 'text-base' }) {
  const [hovered, setHovered] = useState(0)
  const display = hovered || value

  return (
    <div className={`flex items-center gap-1 ${size}`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= display
        const Icon = filled ? FaStar : FaRegStar
        if (readOnly) {
          return <Icon key={star} className="text-[var(--primary)]" />
        }
        return (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange?.(star)}
            className="text-[var(--primary)] transition-transform hover:scale-110"
            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
          >
            <Icon />
          </button>
        )
      })}
    </div>
  )
}