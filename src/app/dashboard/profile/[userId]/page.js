'use client'

import { use } from 'react'
import MemberDetailView from '@/components/profile/MemberDetailView'

export default function ProfilePage({ params }) {
  const { userId } = use(params)
  return <MemberDetailView userId={userId} />
}