'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { apiClient } from '@/lib/api'
import UsersTable from '@/components/members/UsersTable'
import DataCard from '@/components/analysis/DataCard'

const FILE_BASE_URL = 'http://localhost:5000'
const LIMIT = 20

export default function MembersPage() {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const [page, setPage] = useState(1)
  const [totalUsers, setTotalUsers] = useState(0)

  const fetchUsers = async (currentPage = page) => {
    try {
      setIsLoading(true)
      setError(null)

      const res = await apiClient.get(
        `/users?page=${currentPage}&limit=${LIMIT}`
      )

      const data = res.data

      setUsers(data?.users ?? [])

      // Change this depending on your backend response
      setTotalUsers(
        data?.totalUsers ??
        data?.total ??
        data?.pagination?.totalUsers ??
        0
      )
    } catch (err) {
      console.error(err)
      setError('Could not load members.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers(page)
  }, [page])

  const counts = useMemo(() => {
    const admins = users.filter((u) => u.role === 'Admin').length
    const teamLeaders = users.filter((u) => u.role === 'Team Leader').length
    const regular = users.filter((u) => u.role === 'User').length

    return {
      admins,
      teamLeaders,
      regular,
      total: totalUsers,
    }
  }, [users, totalUsers])

  const totalPages = Math.ceil(totalUsers / LIMIT)

  const handleRoleChange = async (userId, role) => {
    try {
      await apiClient.put(`/users/${userId}`, { role })

      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, role } : u
        )
      )
    } catch (err) {
      console.error('Failed to update role', err)
    }
  }

  const handleStatusChange = async (userId, status) => {
    try {
      await apiClient.patch(`/users/${userId}/status`, { status })

      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, status } : u
        )
      )
    } catch (err) {
      console.error('Failed to update status', err)
    }
  }

  const handleDelete = async (userId) => {
    try {
      await apiClient.delete(`/users/${userId}`)

      setUsers((prev) =>
        prev.filter((u) => u._id !== userId)
      )

      // If deleting the last user on a page,
      // go back one page.
      if (users.length === 1 && page > 1) {
        setPage((prev) => prev - 1)
      } else {
        fetchUsers(page)
      }
    } catch (err) {
      console.error('Failed to delete user', err)
    }
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <DataCard label="Total" value={counts.total} />
        <DataCard label="Admins" value={counts.admins} />
        <DataCard label="Team Leaders" value={counts.teamLeaders} />
        <DataCard label="Users" value={counts.regular} />
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
        </div>
      ) : error ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
          <p>{error}</p>

          <button
            onClick={() => fetchUsers(page)}
            className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white"
          >
            Retry
          </button>
        </div>
      ) : (
        <UsersTable
          users={users}
          baseUrl={FILE_BASE_URL}
          onRoleChange={handleRoleChange}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          page={page}
          totalPages={totalPages}
          totalUsers={totalUsers}
          onPageChange={setPage}
        />
      )}
    </div>
  )
}