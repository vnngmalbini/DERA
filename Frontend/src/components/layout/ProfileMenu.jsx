import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import Icon from '../ui/Icon'

const PANEL_WIDTH = 224
const VIEWPORT_MARGIN = 8

function initialsFor(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

/**
 * Account menu, collapsed into a single dropdown trigger: Profile and
 * Settings used to be permanent items in the main nav list, and Log Out a
 * separate icon button next to the name — three things fighting for space
 * that only ever apply to "my account". Panel is portaled and positioned
 * from the trigger's live bounding rect so it can't be clipped the way the
 * old notification dropdown was.
 *
 * `variant="navbar"` (default) is the compact pill used in the top header —
 * panel opens downward below it. `variant="sidebar"` is the full-width block
 * row used in the mobile nav's stacked menu — panel opens upward, since
 * that trigger sits at the bottom of the list.
 */
export default function ProfileMenu({
  displayName,
  roleLabel,
  profilePicture,
  profilePath,
  settingsPath,
  onLogout,
  onNavigate,
  variant = 'navbar',
}) {
  const [open, setOpen] = useState(false)
  const [panelPos, setPanelPos] = useState(null)
  const buttonRef = useRef(null)
  const panelRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (buttonRef.current?.contains(e.target)) return
      if (panelRef.current?.contains(e.target)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!open) return

    const updatePosition = () => {
      const rect = buttonRef.current?.getBoundingClientRect()
      if (!rect) return
      // Sidebar trigger is a wide block row: align the panel to its left
      // edge. Navbar trigger is a small pill: align to its right edge so
      // the panel doesn't hang out past the header on the right.
      const rawLeft = variant === 'sidebar' ? rect.left : rect.right - PANEL_WIDTH
      const left = Math.min(Math.max(rawLeft, VIEWPORT_MARGIN), window.innerWidth - PANEL_WIDTH - VIEWPORT_MARGIN)
      setPanelPos(
        variant === 'sidebar'
          ? { bottom: window.innerHeight - rect.top + 8, left }
          : { top: rect.bottom + 8, left },
      )
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [open, variant])

  const close = () => setOpen(false)

  const handleItemClick = () => {
    close()
    onNavigate?.()
  }

  const handleLogoutClick = () => {
    close()
    onNavigate?.()
    onLogout()
  }

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={
          variant === 'sidebar'
            ? 'w-full flex items-center gap-3 px-sm py-3 rounded-xl hover:bg-surface-container transition-colors text-left'
            : 'flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-surface-container transition-colors text-left'
        }
      >
        {profilePicture ? (
          <img
            src={profilePicture}
            alt=""
            loading="lazy"
            decoding="async"
            className={`${variant === 'sidebar' ? 'w-10 h-10' : 'w-8 h-8'} rounded-full object-cover shrink-0`}
          />
        ) : (
          <div
            className={`${variant === 'sidebar' ? 'w-10 h-10' : 'w-8 h-8 text-label-sm'} rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-label-md shrink-0`}
          >
            {initialsFor(displayName)}
          </div>
        )}
        <div className={`min-w-0 ${variant === 'sidebar' ? 'flex-1' : 'hidden sm:block'}`}>
          <p className="font-label-md text-label-md text-on-surface truncate">{displayName}</p>
          <p className="font-label-sm text-label-sm text-on-surface-variant">{roleLabel}</p>
        </div>
      </button>

      {open && panelPos && createPortal(
        <div
          ref={panelRef}
          style={{
            position: 'fixed',
            ...(variant === 'sidebar' ? { bottom: panelPos.bottom } : { top: panelPos.top }),
            left: panelPos.left,
            width: PANEL_WIDTH,
          }}
          className="py-1 bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 z-50"
        >
          <Link
            to={profilePath}
            onClick={handleItemClick}
            className="flex items-center gap-3 px-4 py-2.5 text-on-surface hover:bg-surface-container transition-colors font-label-md text-label-md"
          >
            <Icon name="person" />
            Profile
          </Link>
          <Link
            to={settingsPath}
            onClick={handleItemClick}
            className="flex items-center gap-3 px-4 py-2.5 text-on-surface hover:bg-surface-container transition-colors font-label-md text-label-md"
          >
            <Icon name="settings" />
            Settings
          </Link>
          <div className="my-1 border-t border-outline-variant/30" />
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-error hover:bg-surface-container transition-colors font-label-md text-label-md text-left"
          >
            <Icon name="logout" className="scale-x-[-1]" />
            Log Out
          </button>
        </div>,
        document.body,
      )}
    </>
  )
}
