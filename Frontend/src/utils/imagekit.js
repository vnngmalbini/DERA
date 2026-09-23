const IMAGEKIT_URL_ENDPOINT = (import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT || '').replace(/\/+$/, '')
const BACKEND_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api').replace(/\/api\/?$/, '')

// Builds an ImageKit URL for a media path, e.g. imagekitUrl('stories/photo.jpeg', 'w-800,q-80').
// Falls back to the backend's /media/ folder when no ImageKit endpoint is configured.
export function imagekitUrl(path, transformation) {
  const cleanPath = path.replace(/^\/+/, '')
  if (!IMAGEKIT_URL_ENDPOINT) return `${BACKEND_BASE_URL}/media/${cleanPath}`
  const query = transformation ? `?tr=${transformation}` : ''
  return `${IMAGEKIT_URL_ENDPOINT}/${cleanPath}${query}`
}
