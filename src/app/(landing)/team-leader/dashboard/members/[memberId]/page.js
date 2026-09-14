'use client'

import { use } from 'react'
import MemberDetailView from '@/components/profile/MemberDetailView'

export default function TeamLeaderMemberDetailPage({ params }) {
  const { memberId } = use(params)
  return <MemberDetailView userId={memberId} />
}