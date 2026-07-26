import { Link } from 'react-router-dom'
import Icon from '../ui/Icon'

export default function QuickActions({ actions }) {
  return (
    <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant/30 shadow-sm">
      <h3 className="font-headline-md text-headline-md text-on-surface mb-md">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {actions.map((action) => (
          <Link
            key={action.to}
            to={action.to}
            className="group flex flex-col items-start gap-3 p-md rounded-xl border border-outline-variant bg-surface hover:border-secondary hover:bg-secondary-container/30 transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
              <Icon name={action.icon} />
            </div>
            <span className="font-label-md text-label-md text-on-surface">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
