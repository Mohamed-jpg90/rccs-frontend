'use client'

import { use } from 'react'
import ContentDetailView from '@/components/content/ContentDetailView'

export default function TeamLeaderContentDetailPage({ params }) {
  const { contentId } = use(params)
  return <ContentDetailView contentId={contentId} backHref={`/team-leader/dashboard`} />
}