'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { MdRefresh } from 'react-icons/md'
import { apiClient } from '@/lib/api'
import toast from 'react-hot-toast'

// Parses "15m" / "30s" / "1h" style strings from the API into seconds.
// Falls back to 15 minutes if the format is ever different than expected.
function parseExpiresIn(expiresIn) {
  const match = /^(\d+)([smh])$/.exec(expiresIn ?? '')
  if (!match) return 15 * 60
  const value = Number(match[1])
  const unit = match[2]
  if (unit === 's') return value
  if (unit === 'm') return value * 60
  if (unit === 'h') return value * 3600
  return 15 * 60
}

export default function EventQrCode({ eventId }) {
  const [qr, setQr] = useState(null) // { qrImageDataUrl, token }
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetchQr = useCallback(() => {
    setLoading(true)
    apiClient
      .get(`/events/${eventId}/qrcode`)
      .then((res) => {
        setQr(res.data)
        setSecondsLeft(parseExpiresIn(res.data?.expiresIn))
      })
      .catch(() => toast.error('Could not load the check-in QR code'))
      .finally(() => setLoading(false))
  }, [eventId])

  useEffect(() => {
    fetchQr()
  }, [fetchQr])

  useEffect(() => {
    if (secondsLeft <= 0) return
    const interval = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(interval)
  }, [secondsLeft])

  const expired = qr && secondsLeft <= 0
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const ss = String(secondsLeft % 60).padStart(2, '0')

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-[var(--text-primary)]">Check-in QR Code</h3>

      {qr && !loading ? (
        <img
          src={qr.qrImageDataUrl}
          alt="Event check-in QR code"
          className={`h-56 w-56 rounded-xl border border-[var(--border)] ${expired ? 'opacity-30' : ''}`}
        />
      ) : (
        <div className="flex h-56 w-56 items-center justify-center rounded-xl border border-dashed border-[var(--border)] text-sm text-muted-foreground">
          {loading ? 'Loading...' : 'No QR code yet'}
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        {expired ? 'This QR code has expired.' : qr ? `Expires in ${mm}:${ss}` : ''}
      </p>

      <button
        type="button"
        onClick={fetchQr}
        disabled={loading}
        className="flex items-center gap-1.5 rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        <MdRefresh /> {expired ? 'Generate New Code' : 'Refresh'}
      </button>
    </div>
  )
}