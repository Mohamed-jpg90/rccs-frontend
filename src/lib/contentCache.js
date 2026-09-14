const PREFIX = 'rccs:content:'

export function cacheContent(item) {
  if (!item?._id || typeof window === 'undefined') return
  try {
    localStorage.setItem(`${PREFIX}${item._id}`, JSON.stringify(item))
  } catch (err) {
    console.error('Failed to cache content', err)
  }
}

export function getCachedContent(id) {
  if (!id || typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(`${PREFIX}${id}`)
    return raw ? JSON.parse(raw) : null
  } catch (err) {
    console.error('Failed to read cached content', err)
    return null
  }
}