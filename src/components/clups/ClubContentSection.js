'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaYoutube, FaGoogleDrive, FaPlus } from 'react-icons/fa'
import { MdOpenInNew } from 'react-icons/md'
import { cacheContent } from '@/lib/contentCache'
import ContentFormModal from '@/components/shared/ContentFormModal'

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

function ClubContentCard({ item, onClick }) {
  const style = TYPE_STYLES[item.type] ?? TYPE_STYLES.Drive
  const TypeIcon = style.icon

  const youtubeId = item.type === 'YouTube' ? getYoutubeId(item.externalUrl) : null
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
              alt={item.title}
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
          {item.type}
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="truncate font-semibold text-[var(--text-primary)]">{item.title}</h3>

        {item.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
        )}

        <div className="mt-auto flex items-center justify-end pt-2">
          <a
            href={item.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-medium text-[var(--primary)] hover:underline"
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

export default function ClubContentSection({ clubId, content = [], onContentAdded, showAddButton = false }) {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const canAdd = showAddButton

  const openContent = (item) => {
    // same pattern as the admin content list — stash it so the detail
    // page can render instantly without an extra API call
    cacheContent(item)
    router.push(`/content/${item._id}`)
  }

  if (content.length === 0 && !canAdd) return null

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 py-14">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
        <div>
          <span className="inline-block text-xs font-semibold tracking-[0.18em] uppercase text-[var(--primary)] mb-3">
            Resources
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-[var(--text-primary)]">
            Educational Content
          </h2>
        </div>
        {canAdd && (
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors"
          >
            <FaPlus className="text-xs" /> Add Content
          </button>
        )}
      </div>

      {content.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">No content yet — add the first one.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.map((item) => (
            <ClubContentCard key={item._id} item={item} onClick={() => openContent(item)} />
          ))}
        </div>
      )}

      <ContentFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        lockedClubId={clubId}
        onSaved={() => {
          setModalOpen(false)
          onContentAdded?.()
        }}
      />
    </section>
  )
}