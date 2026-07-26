import { useEffect, useState } from 'react'
import Icon from '../ui/Icon'

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const [justReconnected, setJustReconnected] = useState(false)

  useEffect(() => {
    function handleOffline() {
      setIsOffline(true)
      setJustReconnected(false)
    }
    function handleOnline() {
      setIsOffline(false)
      setJustReconnected(true)
      setTimeout(() => setJustReconnected(false), 3000)
    }
    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)
    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [])

  if (!isOffline && !justReconnected) return null

  return (
    <div
      className={`fixed top-0 inset-x-0 z-[90] flex items-center justify-center gap-2 py-2 px-margin-mobile font-label-md text-label-md text-center ${
        isOffline ? 'bg-error text-on-error' : 'bg-primary text-on-primary'
      }`}
    >
      <Icon name={isOffline ? 'wifi_off' : 'wifi'} className="text-[18px]" />
      {isOffline
        ? "You're offline. Some content may be unavailable until you reconnect."
        : 'Back online.'}
    </div>
  )
}
