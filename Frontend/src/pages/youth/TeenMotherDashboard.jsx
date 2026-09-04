import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Icon from '../../components/ui/Icon'
import { useAuth } from '../../context/AuthContext'

const actions = [
  { title: 'View support services', text: 'Find wellbeing, childcare, and community support for your next step.', to: '/dashboard/youth/teen-mother-support', icon: 'volunteer_activism' },
  { title: 'Explore flexible learning', text: 'Discover learning options that can fit around your responsibilities.', to: '/dashboard/youth/learning', icon: 'school' },
  { title: 'Meet a mentor', text: 'Get encouragement and practical guidance from someone who understands your goals.', to: '/dashboard/youth/mentorship', icon: 'diversity_3' },
]

export default function TeenMotherDashboard() {
  const { user } = useAuth()
  const firstName = (user?.fullName || 'there').split(' ')[0]

  return (
    <DashboardLayout role="youth">
      <div className="space-y-6">
        <section className="rounded-2xl bg-gradient-to-br from-primary/10 via-secondary-container/20 to-surface-container-lowest p-5 md:p-8 border border-outline-variant/30">
          <p className="font-label-sm text-label-sm uppercase tracking-wider text-primary mb-2">Teen mother dashboard</p>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface mb-3">Welcome, {firstName}</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">Your goals still matter. Use this space to plan your education, wellbeing, support, and career one step at a time.</p>
        </section>

        <section>
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface">Your next steps</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Choose the kind of help you need today.</p>
            </div>
            <Icon name="pregnant_woman" className="text-primary text-3xl" filled />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {actions.map((action) => (
              <Link key={action.to} to={action.to} className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 hover:border-primary hover:shadow-md transition-all">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary-container text-on-secondary-container mb-4"><Icon name={action.icon} filled /></span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">{action.title}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">{action.text}</p>
                <span className="read-more-link mt-3">Open <Icon name="arrow_forward" className="text-base" /></span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}
