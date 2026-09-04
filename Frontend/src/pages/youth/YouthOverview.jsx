import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import DashboardStatCard from '../../components/dashboard/DashboardStatCard'
import QuickActions from '../../components/dashboard/QuickActions'
import ActivityFeed from '../../components/dashboard/ActivityFeed'
import DashboardSkeleton from '../../components/dashboard/DashboardSkeleton'
import Icon from '../../components/ui/Icon'
import { useAuth } from '../../context/AuthContext'
import { useDashboardSummary } from '../../hooks/useDashboardSummary'
import TeenMotherDashboard from './TeenMotherDashboard'
import DropoutReentryDashboard from './DropoutReentryDashboard'

const SESSION_TYPE_LABELS = {
  academic_checkin: 'Academic Check-in',
  home_visit: 'Home Visit',
  mentorship_pairing: 'Mentorship Pairing',
  crisis_support: 'Crisis Support',
  other: 'Session',
}

function formatSessionTime(iso) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function YouthOverview() {
  const { user } = useAuth()

  if (user?.educationLevel === 'teen_mother_program') return <TeenMotherDashboard />
  if (user?.educationLevel === 'dropout_re_entry') return <DropoutReentryDashboard />

  return <StandardYouthOverview />
}

function StandardYouthOverview() {
  const { user } = useAuth()
  const { summary, loading } = useDashboardSummary('youth')
  const firstName = (user?.fullName || 'there').split(' ')[0]

  return (
    <DashboardLayout role="youth">
      {loading || !summary ? (
        <DashboardSkeleton />
      ) : (
        <>
          <section className="mb-xl">
            <h2 className="font-headline-lg text-headline-lg text-primary mb-2">Akwaaba, {firstName}</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Here&apos;s what&apos;s happening with your journey today.
            </p>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-xl">
            {summary.stats.map((stat) => (
              <DashboardStatCard key={stat.label} {...stat} />
            ))}
          </section>

          <section className="mb-xl">
            <QuickActions actions={summary.quickActions} />
          </section>

          {summary.upcomingSessions?.length > 0 && (
            <section className="mb-xl">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Upcoming Sessions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {summary.upcomingSessions.map((session) => (
                  <div
                    key={session.id}
                    className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant/40 shadow-sm flex items-start gap-3"
                  >
                    <div className="w-11 h-11 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container shrink-0">
                      <Icon name="event_available" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-label-md text-label-md text-on-surface">
                        {SESSION_TYPE_LABELS[session.session_type] || session.session_type_display}
                      </p>
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        {formatSessionTime(session.scheduled_at)}
                      </p>
                      {session.counselor_name && (
                        <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
                          With {session.counselor_name}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ActivityFeed items={summary.activity} title="Recent Activity" />
            <div className="bg-primary text-on-primary p-md rounded-xl shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-headline-md text-headline-md mb-2">Career Discovery Quiz</h3>
                <p className="font-body-md text-body-md text-on-primary/90">
                  Not sure what path fits you? Take the quiz to get personalized scholarship and career
                  recommendations.
                </p>
              </div>
              <Link
                to="/career-quiz"
                className="mt-lg inline-flex items-center justify-center gap-2 bg-white text-primary font-label-lg text-label-lg py-3 rounded-full hover:bg-primary-container transition-colors w-fit px-6"
              >
                Take the Quiz
              </Link>
            </div>
          </section>
        </>
      )}
    </DashboardLayout>
  )
}
