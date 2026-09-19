import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Icon from '../ui/Icon'
import NotificationBell from './NotificationBell'
import ProfileMenu from './ProfileMenu'
import GlobalAssistant from './GlobalAssistant'
import { useAuth } from '../../context/AuthContext'
import { getDashboardMeta } from '../../config/dashboardNav'

function isActivePath(pathname, item) {
  return item.end ? pathname === item.to : pathname.startsWith(item.to)
}

// Shared across every role — these public pages aren't part of any role's
// dashboard workflow, but still need to be reachable from the one sidebar
// logged-in users see everywhere (see PageLayout.jsx).
const GENERAL_LINKS = [
  { label: 'Real Stories', to: '/stories', icon: 'auto_stories' },
  { label: 'Help Centre', to: '/help', icon: 'support_agent', roles: ['youth'] },
]

/**
 * Shared chrome for every role dashboard: sidebar + mobile header, both
 * driven by the same `dashboardNav` config a role's <Route>s are built
 * from, so the sidebar can never drift out of sync with what's routable.
 */
export default function DashboardLayout({ role, children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const meta = getDashboardMeta(role, user?.educationLevel)

  if (!user || !meta) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-container-low">
        <div className="flex items-center gap-3 text-on-surface-variant">
          <Icon name="progress_activity" className="animate-spin" />
          <span className="font-body-md text-body-md">Loading your dashboard...</span>
        </div>
      </div>
    )
  }

  const { label, navItems } = meta
  const displayName = user.fullName || user.name || 'there'

  // Profile and Settings live in ProfileMenu now, not as permanent items
  // competing for space in the main nav list.
  const primaryNavItems = navItems.filter((item) => item.key !== 'profile' && item.key !== 'settings')
  const profilePath = navItems.find((item) => item.key === 'profile')?.to ?? `${meta.basePath}/profile`
  const settingsPath = navItems.find((item) => item.key === 'settings')?.to ?? `${meta.basePath}/settings`

  function handleLogout() {
    logout()
    navigate('/')
  }

  const renderLinks = (items, onNavigate) =>
    items.map((item) => {
      const active = isActivePath(location.pathname, item)
      return (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          className={
            active
              ? 'flex items-center gap-3 px-sm py-3 rounded-xl bg-primary-container text-on-primary-container font-label-md text-label-md'
              : 'flex items-center gap-3 px-sm py-3 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors font-label-md text-label-md'
          }
        >
          <Icon name={item.icon} filled={active} />
          {item.label}
        </Link>
      )
    })

  const isSpecialYouthPathway =
    role === 'youth' && ['teen_mother_program', 'dropout_re_entry'].includes(user?.educationLevel)
  const visibleGeneralLinks = isSpecialYouthPathway
    ? []
    : GENERAL_LINKS.filter(
        (item) =>
          (!item.roles || item.roles.includes(role)) &&
          !navItems.some((navItem) => navItem.to === item.to),
      )

  const navLinks = (onNavigate) => renderLinks(primaryNavItems, onNavigate)
  const generalLinks = (onNavigate) => renderLinks(visibleGeneralLinks, onNavigate)

  return (
    <div className="min-h-screen flex bg-surface-container-low">
      <aside className="hidden md:flex w-64 flex-col fixed top-0 left-0 h-screen bg-surface-container-lowest border-r border-outline-variant/30 px-md py-lg">
        <Link to="/" className="flex items-center gap-2 mb-md px-sm">
          <Icon name="spa" className="text-primary text-2xl" filled />
          <span className="font-headline-md text-headline-md font-bold text-primary">DERA</span>
        </Link>
        <div className="px-sm mb-lg">
          <span className="inline-flex items-center gap-1.5 bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-sm text-label-sm">
            <Icon name="dashboard" className="text-[16px]" />
            {label} Dashboard
          </span>
        </div>

        <nav className="flex flex-col gap-1 flex-1 min-h-0 overflow-y-auto">
          {navLinks()}
          {generalLinks()}
        </nav>
      </aside>

      <div className="flex-1 md:ml-64 flex flex-col min-h-screen min-w-0">
        <header className="md:hidden sticky top-0 z-40 bg-surface-container-lowest border-b border-outline-variant/30 flex items-center justify-between px-margin-mobile h-16">
          <Link to="/" className="flex items-center gap-2">
            <Icon name="spa" className="text-primary text-xl" filled />
            <span className="font-headline-sm text-headline-sm font-bold text-primary">DERA</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-label-sm text-label-sm text-on-surface-variant hidden sm:inline">{label}</span>
            <NotificationBell />
            <button
              className="p-2 rounded-full hover:bg-surface-container transition-colors"
              onClick={() => setMobileNavOpen((v) => !v)}
              aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
            >
              <Icon name={mobileNavOpen ? 'close' : 'menu'} className="text-primary" />
            </button>
          </div>
        </header>

        <header className="hidden md:flex sticky top-0 z-30 bg-surface-container-lowest border-b border-outline-variant/30 items-center justify-end gap-2 px-lg h-16">
          <NotificationBell />
          <ProfileMenu
            displayName={displayName}
            roleLabel={label}
            profilePicture={user.profile_picture}
            profilePath={profilePath}
            settingsPath={settingsPath}
            onLogout={handleLogout}
          />
        </header>

        {mobileNavOpen && (
          <nav className="md:hidden bg-surface-container-lowest border-b border-outline-variant/30 px-margin-mobile py-sm flex flex-col gap-1">
            {navLinks(() => setMobileNavOpen(false))}
            {generalLinks(() => setMobileNavOpen(false))}
            <div className="mt-2 pt-2 border-t border-outline-variant/30">
              <ProfileMenu
                variant="sidebar"
                displayName={displayName}
                roleLabel={label}
                profilePicture={user.profile_picture}
                profilePath={profilePath}
                settingsPath={settingsPath}
                onLogout={handleLogout}
                onNavigate={() => setMobileNavOpen(false)}
              />
            </div>
          </nav>
        )}

        <main className="flex-1 px-margin-mobile md:px-lg py-lg max-w-7xl w-full mx-auto">{children}</main>
        <GlobalAssistant />
      </div>
    </div>
  )
}
