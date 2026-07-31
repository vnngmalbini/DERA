import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import DashboardStatCard from '../../components/dashboard/DashboardStatCard'
import QuickActions from '../../components/dashboard/QuickActions'
import ActivityFeed from '../../components/dashboard/ActivityFeed'
import DashboardSkeleton from '../../components/dashboard/DashboardSkeleton'
import { useAuth } from '../../context/AuthContext'
import { useDashboardSummary } from '../../hooks/useDashboardSummary'

export default function YouthOverview() {
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
