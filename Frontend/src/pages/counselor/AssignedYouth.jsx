import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Icon from '../../components/ui/Icon'
import { apiGet } from '../../services/apiClient'

const EDUCATION_LEVEL_LABELS = {
  primary: 'Primary',
  jhs: 'JHS',
  shs: 'SHS',
  shs_graduate: 'SHS Graduate',
  tertiary: 'Tertiary',
  dropout_re_entry: 'Dropout Re-entry',
  teen_mother_program: 'Teen Mother Program',
}

const RISK_STYLES = {
  Low: { badge: 'bg-secondary-container text-on-secondary-container', dot: 'bg-primary', label: 'Low Risk' },
  Moderate: { badge: 'bg-surface-container-highest text-on-surface-variant', dot: 'bg-outline', label: 'Moderate Risk' },
  High: { badge: 'bg-error-container text-on-error-container', dot: 'bg-error', label: 'High Risk' },
  Critical: { badge: 'bg-error-container text-on-error-container', dot: 'bg-error', label: 'Critical Risk' },
}

function RiskBadge({ risk }) {
  if (!risk) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-label-sm text-label-sm bg-surface-container-highest text-on-surface-variant">
        Not yet assessed
      </span>
    )
  }
  const style = RISK_STYLES[risk] || RISK_STYLES.Moderate
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-label-sm text-label-sm ${style.badge}`}>
      <span className={`w-2 h-2 rounded-full ${style.dot}`} />
      {style.label}
    </span>
  )
}

function Avatar({ name }) {
  const initials = name.split(' ').map((part) => part[0]).join('').slice(0, 2)
  return (
    <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center flex-shrink-0 text-on-primary-container font-label-md text-label-md">
      {initials}
    </div>
  )
}

export default function AssignedYouth() {
  const [roster, setRoster] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [search, setSearch] = useState('')
  const [riskFilter, setRiskFilter] = useState('')
  const [levelFilter, setLevelFilter] = useState('')

  useEffect(() => {
    apiGet('/counselor-roster/')
      .then(setRoster)
      .catch(() => setLoadError('Could not load your assigned youth right now.'))
      .finally(() => setLoading(false))
  }, [])

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase()
    return roster.filter((s) => {
      const matchesSearch = !query || s.full_name.toLowerCase().includes(query)
      const matchesRisk = !riskFilter || s.risk_level === riskFilter
      const matchesLevel = !levelFilter || s.education_level === levelFilter
      return matchesSearch && matchesRisk && matchesLevel
    })
  }, [roster, search, riskFilter, levelFilter])

  return (
    <DashboardLayout role="counselor">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-xl">
        <div>
          <nav className="flex items-center gap-2 text-on-surface-variant mb-2">
            <span className="font-label-sm text-label-sm">Classroom</span>
            <Icon name="chevron_right" className="text-sm" />
            <span className="font-label-sm text-label-sm text-primary font-bold">Assigned Youth</span>
          </nav>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">Assigned Youth</h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            Monitor academic performance, attendance, and risk factors for the youth assigned to you.
          </p>
        </div>
      </div>

      {loadError && <p className="text-error mb-lg">{loadError}</p>}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-lg">
        <div className="md:col-span-6 relative group">
          <Icon
            name="search"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors group-focus-within:text-primary"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-outline-variant rounded-xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-body-md"
            placeholder="Search students by name..."
            type="text"
          />
        </div>
        <div className="md:col-span-3">
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="w-full bg-white border border-outline-variant rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-body-md"
          >
            <option value="">Risk Level: All</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Moderate">Moderate</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div className="md:col-span-3">
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="w-full bg-white border border-outline-variant rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-body-md"
          >
            <option value="">Education Level: All</option>
            {Object.entries(EDUCATION_LEVEL_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden border border-outline-variant shadow-sm mb-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-6 py-5 font-label-md text-label-md text-on-surface-variant">Student Name</th>
                <th className="px-6 py-5 font-label-md text-label-md text-on-surface-variant">Risk Level</th>
                <th className="px-6 py-5 font-label-md text-label-md text-on-surface-variant text-center">
                  Attendance (30d)
                </th>
                <th className="px-6 py-5 font-label-md text-label-md text-on-surface-variant text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-surface-bright transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <Avatar name={s.full_name} />
                      <div>
                        <p className="font-label-md text-label-md text-on-surface">{s.full_name}</p>
                        <p className="text-xs text-on-surface-variant">
                          {EDUCATION_LEVEL_LABELS[s.education_level] || 'Education level not set'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <RiskBadge risk={s.risk_level} />
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col items-center">
                      <span className="font-label-md text-label-md text-on-surface">
                        {s.attendance_rate_30d !== null ? `${s.attendance_rate_30d}%` : '—'}
                      </span>
                      {s.attendance_rate_30d !== null && (
                        <div className="w-20 h-1 bg-surface-container-high rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${s.attendance_rate_30d}%` }} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <Link
                      to={`/dashboard/counselor/youth/${s.id}`}
                      className="inline-block text-primary hover:bg-primary-container hover:text-on-primary-container px-4 py-2 rounded-lg font-label-md text-label-md transition-all active:scale-95"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
              {!loading && filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-on-surface-variant">
                    {roster.length === 0 ? 'No youth assigned to you yet.' : 'No students match your filters.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {filteredStudents.length > 0 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-outline-variant bg-surface-container-low">
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Showing {filteredStudents.length} of {roster.length} students
            </span>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
