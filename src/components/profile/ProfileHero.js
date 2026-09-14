import React from 'react'
import { MdEmail, MdPhone, MdGroups, MdStars } from 'react-icons/md'
import UserAvatar from '@/components/members/UserAvatar'

const ROLE_STYLES = {
  Admin: 'bg-white/20 text-white',
  'Team Leader': 'bg-white/20 text-white',
  User: 'bg-white/20 text-white',
}

export default function ProfileHero({ user, baseUrl = '' }) {
  if (!user) return null

  const { fullName, email, phoneNumber, role, profileImage, status, totalPoints, club } = user

  return (
    <div
      className="flex flex-col gap-6 overflow-hidden rounded-3xl p-6 text-white shadow-[var(--shadow-primary-value)] sm:flex-row sm:items-center sm:p-8"
      style={{
        background:
          'linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary-hover) 85%, black) 100%)',
      }}
    >
      <UserAvatar name={fullName} imageSrc={profileImage} baseUrl={baseUrl} size={88} />

      <div className="flex flex-1 flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold">{fullName}</h1>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${ROLE_STYLES[role] ?? ROLE_STYLES.User}`}>
            {role}
          </span>
          <span
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
              status === 'Active' ? 'bg-[var(--success)] text-white' : 'bg-white/20 text-white'
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {status}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/80">
          {email && (
            <span className="flex items-center gap-1.5">
              <MdEmail className="text-base" />
              {email}
            </span>
          )}
          {phoneNumber && (
            <span className="flex items-center gap-1.5">
              <MdPhone className="text-base" />
              {phoneNumber}
            </span>
          )}
          {club?.clubName && (
            <span className="flex items-center gap-1.5">
              <MdGroups className="text-base" />
              {club.clubName}
            </span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-center justify-center gap-1 rounded-2xl bg-white/15 px-6 py-4">
        <MdStars className="text-2xl" />
        <span className="text-2xl font-bold">{totalPoints ?? 0}</span>
        <span className="text-xs text-white/70">Total Points</span>
      </div>
    </div>
  )
}