const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

const ACCESS_KEY = 'dera_access_token'
const REFRESH_KEY = 'dera_refresh_token'

export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY)
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY)
}

export function setTokens({ access, refresh }) {
  if (access) localStorage.setItem(ACCESS_KEY, access)
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh)
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY)
  localStorage.removeItem(REFRESH_KEY)
}

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

async function parseResponse(res) {
  const text = await res.text()
  const data = text ? JSON.parse(text) : null
  if (!res.ok) {
    const message =
      data?.detail ||
      (typeof data === 'object' && data ? Object.values(data).flat().join(' ') : null) ||
      `Request failed with status ${res.status}`
    throw new ApiError(message, res.status, data)
  }
  return data
}

async function refreshAccessToken() {
  const refresh = getRefreshToken()
  if (!refresh) return false
  try {
    const res = await fetch(`${BASE_URL}/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    })
    if (!res.ok) return false
    const data = await res.json()
    setTokens({ access: data.access })
    return true
  } catch {
    return false
  }
}

/**
 * Authenticated request helper. Attaches the stored access token and, on a
 * 401, attempts exactly one silent refresh + retry before giving up.
 */
async function request(method, path, body, { retry = true } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  const access = getAccessToken()
  if (access) headers.Authorization = `Bearer ${access}`

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (res.status === 401 && retry && getRefreshToken()) {
    const refreshed = await refreshAccessToken()
    if (refreshed) return request(method, path, body, { retry: false })
    clearTokens()
  }

  return parseResponse(res)
}

export const apiGet = (path) => request('GET', path)
export const apiPost = (path, body) => request('POST', path, body)
export const apiPatch = (path, body) => request('PATCH', path, body)
export const apiDelete = (path) => request('DELETE', path)

/**
 * Multipart form submission (e.g. file uploads). Omits the JSON
 * Content-Type header so the browser can set the multipart boundary itself.
 */
export async function apiPostForm(path, formData, { retry = true } = {}) {
  const headers = {}
  const access = getAccessToken()
  if (access) headers.Authorization = `Bearer ${access}`

  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body: formData,
  })

  if (res.status === 401 && retry && getRefreshToken()) {
    const refreshed = await refreshAccessToken()
    if (refreshed) return apiPostForm(path, formData, { retry: false })
    clearTokens()
  }

  return parseResponse(res)
}

/**
 * Deliberately unauthenticated — never attaches an Authorization header,
 * even if the caller happens to have a valid session elsewhere. Used only
 * for the anonymous Help Centre submission, to preserve anonymity end to
 * end rather than relying solely on the backend ignoring identity.
 */
export async function apiPostAnonymous(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return parseResponse(res)
}
