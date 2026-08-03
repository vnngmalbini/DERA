import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Icon from '../../components/ui/Icon'
import { useAuth } from '../../context/AuthContext'
import { apiGet } from '../../services/apiClient'

const STATUS_STYLES = {
  Critical: 'bg-error-container text-on-error-container',
  High: 'bg-error-container text-on-error-container',
  Moderate: 'bg-surface-variant text-on-surface-variant',
  Low: 'bg-secondary-container text-on-secondary-container',
}

function StatusBadge({ status }) {
  if (!status) return <span className="text-on-surface-variant text-xs">Not yet assessed</span>
  return (
    <span className={`${STATUS_STYLES[status] || STATUS_STYLES.Moderate} px-3 py-1 rounded-full text-xs font-bold uppercase`}>
      {status}
    </span>
  )
}

function initialsFor(name) {
  if (!name) return '?'
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
}

function formatDate(dateString) {
  if (!dateString) return null
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })
}

export default function CounselorOverview() {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [roster, setRoster] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const firstName = (user?.fullName || 'there').split(' ')[0]

  useEffect(() => {
    apiGet('/counselor-roster/')
      .then(setRoster)
      .catch(() => setLoadError('Could not load your roster right now.'))
      .finally(() => setLoading(false))
  }, [])

  const atRiskStudents = useMemo(
    () => roster.filter((r) => ['High', 'Critical'].includes(r.risk_level)),
    [roster],
  )

  const attendanceRates = roster.map((r) => r.attendance_rate_30d).filter((v) => v !== null && v !== undefined)
  const avgAttendance =
    attendanceRates.length > 0
      ? (attendanceRates.reduce((sum, v) => sum + v, 0) / attendanceRates.length).toFixed(1)
      : null

  const openInterventions = roster.reduce((sum, r) => sum + (r.open_interventions_count || 0), 0)

  const priorityAlerts = useMemo(
    () =>
      [...atRiskStudents]
        .sort((a, b) => new Date(b.assessed_at) - new Date(a.assessed_at))
        .slice(0, 3),
    [atRiskStudents],
  )

  const filteredRoster = roster.filter((s) => s.full_name.toLowerCase().includes(search.toLowerCase()))

  return (
    <DashboardLayout role="counselor">
      <section className="mb-xl">
        <h2 className="font-headline-lg text-headline-lg text-primary mb-2">Akwaaba, {firstName}</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Here is a summary of student performance and alerts for today.
        </p>
      </section>

      {loadError && <p className="text-error mb-lg">{loadError}</p>}

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-xl">
        <div className="bg-surface-container p-md rounded-xl border border-outline-variant/10 shadow-sm flex flex-col justify-between transition-shadow hover:shadow-md">
          <div>
            <Icon name="warning" className="text-error text-3xl mb-md block" />
            <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
              At Risk Students
            </h3>
          </div>
          <div className="flex items-end gap-3 mt-md">
            <span className="text-5xl font-bold text-on-surface">{atRiskStudents.length}</span>
          </div>
        </div>

        <div className="bg-primary-container text-on-primary-container p-md rounded-xl shadow-sm flex flex-col justify-between transition-shadow hover:shadow-md">
          <div>
            <Icon name="calendar_month" className="text-3xl mb-md block" />
            <h3 className="font-label-md text-label-md uppercase tracking-wider opacity-90">
              Avg. Attendance (30d)
            </h3>
          </div>
          <div className="mt-md">
            <span className="text-5xl font-bold">{avgAttendance !== null ? `${avgAttendance}%` : '—'}</span>
            {avgAttendance !== null && (
              <div className="w-full bg-on-primary-container/20 h-2 rounded-full mt-3 overflow-hidden">
                <div className="bg-on-primary-container h-full rounded-full" style={{ width: `${avgAttendance}%` }} />
              </div>
            )}
          </div>
        </div>

        <div className="bg-surface-container-high p-md rounded-xl border border-outline-variant/10 shadow-sm flex flex-col justify-between transition-shadow hover:shadow-md">
          <div>
            <Icon name="history_edu" className="text-tertiary text-3xl mb-md block" />
            <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
              Open Interventions
            </h3>
          </div>
          <div className="flex items-end gap-3 mt-md">
            <span className="text-5xl font-bold text-on-surface">{openInterventions}</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-4 flex flex-col gap-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Priority Alerts</h3>
            {priorityAlerts.length > 0 && (
              <span className="bg-error text-on-error text-xs font-bold px-2 py-1 rounded-full">
                {priorityAlerts.length}
              </span>
            )}
          </div>

          {!loading && priorityAlerts.length === 0 && (
            <p className="text-on-surface-variant font-body-md text-body-md">No high-risk students right now.</p>
          )}

          {priorityAlerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-white p-4 rounded-xl border-l-4 border-error shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0 text-on-primary-container font-label-md text-label-md">
                  {initialsFor(alert.full_name)}
                </div>
                <div>
                  <h4 className="font-bold text-on-surface">{alert.full_name}</h4>
                  <p className="text-sm text-on-surface-variant">{alert.risk_level} risk</p>
                  <Link
                    to={`/dashboard/counselor/youth/${alert.id}`}
                    className="mt-3 text-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all w-fit"
                  >
                    View Details
                    <Icon name="chevron_right" className="text-sm" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="lg:col-span-8">
          <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/20 overflow-hidden h-full flex flex-col">
            <div className="p-md border-b border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-4">
              <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Student Roster</h3>
              <div className="relative w-full md:w-72">
                <Icon
                  name="search"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-full text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="Search students..."
                  type="text"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-lowest border-b border-outline-variant/10 text-on-surface-variant font-label-md text-label-md">
                  <tr>
                    <th className="px-6 py-4">Student Name</th>
                    <th className="px-6 py-4">Risk Level</th>
                    <th className="px-6 py-4">Attendance</th>
                    <th className="px-6 py-4">Last Assessed</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {filteredRoster.map((s) => (
                    <tr key={s.id} className="hover:bg-surface-variant/10 transition-colors">
                      <td className="px-6 py-4 font-bold text-on-surface">{s.full_name}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={s.risk_level} />
                      </td>
                      <td className="px-6 py-4 text-on-surface-variant">
                        {s.attendance_rate_30d !== null ? `${s.attendance_rate_30d}%` : '—'}
                      </td>
                      <td className="px-6 py-4 text-on-surface-variant">{formatDate(s.assessed_at) || '—'}</td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/dashboard/counselor/youth/${s.id}`}
                          aria-label={`View ${s.full_name}`}
                          className="inline-flex text-on-surface-variant hover:text-primary transition-colors"
                        >
                          <Icon name="chevron_right" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {!loading && filteredRoster.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-on-surface-variant">
                        {roster.length === 0 ? 'No youth assigned to you yet.' : 'No students match your search.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-surface-container-lowest flex justify-center border-t border-outline-variant/10 mt-auto">
              <Link
                to="/dashboard/counselor/youth"
                className="text-primary font-bold hover:underline flex items-center gap-2"
              >
                View Full Roster
                <Icon name="arrow_forward" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}
