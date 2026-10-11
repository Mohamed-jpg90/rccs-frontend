const TOKEN_KEY = 'rccs:token'
const USER_KEY = 'rccs:user'
import { jwtDecode } from 'jwt-decode'

export function saveAuth({ token, user }) {
  if (typeof window === 'undefined') return
  if (token) localStorage.setItem(TOKEN_KEY, token)
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function getUser() {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearAuth() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function logoutAndRedirect() {
  if (typeof window === 'undefined') return

  const { pathname, search } = window.location
  clearAuth()

  if (pathname !== '/login' && pathname !== '/register') {
    const target = encodeURIComponent(`${pathname}${search}`)
    window.location.replace(`/login?redirect=${target}`)
  }
}

export function getTokenExpiry(token = getToken()) {
  if (!token) return null

  try {
    const { exp } = jwtDecode(token)
    return typeof exp === 'number' ? exp * 1000 : null
  } catch {
    return null
  }
}

export function isAuthenticated() {
  const token = getToken()
  if (!token) return false

  const expiresAt = getTokenExpiry(token)
  if (!expiresAt || expiresAt <= Date.now()) {
    clearAuth()
    return false
  }

  return true
}

export function isAdmin() {
  const user = getUser()
  return user?.role === 'Admin'
}

export function isTeamLeader() {
  const user = getUser()
  return user?.role === 'Team Leader'
}
