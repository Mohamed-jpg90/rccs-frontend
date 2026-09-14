import React from 'react'
import { FaYoutube, FaGoogleDrive } from 'react-icons/fa'
import { MdOpenInNew, MdEdit, MdDeleteOutline } from 'react-icons/md'

// Pulls the video ID out of a youtube.com/watch, youtu.be, or /shorts link.
function getYoutubeId(url) {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtube.com')) {
      if (u.searchParams.get('v')) return u.searchParams.get('v')
      const shorts = u.pathname.match(/\/shorts\/([^/?]+)/)
      if (shorts) return shorts[1]
    }
    if (u.hostname === 'youtu.be') return u.pathname.slice(1)
    return null
  } catch {
    return null
  }
}

const TYPE_STYLES = {
  YouTube: {
    icon: FaYoutube,
    badgeClass: 'bg-red-500/10 text-red-500',
    iconWrapClass: 'bg-red-500/10 text-red-500',
  },
  Drive: {
    icon: FaGoogleDrive,
    badgeClass: 'bg-emerald-500/10 text-emerald-600',
    iconWrapClass: 'bg-emerald-500/10 text-emerald-600',
  },
}

/**
 * ContentCard — content item card with a YouTube thumbnail preview when
 * available, or a branded icon tile for Drive links.
 */
export default function ContentCard({ content, clubName, onEdit, onDelete, onClick }) {
  if (!content) return null

  const { title, description, type, externalUrl } = content
  const style = TYPE_STYLES[type] ?? TYPE_STYLES.Drive
  const TypeIcon = style.icon

  const youtubeId = type === 'YouTube' ? getYoutubeId(externalUrl) : null
  const thumbnailUrl = youtubeId ? `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg` : null

  return (
    <div
      onClick={onClick}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* Preview area */}
      <div className="relative aspect-video w-full overflow-hidden bg-[var(--bg-hover)]">
        {thumbnailUrl ? (
          <>
            <img
              src={thumbnailUrl}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90">
                <FaYoutube className="text-2xl text-red-500" />
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${style.iconWrapClass}`}>
              <TypeIcon className="text-2xl" />
            </div>
          </div>
        )}

        <span
          className={`absolute right-2.5 top-2.5 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur ${style.badgeClass}`}
        >
          <TypeIcon className="text-xs" />
          {type}
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <div className="flex items-start justify-between gap-2">
          <h4 className="truncate font-semibold text-[var(--text-primary)]">{title}</h4>
          <div className="flex shrink-0 gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onEdit?.(content)
              }}
              aria-label="Edit content"
              className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-main)] hover:text-[var(--text-primary)]"
            >
              <MdEdit className="text-sm" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onDelete?.(content)
              }}
              aria-label="Delete content"
              className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--danger)] transition-colors hover:bg-[var(--danger)]/10"
            >
              <MdDeleteOutline className="text-sm" />
            </button>
          </div>
        </div>

        {description && <p className="line-clamp-2 text-sm text-muted-foreground">{description}</p>}

        <div className="mt-auto flex items-center justify-between gap-3 pt-2 text-xs text-muted-foreground">
          {clubName ? (
            <span className="truncate rounded-full bg-[var(--bg-hover)] px-2.5 py-1 font-medium text-[var(--text-secondary)]">
              {clubName}
            </span>
          ) : (
            <span />
          )}
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex shrink-0 items-center gap-1 font-medium text-[var(--primary)] hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            <MdOpenInNew className="text-sm" />
            Open
          </a>
        </div>
      </div>
    </div>
  )
}