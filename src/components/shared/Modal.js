// 'use client'

// import React, { useEffect } from 'react'
// import { HiX } from 'react-icons/hi'

// /**
//  * Modal — a shared popup shell. Handles backdrop click, Escape-to-close,
//  * and locking body scroll while open. Content is passed as children,
//  * so any form or panel can reuse this.
//  */
// export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) {
//   useEffect(() => {
//     if (!isOpen) return

//     const handleKeyDown = (e) => {
//       if (e.key === 'Escape') onClose()
//     }
//     document.addEventListener('keydown', handleKeyDown)
//     const previousOverflow = document.body.style.overflow
//     document.body.style.overflow = 'hidden'

//     return () => {
//       document.removeEventListener('keydown', handleKeyDown)
//       document.body.style.overflow = previousOverflow
//     }
//   }, [isOpen, onClose])

//   if (!isOpen) return null

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//       <div
//         onClick={onClose}
//         aria-hidden="true"
//         className="absolute inset-0 bg-black/50 backdrop-blur-sm"
//       />
//       <div
//         role="dialog"
//         aria-modal="true"
//         className={`relative z-10 max-h-[90vh] w-full ${maxWidth} overflow-y-auto rounded-3xl bg-[var(--bg-card)] p-6 shadow-2xl`}
//       >
//         <div className="mb-4 flex items-center justify-between">
//           {title && (
//             <h2 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h2>
//           )}
//           <button
//             type="button"
//             onClick={onClose}
//             aria-label="Close"
//             className="ml-auto rounded-full p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-hover)]"
//           >
//             <HiX className="text-lg" />
//           </button>
//         </div>
//         {children}
//       </div>
//     </div>
//   )
// }


'use client'

import React, { useEffect } from 'react'
import { HiX } from 'react-icons/hi'

/**
 * Modal — a shared popup shell. Handles backdrop click, Escape-to-close,
 * and locking body scroll while open. Content is passed as children,
 * so any form or panel can reuse this.
 */
export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) {
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        aria-hidden="true"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`relative z-10 max-h-[90vh] w-full ${maxWidth} overflow-y-auto rounded-3xl bg-[var(--bg-card)] p-6 shadow-2xl`}
      >
        <div className="mb-4 flex items-center justify-between">
          {title && (
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h2>
          )}
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
  )
}