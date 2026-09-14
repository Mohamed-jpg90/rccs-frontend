'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { MdLibraryBooks, MdSearch } from 'react-icons/md'
import { FaYoutube, FaGoogleDrive } from 'react-icons/fa'
import { apiClient } from '@/lib/api'
import SummaryCard from '@/components/shared/SummaryCard'
import ContentCard from '@/components/shared/ContentCard'
import ContentFormModal from '@/components/shared/ContentFormModal'
import ConfirmDeleteDialog from '@/components/shared/ConfirmDeleteDialog'
import { cacheContent } from '@/lib/contentCache'

const FILTERS = [
  { value: '', label: 'All' },
  { value: 'YouTube', label: 'YouTube', icon: FaYoutube },
  { value: 'Drive', label: 'Drive', icon: FaGoogleDrive },
]

export default function ContentPage() {
  const router = useRouter()
  const [content, setContent] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [editingContent, setEditingContent] = useState(null)
  const [deletingContent, setDeletingContent] = useState(null)

  const fetchContent = () => {
    setIsLoading(true)
    apiClient
      .get('/content')
      .then((res) => setContent(res.data?.content ?? []))
      .catch((err) => console.error('Failed to load content', err))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    fetchContent()
  }, [])

  const filteredContent = useMemo(
    () =>
      content
        .filter((c) => !typeFilter || c.type === typeFilter)
        .filter((c) => c.title?.toLowerCase().includes(search.trim().toLowerCase())),
    [content, search, typeFilter]
  )

  const handleDeleteContent = async () => {
    if (!deletingContent) return
    await apiClient.delete(`/content/${deletingContent._id}`)
    setContent((prev) => prev.filter((c) => c._id !== deletingContent._id))
  }

  const handleOpenContent = (item) => {
    // Stash it so the detail page can render instantly without an API call
    cacheContent(item)
    router.push(`content/${item._id}`)
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <SummaryCard
        icon={MdLibraryBooks}
        title="Total Content"
        total={content.length}
        onAddClick={() => {
          setEditingContent(null)
          setModalOpen(true)
        }}
        buttonTitle="Add Content"
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <MdSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search content..."
            className="w-full rounded-full border border-[var(--border)] bg-[var(--bg-main)] py-2.5 pl-10 pr-4 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--primary)]"
          />
        </div>

        <div className="flex gap-2">
          {FILTERS.map((f) => {
            const Icon = f.icon
            const active = typeFilter === f.value
            return (
              <button
                key={f.value || 'all'}
                onClick={() => setTypeFilter(f.value)}
                className={`flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]'
                    : 'border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
                }`}
              >
                {Icon && <Icon className="text-sm" />}
                {f.label}
              </button>
            )
          })}
        </div>
      </div>

      {isLoading && <p className="text-sm text-[var(--text-muted)]">Loading content...</p>}
      {!isLoading && filteredContent.length === 0 && (
        <p className="text-sm text-[var(--text-muted)]">No content found.</p>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredContent.map((item) => (
          <ContentCard
            key={item._id}
            content={item}
            clubName={item.club?.clubName}
            onClick={() => handleOpenContent(item)}
            onEdit={(c) => {
              setEditingContent(c)
              setModalOpen(true)
            }}
            onDelete={(c) => setDeletingContent(c)}
          />
        ))}
      </div>

      <ContentFormModal
        isOpen={modalOpen}
        content={editingContent}
        onClose={() => setModalOpen(false)}
        onSaved={fetchContent}
      />
      <ConfirmDeleteDialog
        isOpen={!!deletingContent}
        itemName={deletingContent?.title}
        onClose={() => setDeletingContent(null)}
        onConfirm={handleDeleteContent}
      />
    </div>
  )
}