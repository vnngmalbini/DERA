import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import Icon from '../ui/Icon'
import { fetchNotifications, markAllNotificationsRead, markNotificationRead } from '../../services/notificationService'

const POLL_INTERVAL_MS = 60_000
const PANEL_WIDTH = 320
const VIEWPORT_MARGIN = 8

function timeAgo(dateString) {
  const diffMs = Date.now() - new Date(dateString).getTime()
  const minutes = Math.floor(diffMs / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

/**
 * Bell icon + unread badge, polled so a youth sees a "closing soon"
 * scholarship alert without refreshing. The dropdown panel is portaled to
 * `document.body` and positioned from the button's live bounding rect, so
 * it always stays inside the viewport instead of being clipped by a
 * narrow or scrolling ancestor (e.g. the dashboard header it sits in).
 */
export default function NotificationBell() {
  const [notifications, setNotifications] = useState([])
  const [open, setOpen] = useState(false)
  const [panelPos, setPanelPos] = useState(null)
  const buttonRef = useRef(null)
  const panelRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false

    const load = () => {
      fetchNotifications()
        .then((data) => {
          if (!cancelled) setNotifications(data.results ?? data)
        })
        .catch(() => {})
    }

    load()
    const interval = setInterval(load, POLL_INTERVAL_MS)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    function handleClickOutside(e) {
      if (buttonRef.current?.contains(e.target)) return
      if (panelRef.current?.contains(e.target)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Position the portaled panel from the button's actual screen location so
  // it can never be clipped by a narrow/scrolling ancestor (e.g. the
  // sidebar), and re-clamp it to stay inside the viewport on resize/scroll.
  useEffect(() => {
    if (!open) return

    const updatePosition = () => {
      const rect = buttonRef.current?.getBoundingClientRect()
      if (!rect) return
      const left = Math.min(
        Math.max(rect.right - PANEL_WIDTH, VIEWPORT_MARGIN),
        window.innerWidth - PANEL_WIDTH - VIEWPORT_MARGIN,
      )
      setPanelPos({ top: rect.bottom + 8, left })
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [open])

  const unreadCount = notifications.filter((n) => !n.is_read).length

  const handleItemClick = async (n) => {
    setOpen(false)
    if (!n.is_read) {
      setNotifications((prev) => prev.map((item) => (item.id === n.id ? { ...item, is_read: true } : item)))
      markNotificationRead(n.id).catch(() => {})
    }
    if (n.link) navigate(n.link)
  }

  const handleMarkAllRead = (e) => {
    e.stopPropagation()
    setNotifications((prev) => prev.map((item) => ({ ...item, is_read: true })))
    markAllNotificationsRead().catch(() => {})
  }

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        className="relative p-2 rounded-full text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors"
      >
        <Icon name="notifications" />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-error text-on-error text-[10px] leading-4 font-bold text-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && panelPos && createPortal(
        <div
          ref={panelRef}
          style={{ position: 'fixed', top: panelPos.top, left: panelPos.left, width: PANEL_WIDTH }}
          className="max-h-96 overflow-y-auto bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 z-50"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant/30">
            <span className="font-label-lg text-label-lg text-on-surface">Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="font-label-sm text-label-sm text-primary hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>
          {notifications.length === 0 ? (
            <p className="px-4 py-8 text-center font-body-md text-body-md text-on-surface-variant">
              You're all caught up.
            </p>
          ) : (
            <ul className="divide-y divide-outline-variant/20">
              {notifications.map((n) => (
                <li key={n.id}>
                  <button
                    onClick={() => handleItemClick(n)}
                    className={`w-full text-left px-4 py-3 hover:bg-surface-container transition-colors ${
                      n.is_read ? '' : 'bg-primary-container/20'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {!n.is_read && <span className="mt-1.5 w-2 h-2 rounded-full bg-primary shrink-0" />}
                      <div className="min-w-0">
                        <p className="font-label-md text-label-md text-on-surface leading-tight">{n.title}</p>
                        {n.message && (
                          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 line-clamp-2">
                            {n.message}
                          </p>
                        )}
                        <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
                          {timeAgo(n.created_at)}
                        </p>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>,
        document.body,
      )}
    </>
  )
}
