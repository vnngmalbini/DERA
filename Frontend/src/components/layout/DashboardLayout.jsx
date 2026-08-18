import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Icon from '../ui/Icon'
import NotificationBell from './NotificationBell'
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

const COMPANY_LINKS = [
  { label: 'About DERA', to: '/about', icon: 'info' },
  { label: 'How It Works', to: '/how-it-works', icon: 'timeline' },
  { label: 'Contact Us', to: '/contact', icon: 'mail' },
]

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
 * Shared chrome for every role dashboard: sidebar + mobile header, both
 * driven by the same `dashboardNav` config a role's <Route>s are built
 * from, so the sidebar can never drift out of sync with what's routable.
 */
export default function DashboardLayout({ role, children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const meta = getDashboardMeta(role)

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

  const visibleGeneralLinks = GENERAL_LINKS.filter((item) => !item.roles || item.roles.includes(role))

  const navLinks = (onNavigate) => renderLinks(navItems, onNavigate)
  const generalLinks = (onNavigate) => renderLinks(visibleGeneralLinks, onNavigate)
  const companyLinks = (onNavigate) => renderLinks(COMPANY_LINKS, onNavigate)

  return (
    <div className="min-h-screen flex bg-surface-container-low">
      <aside className="hidden md:flex w-64 flex-col fixed top-0 left-0 h-screen bg-surface-container-lowest border-r border-outline-variant/30 px-md py-lg">
        <Link to="/" className="flex items-center gap-2 mb-md px-sm">
          <Icon name="spa" className="text-primary text-2xl" filled />
          <span className="font-headline-md text-headline-md font-bold text-primary">DERA</span>
        </Link>
        <div className="px-sm mb-lg flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-sm text-label-sm">
            <Icon name="dashboard" className="text-[16px]" />
            {label} Dashboard
          </span>
          <NotificationBell />
        </div>

        <nav className="flex flex-col gap-1 flex-1 min-h-0 overflow-y-auto">
          {navLinks()}
          {generalLinks()}
          <p className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant/60 mt-lg mb-sm px-sm">
            Company
          </p>
          {companyLinks()}
        </nav>

        <div className="flex items-center gap-3 px-sm py-3 border-t border-outline-variant/30 pt-md">
          {user.profile_picture ? (
            <img src={user.profile_picture} alt="" loading="lazy" decoding="async" className="w-10 h-10 rounded-full object-cover shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-label-md shrink-0">
              {initialsFor(displayName)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="font-label-md text-label-md text-on-surface truncate">{displayName}</p>
            <p className="font-label-sm text-label-sm text-on-surface-variant">{label}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Log Out"
            aria-label="Log Out"
            className="p-2.5 rounded-full text-on-surface-variant hover:bg-surface-container hover:text-error transition-colors shrink-0"
          >
            <Icon name="logout" className="scale-x-[-1]" />
          </button>
        </div>
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

        {mobileNavOpen && (
          <nav className="md:hidden bg-surface-container-lowest border-b border-outline-variant/30 px-margin-mobile py-sm flex flex-col gap-1">
            {navLinks(() => setMobileNavOpen(false))}
            {generalLinks(() => setMobileNavOpen(false))}
            <p className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant/60 mt-md mb-1 px-sm">
              Company
            </p>
            {companyLinks(() => setMobileNavOpen(false))}
            <button
              onClick={handleLogout}
              className="mt-2 flex items-center gap-3 px-sm py-3 rounded-xl text-error font-label-md text-label-md"
            >
              <Icon name="logout" className="scale-x-[-1]" />
              Log Out
            </button>
          </nav>
        )}

        <main className="flex-1 px-margin-mobile md:px-lg py-lg max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  )
}
