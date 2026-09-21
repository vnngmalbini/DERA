import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../components/ui/Icon'
import DashboardStatCard from '../../components/dashboard/DashboardStatCard'
import { useAuth } from '../../context/AuthContext'
import { apiGet } from '../../services/apiClient'
import { fetchDropoutRiskSummary } from '../../services/dropoutRiskService'

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
  const [dropoutSummary, setDropoutSummary] = useState(null)
  const firstName = (user?.fullName || 'there').split(' ')[0]

  useEffect(() => {
    apiGet('/counselor-roster/')
      .then(setRoster)
      .catch(() => setLoadError('Could not load your roster right now.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchDropoutRiskSummary().then(setDropoutSummary).catch(() => {})
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
    <>
      <section className="mb-xl flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary mb-2">Akwaaba, {firstName}</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Here is a summary of student performance and alerts for today.
          </p>
        </div>
        <Link
          to="/dashboard/counselor/dropout-risk"
          className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-on-primary shadow-sm hover:bg-primary/90"
        >
          <Icon name="add_circle" className="text-lg" />
          New risk assessment
        </Link>
      </section>

      {loadError && <p className="text-error mb-lg">{loadError}</p>}

      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <DashboardStatCard icon="warning" value={atRiskStudents.length} label="Students needing attention" tone="error" />
        <DashboardStatCard icon="calendar_month" value={avgAttendance !== null ? `${avgAttendance}%` : '—'} label="Average attendance, last 30 days" tone="primary" />
        <DashboardStatCard icon="history_edu" value={openInterventions} label="Open support interventions" tone="tertiary" />
      </section>

      {dropoutSummary && (
        <section className="mb-8 overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-outline-variant/20 px-5 py-5 md:flex-row md:items-center md:px-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-error-container text-error"><Icon name="health_and_safety" /></span>
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Dropout-risk early warning</h3>
              </div>
              <p className="mt-2 text-sm text-on-surface-variant">Latest assessments across your assigned students</p>
            </div>
            <Link to="/dashboard/counselor/dropout-risk" className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline">Open assessment tool <Icon name="arrow_forward" className="text-lg" /></Link>
          </div>
          <div className="grid grid-cols-2 divide-x divide-y divide-outline-variant/20 md:grid-cols-5 md:divide-y-0">
            {[['total_assessed', 'Assessed', 'text-on-surface'], ['low_risk', 'Low risk', 'text-secondary'], ['medium_risk', 'Medium risk', 'text-tertiary'], ['high_risk', 'High risk', 'text-error'], ['requiring_intervention', 'Needs support', 'text-error']].map(([key, label, color]) => (
              <div key={key} className="px-5 py-4 md:px-4"><p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">{label}</p><p className={`mt-1 text-2xl font-bold ${color}`}>{dropoutSummary[key]}</p></div>
            ))}
          </div>
          <div className="border-t border-outline-variant/20 bg-surface-container-low px-5 py-4 md:px-6">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Risk distribution by level</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {Object.entries(dropoutSummary.by_education_level).map(([educationLevel, counts]) => (
                <div key={educationLevel} className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-4 py-3">
                  <p className="text-xs font-bold uppercase text-on-surface">{educationLevel}</p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-on-surface-variant"><span className="font-bold text-secondary">{counts.LOW} low</span><span>•</span><span className="font-bold text-tertiary">{counts.MEDIUM} medium</span><span>•</span><span className="font-bold text-error">{counts.HIGH} high</span></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section className="flex flex-col gap-4 lg:col-span-4">
          <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
            <div><p className="text-xs font-bold uppercase tracking-wider text-error">Action queue</p><h3 className="mt-1 font-headline-md text-headline-md font-bold text-on-surface">Priority alerts</h3></div>
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
              className="rounded-xl border border-outline-variant/30 border-l-4 border-l-error bg-surface-container-lowest p-4 shadow-sm transition-shadow hover:shadow-md"
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
          <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest shadow-sm">
            <div className="flex flex-col justify-between gap-4 border-b border-outline-variant/20 p-5 md:flex-row md:items-center">
              <div><p className="text-xs font-bold uppercase tracking-wider text-primary">Your caseload</p><h3 className="mt-1 font-headline-md text-headline-md font-bold text-on-surface">Student roster</h3></div>
              <div className="relative w-full md:w-72">
                <Icon
                  name="search"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-2 pl-10 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Search students..."
                  type="text"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-outline-variant/20 bg-surface-container-low text-on-surface-variant font-label-md text-label-md">
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
                    <tr key={s.id} className="transition-colors hover:bg-surface-container-low">
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
            <div className="mt-auto flex justify-center border-t border-outline-variant/20 bg-surface-container-low p-4">
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
    </>
  )
}
