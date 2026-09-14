'use client'

import React, { useEffect } from 'react'
import { HiX } from 'react-icons/hi'

/**
 * Drawer — a shared slide-in panel from the right edge of the screen.
 * Stays mounted at all times so open/close animate via transform,
 * rather than popping in/out like Modal does.
 */
export default function Drawer({ isOpen, onClose, title, children, widthClass = 'max-w-md' }) {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen, onClose])

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? '' : 'pointer-events-none'}`} aria-hidden={!isOpen}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'
          }`}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        className={`absolute right-0 top-0 h-full w-full ${widthClass} transform bg-[var(--bg-card)] shadow-[var(--shadow-lg-value)] transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex h-full flex-col overflow-y-auto p-6">
          <div className="mb-4 flex items-center justify-between border-b border-[var(--border)] pb-4">
            {title && <h2 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h2>}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="ml-auto rounded-full p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-hover)]"
            >
              <HiX className="text-lg" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}