'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api'
import { formatDateTime } from '@/lib/Format'
import { getCachedContent, cacheContent } from '@/lib/contentCache'
import { FaYoutube, FaGoogleDrive } from 'react-icons/fa'
import { MdOpenInNew, MdArrowBack } from 'react-icons/md'

const TYPE_META = {
  YouTube: { icon: FaYoutube, color: 'text-red-500', bg: 'bg-red-500/10' },
  Drive: { icon: FaGoogleDrive, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
}

// Converts a YouTube watch/share/shorts URL to an embeddable one.
function toYoutubeEmbedUrl(url) {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtube.com')) {
      if (u.searchParams.get('v')) return `https://www.youtube.com/embed/${u.searchParams.get('v')}`
      const shorts = u.pathname.match(/\/shorts\/([^/?]+)/)
      if (shorts) return `https://www.youtube.com/embed/${shorts[1]}`
    }
    if (u.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}`
    }
    return null
  } catch {
    return null
  }
}

// Converts a Google Drive share link into an embeddable preview link, if possible.
function toDrivePreviewUrl(url) {
  try {
    const idFromPath = url.match(/\/d\/([a-zA-Z0-9_-]+)/)
    const idFromQuery = url.match(/[?&]id=([a-zA-Z0-9_-]+)/)
    const id = idFromPath?.[1] || idFromQuery?.[1]
    return id ? `https://drive.google.com/file/d/${id}/preview` : null
  } catch {
    return null
  }
}

export default function ContentDetailView({ contentId, backHref }) {
  const router = useRouter()

  const [content, setContent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!contentId) return

    // 1. Try the cache first — instant, no network call, populated by the card's onClick.
    const cached = getCachedContent(contentId)
    if (cached) {
      setContent(cached)
      setIsLoading(false)
      return
    }

    // 2. Fallback for refreshes / direct links: there's no GET /content/:id yet,
    //    so pull the full list and find the match, then cache it for next time.
    const fetchFromList = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const res = await apiClient.get('/content')
        const match = (res.data?.content ?? []).find((c) => c._id === contentId)
        if (!match) {
          setError('Content not found.')
          return
        }
        cacheContent(match)
        setContent(match)
      } catch (err) {
        console.error(err)
        setError('Could not load this content item.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchFromList()
  }, [contentId])

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
      </div>
    )
  }

  if (error || !content) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 text-sm text-[var(--danger)]">
        <p>{error ?? 'Content not found.'}</p>
        <button
          onClick={() => router.push(backHref ?? '/content')}
          className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white"
        >
          Back to Content
        </button>
      </div>
    )
  }

  const { title, description, type, externalUrl, club, createdAt } = content
  const meta = TYPE_META[type] ?? TYPE_META.Drive
  const Icon = meta.icon

  const youtubeEmbedUrl = type === 'YouTube' ? toYoutubeEmbedUrl(externalUrl) : null
  const drivePreviewUrl = type === 'Drive' ? toDrivePreviewUrl(externalUrl) : null
  const embedUrl = youtubeEmbedUrl || drivePreviewUrl

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <button
        onClick={() => router.back()}
        className="flex w-fit items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
      >
        <MdArrowBack className="text-base" />
        Back
      </button>

      <div className="flex flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] shadow-sm">
        {/* Embedded player/preview when we can build one, otherwise a branded placeholder */}
        {embedUrl ? (
          <div className="relative aspect-video w-full bg-black">
            <iframe
              src={embedUrl}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        ) : (
          <div className={`flex aspect-video w-full items-center justify-center ${meta.bg}`}>
            <Icon className={`text-6xl ${meta.color}`} />
          </div>
        )}

        {/* Info */}
        <div className="flex flex-col gap-4 p-6 md:p-8">
          <div className="flex items-center gap-3">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${meta.bg} ${meta.color}`}>
              <Icon className="text-xl" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">{title}</h1>
              <span className="w-fit rounded-full bg-[var(--bg-hover)] px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)]">
                {type}
              </span>
            </div>
          </div>

          {description && (
            <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
          )}

          <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-[var(--border)] pt-4 text-sm text-[var(--text-secondary)]">
            {club?.clubName && <span>Club: {club.clubName}</span>}
            {createdAt && <span>Added {formatDateTime(createdAt)}</span>}
          </div>

          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-fit items-center gap-2 rounded-full bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            <MdOpenInNew className="text-base" />
            Open on {type === 'YouTube' ? 'YouTube' : 'Google Drive'}
          </a>
        </div>
      </div>
    </div>
  )
}