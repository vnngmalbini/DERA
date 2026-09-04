import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Icon from '../ui/Icon'
import { useAuth } from '../../context/AuthContext'
import { getDashboardMetaForUser } from '../../config/dashboardNav'

const SECTIONS = [
  {
    label: 'Explore',
    links: [
      { label: 'Home', to: '/', icon: 'home' },
      { label: 'Scholarship Hub', to: '/scholarships', icon: 'school' },
      { label: 'Career Discovery Quiz', to: '/career-quiz', icon: 'psychology' },
      { label: 'Real Stories', to: '/stories', icon: 'auto_stories' },
      { label: 'Forms Marketplace', to: '/forms', icon: 'assignment' },
      { label: 'Sponsorship', to: '/sponsorship', icon: 'volunteer_activism' },
      { label: 'Donate', to: '/donate', icon: 'favorite' },
      { label: 'AI Assistant', to: '/ai-chat', icon: 'chat_bubble' },
      { label: 'Help Centre', to: '/help', icon: 'support_agent' },
    ],
  },
  {
    label: 'Company',
    links: [
      { label: 'About DERA', to: '/about', icon: 'info' },
      { label: 'How It Works', to: '/how-it-works', icon: 'timeline' },
      { label: 'Contact Us', to: '/contact', icon: 'mail' },
    ],
  },
]

export default function NavDrawer({ open, onClose }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { isLoggedIn, user, logout } = useAuth()

  const dashboard = isLoggedIn && user?.profileComplete !== false ? getDashboardMetaForUser(user) : null

  const sections = dashboard
    ? [
        {
          label: 'Explore',
          links: [
            { label: 'My Dashboard', to: dashboard.basePath, icon: 'dashboard' },
            ...SECTIONS[0].links,
          ],
        },
        ...SECTIONS.slice(1),
      ]
    : SECTIONS

  function handleLogout() {
    logout()
    onClose()
    navigate('/')
  }

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  useEffect(() => {
    onClose()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  return (
    <div
      className={`fixed inset-0 z-[60] transition-opacity duration-300 ${
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      aria-hidden={!open}
    >
      <div className="absolute inset-0 bg-on-background/40 backdrop-blur-sm" onClick={onClose} />
      <aside
        className={`absolute top-0 left-0 h-full w-full max-w-sm bg-surface-container-lowest shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-margin-mobile border-b border-outline-variant/30">
          <Link to="/" className="flex items-center gap-1" onClick={onClose}>
            <Icon name="spa" className="text-primary text-2xl" filled />
            <span className="font-headline-md text-headline-md font-bold text-primary tracking-tight">DERA</span>
          </Link>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant"
            aria-label="Close menu"
          >
            <Icon name="close" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-margin-mobile py-md">
          {sections.map((section) => (
            <div key={section.label} className="mb-lg">
              <p className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant/60 mb-sm px-sm">
                {section.label}
              </p>
              <div className="flex flex-col gap-1">
                {section.links.map((link) => {
                  const active = location.pathname === link.to
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={
                        active
                          ? 'flex items-center gap-3 px-sm py-3 rounded-xl bg-primary-container text-on-primary-container font-label-lg text-label-lg'
                          : 'flex items-center gap-3 px-sm py-3 rounded-xl text-on-surface hover:bg-surface-container transition-colors font-label-lg text-label-lg'
                      }
                    >
                      <Icon name={link.icon} filled={active} />
                      {link.label}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="px-margin-mobile py-md border-t border-outline-variant/30 flex flex-col gap-sm">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="w-full text-center border-2 border-outline text-on-surface-variant font-label-md text-label-md py-3 rounded-full hover:bg-surface-container transition-all"
            >
              Log Out
            </button>
          ) : (
            <>
              <Link
                to="/signup"
                className="w-full text-center bg-primary text-on-primary font-label-md text-label-md py-3 rounded-full hover:shadow-lg transition-all"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="w-full text-center border-2 border-outline text-on-surface-variant font-label-md text-label-md py-3 rounded-full hover:bg-surface-container transition-all"
              >
                Log In
              </Link>
            </>
          )}
        </div>
      </aside>
    </div>
  )
}
