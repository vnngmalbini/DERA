import DashboardLayout from '../../components/layout/DashboardLayout'
import DashboardStatCard from '../../components/dashboard/DashboardStatCard'
import QuickActions from '../../components/dashboard/QuickActions'
import ActivityFeed from '../../components/dashboard/ActivityFeed'
import DashboardSkeleton from '../../components/dashboard/DashboardSkeleton'
import { useAuth } from '../../context/AuthContext'
import { useDashboardSummary } from '../../hooks/useDashboardSummary'

export default function AdminOverview() {
  const { user } = useAuth()
  const { summary, loading } = useDashboardSummary('admin')
  const firstName = (user?.fullName || 'Admin').split(' ')[0]

  return (
    <DashboardLayout role="admin">
      {loading || !summary ? (
        <DashboardSkeleton />
      ) : (
        <>
          <section className="mb-xl">
            <h2 className="font-headline-lg text-headline-lg text-primary mb-2">Welcome back, {firstName}</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Platform-wide snapshot across users, institutions, and activity.
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
                <h3 className="font-headline-md text-headline-md mb-2">Platform Health</h3>
                <p className="font-body-md text-body-md text-on-primary/90">
                  All systems operational. Manage users, institutions, and content from the sidebar.
                </p>
              </div>
            </div>
          </section>
        </>
      )}
    </DashboardLayout>
  )
}
