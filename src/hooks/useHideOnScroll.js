'use client'

import { useEffect, useState, useRef } from 'react'

/**
 * Returns true when a fixed element should be visible:
 * shown near the top, shown while scrolling up, hidden while scrolling down.
 */
export function useHideOnScroll(topThreshold = 80) {
  const [visible, setVisible] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    lastScrollY.current = window.scrollY

    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY < topThreshold) {
        setVisible(true)
      } else if (currentScrollY > lastScrollY.current) {
        setVisible(false) // scrolling down
      } else {
        setVisible(true) // scrolling up
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [topThreshold])

  return visible
}