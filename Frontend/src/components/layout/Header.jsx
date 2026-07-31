import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Icon from '../ui/Icon'
import NavDrawer from './NavDrawer'

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Scholarships', to: '/scholarships' },
  { label: 'Career', to: '/career-quiz' },
  { label: 'Stories', to: '/stories' },
  { label: 'Help', to: '/help' },
]

export default function Header() {
  const location = useLocation()
  const [lang, setLang] = useState('EN | Twi')
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-surface dark:bg-background h-16">
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMenuOpen(true)}
              className="material-symbols-outlined text-primary text-2xl cursor-pointer hover:bg-secondary-container/20 p-2 rounded-full transition-colors"
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
          <nav className="hidden lg:flex items-center gap-8">
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
            <button
              className="hidden md:flex items-center bg-secondary-container rounded-full px-3 py-1 gap-2 cursor-pointer hover:opacity-80 transition-all"
              onClick={() => setLang((l) => (l === 'EN | Twi' ? 'Twi | EN' : 'EN | Twi'))}
            >
              <Icon name="language" className="text-sm" />
              <span className="font-label-md text-label-md text-on-secondary-container">{lang}</span>
            </button>
            <button className="material-symbols-outlined text-primary p-2 hover:bg-secondary-container/20 rounded-full transition-colors">
              search
            </button>
            <Link
              to="/login"
              className="hidden md:inline-block font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors px-2"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="bg-primary text-on-primary font-label-md text-label-md px-4 py-2 rounded-full hover:shadow-lg transition-all whitespace-nowrap"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>
      <NavDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
