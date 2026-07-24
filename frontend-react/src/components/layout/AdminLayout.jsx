import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Icon from '../ui/Icon'

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/admin', icon: 'dashboard' },
  { label: 'Roster', to: '/admin/roster', icon: 'groups' },
  { label: 'Reports', to: '/admin/reports', icon: 'analytics' },
]

export default function AdminLayout({ children }) {
  const location = useLocation()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const isActive = (to) => (to === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(to))

  return (
    <div className="min-h-screen flex bg-surface-container-low">
      <aside className="hidden md:flex w-64 flex-col fixed top-0 left-0 h-screen bg-surface-container-lowest border-r border-outline-variant/30 px-md py-lg">
        <Link to="/" className="flex items-center gap-2 mb-xl px-sm">
          <Icon name="spa" className="text-primary text-2xl" filled />
          <span className="font-headline-md text-headline-md font-bold text-primary">DERA</span>
        </Link>
        <nav className="flex flex-col gap-1 flex-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={
                isActive(item.to)
                  ? 'flex items-center gap-3 px-sm py-3 rounded-xl bg-primary-container text-on-primary-container font-label-md text-label-md'
                  : 'flex items-center gap-3 px-sm py-3 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors font-label-md text-label-md'
              }
            >
              <Icon name={item.icon} filled={isActive(item.to)} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3 px-sm py-3 border-t border-outline-variant/30 pt-md">
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-label-md">
            KM
          </div>
          <div>
            <p className="font-label-md text-label-md text-on-surface">Kwame Mensah</p>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Counselor</p>
          </div>
        </div>
      </aside>

      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <header className="md:hidden sticky top-0 z-40 bg-surface-container-lowest border-b border-outline-variant/30 flex items-center justify-between px-margin-mobile h-16">
          <Link to="/" className="flex items-center gap-2">
            <Icon name="spa" className="text-primary text-xl" filled />
            <span className="font-headline-sm text-headline-sm font-bold text-primary">DERA</span>
          </Link>
          <button
            className="p-2 rounded-full hover:bg-surface-container transition-colors"
            onClick={() => setMobileNavOpen((v) => !v)}
          >
            <Icon name={mobileNavOpen ? 'close' : 'menu'} className="text-primary" />
          </button>
        </header>

        {mobileNavOpen && (
          <nav className="md:hidden bg-surface-container-lowest border-b border-outline-variant/30 px-margin-mobile py-sm flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileNavOpen(false)}
                className={
                  isActive(item.to)
                    ? 'flex items-center gap-3 px-sm py-3 rounded-xl bg-primary-container text-on-primary-container font-label-md text-label-md'
                    : 'flex items-center gap-3 px-sm py-3 rounded-xl text-on-surface-variant font-label-md text-label-md'
                }
              >
                <Icon name={item.icon} filled={isActive(item.to)} />
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        <main className="flex-1 px-margin-mobile md:px-lg py-lg max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  )
}
