import DashboardLayout from '../../components/layout/DashboardLayout'
import DashboardStatCard from '../../components/dashboard/DashboardStatCard'
import QuickActions from '../../components/dashboard/QuickActions'
import ActivityFeed from '../../components/dashboard/ActivityFeed'
import DashboardSkeleton from '../../components/dashboard/DashboardSkeleton'
import { useAuth } from '../../context/AuthContext'
import { useDashboardSummary } from '../../hooks/useDashboardSummary'

export default function DonorOverview() {
  const { user } = useAuth()
  const { summary, loading } = useDashboardSummary('donor')
  const firstName = (user?.fullName || 'there').split(' ')[0]

  return (
    <DashboardLayout role="donor">
      {loading || !summary ? (
        <DashboardSkeleton />
      ) : (
        <>
          <section className="mb-xl">
            <h2 className="font-headline-lg text-headline-lg text-primary mb-2">Welcome back, {firstName}</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Thank you for investing in Ghana&apos;s next generation. Here&apos;s your impact so far.
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
                <h3 className="font-headline-md text-headline-md mb-2">Girls in STEM Fund</h3>
                <p className="font-body-md text-body-md text-on-primary/90">
                  This fund is 68% toward its termly goal of supporting 25 students in science and technology
                  programs.
                </p>
                <div className="w-full bg-white/20 h-2 rounded-full mt-md overflow-hidden">
                  <div className="bg-white h-full rounded-full" style={{ width: '68%' }} />
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </DashboardLayout>
  )
}
