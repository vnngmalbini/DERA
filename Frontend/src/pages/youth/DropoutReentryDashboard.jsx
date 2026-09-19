import { Link } from 'react-router-dom'
import Icon from '../../components/ui/Icon'
import { useAuth } from '../../context/AuthContext'

const actions = [
  { title: 'Build your re-entry plan', text: 'Choose a realistic route back into school, training, or work.', to: '/dashboard/youth/dropout-re-entry-support', icon: 'event_note' },
  { title: 'Compare learning options', text: 'Explore flexible programmes and practical skills that match your pace.', to: '/dashboard/youth/learning', icon: 'menu_book' },
  { title: 'Talk to a mentor', text: 'Get support to make a confident decision and keep moving forward.', to: '/dashboard/youth/mentorship', icon: 'support_agent' },
]

export default function DropoutReentryDashboard() {
  const { user } = useAuth()
  const firstName = (user?.fullName || 'there').split(' ')[0]

  return (
    <>
      <div className="space-y-6">
        <section className="rounded-2xl bg-gradient-to-br from-secondary-container/20 via-surface-container-lowest to-primary/10 p-5 md:p-8 border border-outline-variant/30">
          <p className="font-label-sm text-label-sm uppercase tracking-wider text-secondary mb-2">Dropout re-entry dashboard</p>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface mb-3">Welcome back, {firstName}</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">A break does not define your future. Use this space to find a practical route back into learning, training, or meaningful work.</p>
        </section>

        <section>
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface">Your re-entry journey</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Start with one step that feels possible today.</p>
            </div>
            <Icon name="school" className="text-secondary text-3xl" filled />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {actions.map((action) => (
              <Link key={action.to} to={action.to} className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 hover:border-secondary hover:shadow-md transition-all">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-container text-on-primary-container mb-4"><Icon name={action.icon} filled /></span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">{action.title}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">{action.text}</p>
                <span className="read-more-link mt-3">Open <Icon name="arrow_forward" className="text-base" /></span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
