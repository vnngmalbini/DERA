import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Icon from '../ui/Icon'
import { useAuth } from '../../context/AuthContext'
import { getDashboardMetaForUser } from '../../config/dashboardNav'

const QUICK_ACTIONS = [
  { label: 'Find scholarships', to: '/scholarships', icon: 'school' },
  { label: 'Career quiz', to: '/career-quiz', icon: 'psychology' },
  { label: 'Forms marketplace', to: '/forms', icon: 'assignment' },
  { label: 'Get support', to: '/help', icon: 'support_agent' },
  { label: 'My dashboard', to: '/dashboard/youth', icon: 'dashboard' },
  { label: 'Sponsorship', to: '/sponsorship', icon: 'volunteer_activism' },
]

export default function GlobalAssistant() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { isLoggedIn, user } = useAuth()
  const dashboardPath = getDashboardMetaForUser(user)?.basePath || '/dashboard/youth'

  const contextText = useMemo(() => {
    const name = user?.fullName?.split(' ')[0] || 'friend'
    if (location.pathname.startsWith('/dashboard')) return `Hi ${name}, I can help you move through your dashboard and find what you need.`
    if (location.pathname === '/forms') return `You’re on the forms marketplace. I can help you choose a form or learn about eligibility.`
    if (location.pathname === '/sponsorship') return `You’re on sponsorship. I can explain who can apply and what to do next.`
    if (location.pathname === '/scholarships') return `You’re checking scholarships. I can help you narrow the options that fit you best.`
    return `Need help on this page? I can guide you to the next step quickly.`
  }, [location.pathname, user?.fullName])

  const visibleActions = QUICK_ACTIONS.map((action) =>
    action.to === '/dashboard/youth' ? { ...action, to: dashboardPath } : action,
  ).filter((action) => action.to !== dashboardPath || isLoggedIn)

  return (
    <div className="fixed bottom-20 right-4 z-[70] sm:bottom-6 sm:right-6">
      {open && (
        <div className="mb-3 w-[min(92vw,22rem)] rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between gap-3 bg-primary-container px-4 py-3 text-on-primary-container">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                <Icon name="smart_toy" filled className="text-lg" />
              </div>
              <div>
                <p className="font-label-md text-label-md">DERA Guide</p>
                <p className="font-label-sm text-label-sm text-on-primary-container/80">Always here to help</p>
              </div>
            </div>
            <button
              type="button"
              aria-label="Close assistant"
              onClick={() => setOpen(false)}
              className="rounded-full p-1.5 hover:bg-white/10 transition-colors"
            >
              <Icon name="close" />
            </button>
          </div>

          <div className="space-y-3 p-4">
            <p className="font-body-md text-body-md text-on-surface">{contextText}</p>

            <div className="grid grid-cols-1 gap-2">
              {visibleActions.map((action) => (
                <button
                  key={action.to}
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    navigate(action.to)
                  }}
                  className="flex items-center justify-between gap-3 rounded-xl border border-outline-variant bg-surface-container px-3 py-2 text-left transition-colors hover:bg-secondary-container/20"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
                      <Icon name={action.icon} className="text-base" />
                    </span>
                    <span className="font-label-md text-label-md text-on-surface truncate">{action.label}</span>
                  </div>
                  <Icon name="arrow_forward" className="text-base" />
                </button>
              ))}
            </div>

            <div className="rounded-xl bg-secondary-container/20 p-3">
              <p className="font-label-md text-label-md text-on-surface">Need a quick start?</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Try: “I want a scholarship”, “I am unsure what to do next”, or “Help me find forms.”
              </p>
            </div>

            <Link
              to={isLoggedIn ? dashboardPath : '/signup'}
              onClick={() => setOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-on-primary font-label-md text-label-md shadow-sm"
            >
              {isLoggedIn ? 'Open my dashboard' : 'Create an account'}
              <Icon name="arrow_forward" />
            </Link>
          </div>
        </div>
      )}

      <button
        type="button"
        aria-label="Open website assistant"
        onClick={() => setOpen((value) => !value)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-xl transition-transform active:scale-95 hover:scale-[1.02]"
      >
        <Icon name="smart_toy" filled className="text-2xl" />
      </button>
    </div>
  )
}
