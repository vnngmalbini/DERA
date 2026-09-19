import { useState } from 'react'

/**
 * An <img> that falls back to a placeholder if the URL 404s or otherwise
 * fails to load, instead of leaving a broken-image icon (or, in browsers
 * that ORB-block the failed cross-origin request, the raw alt text)
 * sitting in the layout. A truthy `src` at render time only means a URL
 * was stored — it doesn't guarantee the file is still there.
 */
export default function SafeImage({ src, alt = '', fallback, className = '', ...props }) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) return fallback ?? null

  return (
    <img src={src} alt={alt} className={className} onError={() => setFailed(true)} {...props} />
  )
}
