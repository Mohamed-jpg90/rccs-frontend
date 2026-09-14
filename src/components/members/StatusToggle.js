import React from 'react'

/**
 * StatusToggle — simple switch. active=true means status "Active",
 * false means "Inactive" (matches your /users/:id/status API values).
 */
export default function StatusToggle({ active, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      onClick={() => onChange(!active)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        active ? 'bg-[var(--success)]' : 'bg-[var(--border)]'
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          active ? 'translate-x-[22px]' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}