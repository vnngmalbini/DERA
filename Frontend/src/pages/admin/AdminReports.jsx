import { useEffect, useMemo, useState } from 'react'
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader'
import { apiGet } from '../../services/apiClient'

const ROLE_META = {
  youth: { label: 'Youth', bar: 'bg-primary' },
  counselor: { label: 'Counselors', bar: 'bg-tertiary' },
  donor: { label: 'Donors', bar: 'bg-secondary' },
  admin: { label: 'Admins', bar: 'bg-error' },
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function lastSixMonthKeys() {
  const keys = []
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    keys.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: MONTH_LABELS[d.getMonth()] })
  }
  return keys
}

export default function AdminReports() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    apiGet('/users/')
      .then((data) => setUsers(data.results ?? data))
      .catch(() => setLoadError('Could not load report data right now.'))
      .finally(() => setLoading(false))
  }, [])

  const growth = useMemo(() => {
    const months = lastSixMonthKeys()
    return months.map(({ key, label }) => {
      const count = users.filter((u) => {
        const d = new Date(u.created_at)
        return `${d.getFullYear()}-${d.getMonth()}` === key
      }).length
      return { label, users: count }
    })
  }, [users])

  const breakdown = useMemo(() => {
    const counts = {}
    users.forEach((u) => {
      counts[u.role] = (counts[u.role] ?? 0) + 1
    })
    return Object.entries(ROLE_META).map(([role, meta]) => ({
      label: meta.label,
      bar: meta.bar,
      value: counts[role] ?? 0,
    }))
  }, [users])

  const maxUsers = Math.max(1, ...growth.map((g) => g.users))
  const maxBreakdown = Math.max(1, ...breakdown.map((b) => b.value))

  return (
    <>
      <DashboardPageHeader
        title="Reports & Analytics"
        description="Platform-wide growth and usage trends."
      />

      {loading ? (
        <p className="text-on-surface-variant py-10 text-center">Loading…</p>
      ) : loadError ? (
        <p className="text-error py-10 text-center">{loadError}</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-md shadow-sm">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-md">User Growth (New Signups)</h3>
            <div className="h-56 flex items-end justify-between gap-3 px-2">
              {growth.map((g) => (
                <div key={g.label} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div
                    className="w-full bg-primary rounded-t-md transition-all hover:brightness-110"
                    style={{ height: `${(g.users / maxUsers) * 100}%`, minHeight: g.users > 0 ? '4px' : '0' }}
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
              {breakdown.map((row) => (
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
      )}
    </>
  )
}
