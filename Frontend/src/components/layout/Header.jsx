import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Icon from '../ui/Icon'
import NavDrawer from './NavDrawer'
import { useAuth } from '../../context/AuthContext'
import { getDashboardMetaForUser } from '../../config/dashboardNav'

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Scholarships', to: '/scholarships' },
  { label: 'Career', to: '/career-quiz' },
  { label: 'Stories', to: '/stories' },
  { label: 'Donate', to: '/donate' },
  { label: 'Help', to: '/help' },
  { label: 'About', to: '/about' },
  { label: 'How It Works', to: '/how-it-works' },
  { label: 'Contact Us', to: '/contact' },
]

export default function Header() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const { isLoggedIn, user } = useAuth()
  const dashboard = isLoggedIn && user?.profileComplete !== false ? getDashboardMetaForUser(user) : null

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-surface dark:bg-background h-16">
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden material-symbols-outlined text-primary text-2xl cursor-pointer hover:bg-secondary-container/20 p-2.5 rounded-full transition-colors"
              aria-label="Open menu"
            >
              menu
            </button>
            <Link to="/" className="flex items-center gap-1">
              <Icon name="spa" className="text-primary text-2xl" filled />
              <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg font-bold text-primary dark:text-primary-fixed tracking-tight">
                DERA
              </h1>
            </Link>
          </div>
          <nav className="hidden lg:flex items-center gap-8 ml-10">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={
                  location.pathname === link.to
                    ? 'text-primary dark:text-primary-fixed font-bold font-label-md text-label-md'
                    : 'text-on-surface-variant dark:text-on-surface-variant font-label-md text-label-md hover:text-primary transition-colors'
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 md:gap-3">
            <Link
              to="/search"
              aria-label="Search"
              className="material-symbols-outlined text-primary p-2.5 hover:bg-secondary-container/20 rounded-full transition-colors"
            >
              search
            </Link>
            {dashboard ? (
              <Link
                to={dashboard.basePath}
                className="bg-primary text-on-primary font-label-md text-label-md px-5 py-2.5 rounded-full hover:shadow-lg transition-all whitespace-nowrap flex items-center gap-1.5"
              >
                <Icon name="dashboard" className="text-[18px]" />
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden md:inline-block font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors px-2"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="bg-primary text-on-primary font-label-md text-label-md px-5 py-2.5 rounded-full hover:shadow-lg transition-all whitespace-nowrap"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      <NavDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
