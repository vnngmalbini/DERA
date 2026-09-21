import { Link, useLocation } from 'react-router-dom'
import Icon from '../ui/Icon'

const NAV_ITEMS = [
  { label: 'Home', to: '/', icon: 'home' },
  { label: 'Grants', to: '/scholarships', icon: 'school' },
  { label: 'Career', to: '/career-quiz', icon: 'work' },
  { label: 'Help', to: '/help', icon: 'support_agent' },
]

export default function MobileBottomNav() {
  const location = useLocation()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-surface-container-lowest/95 backdrop-blur-md flex justify-around items-center gap-1 px-3 pt-2.5 pb-safe rounded-t-2xl border-t border-outline-variant/30 shadow-[0_-8px_24px_rgba(43,22,17,0.08)]">
      {NAV_ITEMS.map((item) => {
        const active = location.pathname === item.to
        return (
          <Link
            key={item.to}
            to={item.to}
            className={
              active
                ? 'flex min-w-0 flex-1 flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-xl px-2 py-1.5 transition-transform active:scale-90 duration-150'
                : 'flex min-w-0 flex-1 flex-col items-center justify-center text-on-surface-variant hover:text-primary py-1.5 transition-all'
            }
          >
            <Icon name={item.icon} filled={active} />
            <span className="font-label-sm text-label-sm">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
