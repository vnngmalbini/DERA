import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Icon from '../ui/Icon'
import { useAuth } from '../../context/AuthContext'
import { getDashboardMeta } from '../../config/dashboardNav'

function isActivePath(pathname, item) {
  return item.end ? pathname === item.to : pathname.startsWith(item.to)
}

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

  const navLinks = (onNavigate) =>
    navItems.map((item) => {
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

        <nav className="flex flex-col gap-1 flex-1">{navLinks()}</nav>

        <div className="flex items-center gap-3 px-sm py-3 border-t border-outline-variant/30 pt-md">
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-label-md shrink-0">
            {initialsFor(displayName)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-label-md text-label-md text-on-surface truncate">{displayName}</p>
            <p className="font-label-sm text-label-sm text-on-surface-variant">{label}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Log Out"
            aria-label="Log Out"
            className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container hover:text-error transition-colors shrink-0"
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
