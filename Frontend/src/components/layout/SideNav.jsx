import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Icon from '../ui/Icon'
import NavDrawer from './NavDrawer'
import { useAuth } from '../../context/AuthContext'
import { getDashboardMeta } from '../../config/dashboardNav'

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

export default function SideNav({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { isLoggedIn, user, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const dashboard = isLoggedIn && user?.profileComplete !== false ? getDashboardMeta(user?.role) : null

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
    navigate('/')
  }

  return (
    <div className="min-h-screen">
      <header className="md:hidden sticky top-0 z-40 bg-surface-container-lowest border-b border-outline-variant/30 flex items-center justify-between px-margin-mobile h-16">
        <Link to="/" className="flex items-center gap-1">
          <Icon name="spa" className="text-primary text-xl" filled />
          <span className="font-headline-sm text-headline-sm font-bold text-primary">DERA</span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant"
          aria-label="Open menu"
        >
          <Icon name="menu" />
        </button>
      </header>
      <NavDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex">
        <aside
          className={`hidden md:flex flex-col shrink-0 h-screen sticky top-0 bg-surface-container-lowest border-r border-outline-variant/30 transition-all duration-300 ${
            collapsed ? 'w-20' : 'w-64'
          }`}
        >
          <div className={`flex items-center h-16 px-md ${collapsed ? 'justify-center' : 'justify-between'}`}>
            {!collapsed && (
              <Link to="/" className="flex items-center gap-1">
                <Icon name="spa" className="text-primary text-2xl" filled />
                <span className="font-headline-md text-headline-md font-bold text-primary">DERA</span>
              </Link>
            )}
            <button
              onClick={() => setCollapsed((c) => !c)}
              className="p-2 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant"
              aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
            >
              <Icon name={collapsed ? 'menu' : 'menu_open'} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-sm py-md">
            {sections.map((section) => (
              <div key={section.label} className="mb-lg">
                {!collapsed && (
                  <p className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant/60 mb-sm px-sm">
                    {section.label}
                  </p>
                )}
                <div className="flex flex-col gap-1">
                  {section.links.map((link) => {
                    const active = location.pathname === link.to
                    return (
                      <Link
                        key={link.to}
                        to={link.to}
                        title={collapsed ? link.label : undefined}
                        className={
                          active
                            ? `flex items-center gap-3 px-sm py-3 rounded-xl bg-primary-container text-on-primary-container font-label-md text-label-md ${collapsed ? 'justify-center' : ''}`
                            : `flex items-center gap-3 px-sm py-3 rounded-xl text-on-surface hover:bg-surface-container transition-colors font-label-md text-label-md ${collapsed ? 'justify-center' : ''}`
                        }
                      >
                        <Icon name={link.icon} filled={active} />
                        {!collapsed && link.label}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="px-sm py-md border-t border-outline-variant/30 flex flex-col gap-sm">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                title={collapsed ? 'Log Out' : undefined}
                className="w-full flex items-center justify-center gap-2 border-2 border-outline text-on-surface-variant font-label-md text-label-md py-3 rounded-full hover:bg-surface-container transition-all"
              >
                <Icon name="logout" className="scale-x-[-1]" />
                {!collapsed && 'Log Out'}
              </button>
            ) : (
              <>
                <Link
                  to="/signup"
                  title={collapsed ? 'Sign Up' : undefined}
                  className={`w-full text-center bg-primary text-on-primary font-label-md text-label-md py-3 rounded-full hover:shadow-lg transition-all ${collapsed ? 'px-0' : ''}`}
                >
                  {collapsed ? <Icon name="person_add" /> : 'Sign Up'}
                </Link>
                <Link
                  to="/login"
                  title={collapsed ? 'Log In' : undefined}
                  className="w-full text-center border-2 border-outline text-on-surface-variant font-label-md text-label-md py-3 rounded-full hover:bg-surface-container transition-all"
                >
                  {collapsed ? <Icon name="login" /> : 'Log In'}
                </Link>
              </>
            )}
          </div>
        </aside>

        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  )
}
