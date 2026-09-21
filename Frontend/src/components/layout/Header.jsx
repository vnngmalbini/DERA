import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Icon from '../ui/Icon'
import NavDrawer from './NavDrawer'
import { useAuth } from '../../context/AuthContext'
import { getDashboardMetaForUser } from '../../config/dashboardNav'

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  {
    label: 'Scholarships',
    to: '/scholarships',
    children: [
      { label: 'Scholarship Hub', to: '/scholarships', icon: 'school' },
      { label: 'Forms Marketplace', to: '/forms', icon: 'assignment' },
      { label: 'Sponsorship', to: '/sponsorship', icon: 'volunteer_activism' },
    ],
  },
  {
    label: 'Career',
    to: '/career-quiz',
    children: [
      { label: 'Career Discovery Quiz', to: '/career-quiz', icon: 'psychology' },
      { label: 'AI Career Counsellor', to: '/ai-chat', icon: 'chat_bubble' },
      { label: 'AI Growth Librarian', to: '/growth-librarian', icon: 'auto_stories' },
    ],
  },
  { label: 'Stories', to: '/stories' },
  { label: 'Donate', to: '/donate' },
  {
    label: 'About',
    to: '/about',
    children: [
      { label: 'About DERA', to: '/about', icon: 'info' },
      { label: 'How It Works', to: '/how-it-works', icon: 'timeline' },
      { label: 'Help Centre', to: '/help', icon: 'support_agent' },
      { label: 'Contact Us', to: '/contact', icon: 'mail' },
    ],
  },
]

const linkClass = (active) =>
  active
    ? 'text-primary dark:text-primary-fixed font-bold font-label-md text-label-md'
    : 'text-on-surface-variant dark:text-on-surface-variant font-label-md text-label-md hover:text-primary transition-colors'

function NavDropdown({ link, active }) {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef(null)
  const closeTimer = useRef(null)

  // Hover opens instantly; a short close delay keeps the menu usable while the
  // pointer travels from the trigger down into the panel.
  function scheduleClose() {
    clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpen(false), 120)
  }

  function cancelClose() {
    clearTimeout(closeTimer.current)
    setOpen(true)
  }

  // On hover devices the panel is already open by the time the label is
  // clicked, so the click just follows the link. Without hover (touch), the
  // first tap opens the panel and only the second one navigates.
  function handleTriggerClick(e) {
    if (!open) {
      e.preventDefault()
      setOpen(true)
    }
  }

  useEffect(() => () => clearTimeout(closeTimer.current), [])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e) => e.key === 'Escape' && setOpen(false)
    const onPointerDown = (e) => {
      if (!wrapperRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open])

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onMouseEnter={cancelClose}
      onMouseLeave={scheduleClose}
      onFocus={cancelClose}
      onBlur={(e) => {
        if (!wrapperRef.current?.contains(e.relatedTarget)) setOpen(false)
      }}
    >
      <Link
        to={link.to}
        onClick={handleTriggerClick}
        aria-expanded={open}
        aria-haspopup="true"
        className={`${linkClass(active)} flex items-center gap-0.5 whitespace-nowrap`}
      >
        {link.label}
        <Icon
          name="expand_more"
          className={`text-[18px] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </Link>
      <div
        className={`absolute left-1/2 -translate-x-1/2 top-full pt-3 w-64 transition-all duration-150 ${
          open ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-1'
        }`}
      >
        <div className="bg-surface-container-lowest dark:bg-surface-container rounded-2xl shadow-2xl border border-outline-variant/30 p-2 flex flex-col gap-0.5">
          {link.children.map((child) => (
            <Link
              key={child.to}
              to={child.to}
              tabIndex={open ? 0 : -1}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors font-label-md text-label-md whitespace-nowrap ${
                location.pathname === child.to
                  ? 'bg-primary-container text-on-primary-container'
                  : 'text-on-surface hover:bg-surface-container hover:text-primary'
              }`}
            >
              <Icon name={child.icon} className="text-[20px] text-primary" />
              {child.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Header() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const { isLoggedIn, user } = useAuth()
  const dashboard = isLoggedIn && user?.profileComplete !== false ? getDashboardMetaForUser(user) : null

  const isActive = (link) =>
    link.children
      ? link.children.some((child) => child.to === location.pathname)
      : location.pathname === link.to

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-surface/95 dark:bg-background/95 backdrop-blur-md border-b border-outline-variant/20 h-16 pt-safe">
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden material-symbols-outlined text-primary text-2xl cursor-pointer hover:bg-secondary-container/20 p-2.5 -ml-2 rounded-full transition-colors"
              aria-label="Open menu"
            >
              menu
            </button>
            <Link to="/" className="flex items-center gap-1">
              <Icon name="spa" className="text-primary text-2xl" filled />
              <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg font-bold text-primary dark:text-primary-fixed tracking-tight truncate">
                DERA
              </h1>
            </Link>
          </div>
          <nav className="hidden lg:flex items-center gap-8 ml-10">
            {NAV_LINKS.map((link) =>
              link.children ? (
                <NavDropdown key={link.label} link={link} active={isActive(link)} />
              ) : (
                <Link key={link.to} to={link.to} className={linkClass(isActive(link))}>
                  {link.label}
                </Link>
              )
            )}
          </nav>
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3 shrink-0">
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
                className="bg-primary text-on-primary font-label-md text-label-md px-3 sm:px-5 py-2.5 rounded-full hover:shadow-lg transition-all whitespace-nowrap flex items-center gap-1.5"
              >
                <Icon name="dashboard" className="text-[18px]" />
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden md:inline-block font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors px-2 whitespace-nowrap"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="mobile-signup bg-primary text-on-primary font-label-md text-label-md px-3 sm:px-5 py-2.5 rounded-full hover:shadow-lg transition-all whitespace-nowrap"
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
