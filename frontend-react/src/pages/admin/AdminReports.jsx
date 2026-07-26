import DashboardLayout from '../../components/layout/DashboardLayout'
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader'
import Icon from '../../components/ui/Icon'

// TODO(backend): replace with a real fetch, e.g. GET /api/admin/reports/summary/
const GROWTH = [
  { label: 'Feb', users: 40 },
  { label: 'Mar', users: 55 },
  { label: 'Apr', users: 65 },
  { label: 'May', users: 80 },
  { label: 'Jun', users: 92 },
  { label: 'Jul', users: 100 },
]

const BREAKDOWN = [
  { label: 'Youth', value: 3120, bar: 'bg-primary' },
  { label: 'Counselors', value: 240, bar: 'bg-tertiary' },
  { label: 'Donors', value: 460, bar: 'bg-secondary' },
  { label: 'Admins', value: 22, bar: 'bg-error' },
]

const maxUsers = Math.max(...GROWTH.map((g) => g.users))
const maxBreakdown = Math.max(...BREAKDOWN.map((b) => b.value))

export default function AdminReports() {
  return (
    <DashboardLayout role="admin">
      <DashboardPageHeader
        title="Reports & Analytics"
        description="Platform-wide growth and usage trends."
        action={
          <button className="bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded-full flex items-center gap-2 hover:shadow-lg active:scale-95 transition-all w-fit">
            <Icon name="download" />
            Export Report
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-md shadow-sm">
          <h3 className="font-headline-md text-headline-md text-on-surface mb-md">User Growth (New Signups)</h3>
          <div className="h-56 flex items-end justify-between gap-3 px-2">
            {GROWTH.map((g) => (
              <div key={g.label} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div
                  className="w-full bg-primary rounded-t-md transition-all hover:brightness-110"
                  style={{ height: `${(g.users / maxUsers) * 100}%` }}
                  title={`${g.users} new users`}
                />
                <span className="text-[11px] text-outline font-label-sm">{g.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-md shadow-sm">
          <h3 className="font-headline-md text-headline-md text-on-surface mb-md">Users by Role</h3>
          <div className="space-y-5">
            {BREAKDOWN.map((row) => (
              <div key={row.label}>
                <div className="flex justify-between mb-1">
                  <span className="font-label-md text-label-md text-on-surface">{row.label}</span>
                  <span className="font-bold text-on-surface-variant">{row.value.toLocaleString()}</span>
                </div>
                <div className="h-3 w-full bg-outline-variant rounded-full overflow-hidden">
                  <div
                    className={`h-full ${row.bar} rounded-full transition-all duration-700`}
                    style={{ width: `${(row.value / maxBreakdown) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
