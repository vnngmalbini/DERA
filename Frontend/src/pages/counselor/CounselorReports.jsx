import { useEffect, useState } from 'react'
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader'
import Icon from '../../components/ui/Icon'
import { apiGet } from '../../services/apiClient'

const RISK_CATEGORY_LABELS = {
  academic_decline: 'Academic Decline',
  absenteeism: 'Absenteeism',
  financial_distress: 'Financial Distress',
  behavioural_change: 'Behavioural Change',
}

function attendanceOpacity(rate) {
  if (rate < 70) return 0.2
  if (rate < 80) return 0.4
  if (rate < 88) return 0.6
  if (rate < 95) return 0.8
  return 1
}

function formatShortDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })
}

function EmptyState({ icon, title, description }) {
  return (
    <div className="flex min-h-32 flex-col items-center justify-center rounded-xl border border-dashed border-outline-variant/60 bg-surface-container-low px-5 py-6 text-center">
      <Icon name={icon} className="mb-2 text-2xl text-outline" />
      <p className="font-label-md text-label-md font-bold text-on-surface">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-on-surface-variant">{description}</p>
    </div>
  )
}

export default function CounselorReports() {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    apiGet('/counselor-reports/')
      .then(setReport)
      .catch(() => setLoadError('Could not load reports right now.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <>
        <p className="text-on-surface-variant">Loading…</p>
      </>
    )
  }

  if (loadError || !report) {
    return (
      <>
        <p className="text-error">{loadError || 'No report data available.'}</p>
      </>
    )
  }

  const maxSubjectScore = Math.max(100, ...report.subject_averages.map((s) => s.avg_score))
  const averageSubjectScore = report.subject_averages.length
    ? report.subject_averages.reduce((sum, row) => sum + Number(row.avg_score), 0) / report.subject_averages.length
    : null
  const totalRiskIndicators = report.risk_indicator_categories.reduce((sum, row) => sum + row.count, 0)

  return (
    <>
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <DashboardPageHeader
          title="Reports & Insights"
          description={`A concise view of performance and wellbeing data for ${report.assigned_youth_count} assigned ${report.assigned_youth_count === 1 ? 'student' : 'students'}.`}
        />
        <div className="flex items-center gap-2 rounded-full border border-outline-variant/40 bg-surface-container-lowest px-4 py-2 text-xs font-bold text-on-surface-variant">
          <Icon name="schedule" className="text-base text-primary" />
          Last 30 days
        </div>
      </div>

      <section className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          ['groups', report.assigned_youth_count, 'Assigned students', 'text-primary', 'bg-primary-container'],
          ['school', report.subject_averages.length, 'Subjects tracked', 'text-secondary', 'bg-secondary-container'],
          ['grade', averageSubjectScore !== null ? averageSubjectScore.toFixed(1) : '—', 'Average score', 'text-tertiary', 'bg-tertiary-container'],
          ['warning', totalRiskIndicators, 'Risk indicators', 'text-error', 'bg-error-container'],
        ].map(([icon, value, label, iconColor, iconBackground]) => (
          <div key={label} className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-sm sm:p-5">
            <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${iconBackground} ${iconColor}`}><Icon name={icon} /></div>
            <p className="text-2xl font-bold text-on-surface sm:text-3xl">{value}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-on-surface-variant">{label}</p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-sm lg:col-span-7 md:p-6">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div><p className="text-xs font-bold uppercase tracking-wider text-primary">Academic performance</p><h3 className="mt-1 font-headline-md text-headline-md font-bold text-on-surface">Subject score averages</h3></div>
            <Icon name="bar_chart" className="text-primary" />
          </div>
          {report.subject_averages.length === 0 ? (
            <EmptyState icon="bar_chart" title="No academic data yet" description="Subject averages will appear here after academic records are logged." />
          ) : (
            <div className="space-y-5">
              {report.subject_averages.map((row) => (
                <div key={row.subject}>
                  <div className="mb-2 flex justify-between">
                    <span className="font-label-md text-label-md text-on-surface">{row.subject}</span>
                    <span className="font-bold text-primary">{Number(row.avg_score).toFixed(1)}<span className="ml-1 text-xs font-normal text-on-surface-variant">/ 100</span></span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-1000"
                      style={{ width: `${(row.avg_score / maxSubjectScore) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-sm lg:col-span-5 md:p-6">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div><p className="text-xs font-bold uppercase tracking-wider text-error">Student wellbeing</p><h3 className="mt-1 font-headline-md text-headline-md font-bold text-on-surface">Risk indicators</h3></div>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-error-container text-error"><Icon name="shield" /></span>
          </div>
            {report.risk_indicator_categories.length === 0 ? (
              <EmptyState icon="shield" title="No indicators recorded" description="Recorded indicators will be grouped here for quick review." />
            ) : (
              <div className="space-y-3">
                {report.risk_indicator_categories.map((row) => (
                  <div
                    key={row.category}
                    className="flex items-center justify-between rounded-xl bg-surface-container-low px-4 py-3"
                  >
                    <span className="font-label-md text-label-md text-on-surface">
                      {RISK_CATEGORY_LABELS[row.category] || row.category}
                    </span>
                    <span className="flex h-8 min-w-8 items-center justify-center rounded-full bg-error-container px-2 font-bold text-error">{row.count}</span>
                  </div>
                ))}
              </div>
            )}
        </section>

        <section className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-sm lg:col-span-12 md:p-6">
          <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary">Attendance trend</p>
              <h3 className="mt-1 font-headline-md text-headline-md font-bold text-on-surface">Last 30 days</h3>
              <p className="mt-1 text-sm text-on-surface-variant">Daily attendance rate across your assigned students</p>
            </div>
            {report.attendance_by_day.length > 0 && (
              <div className="flex items-center gap-2 text-[10px] font-label-sm text-on-surface-variant">
                <span>Low</span>
                <div className="flex gap-1">
                  {[0.2, 0.4, 0.6, 0.8, 1].map((opacity) => (
                    <div key={opacity} className="h-3 w-3 rounded-sm bg-primary" style={{ opacity }} />
                  ))}
                </div>
                <span>High</span>
              </div>
            )}
          </div>
          {report.attendance_by_day.length === 0 ? (
            <EmptyState icon="calendar_month" title="No attendance data yet" description="Daily attendance activity will appear here once records are logged." />
          ) : (
            <div className="overflow-x-auto">
              <div className="flex min-w-max gap-2 rounded-xl bg-surface-container-low p-4 pb-3">
                {report.attendance_by_day.map((day) => (
                  <div key={day.date} className="flex flex-col items-center gap-1">
                    <div
                      title={`${formatShortDate(day.date)}: ${day.rate}% present`}
                      className="h-8 w-8 cursor-default rounded-md bg-primary transition-transform duration-200 hover:scale-110"
                      style={{ opacity: attendanceOpacity(day.rate) }}
                    />
                    <span className="text-[10px] text-outline font-label-sm">{formatShortDate(day.date)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 shadow-sm lg:col-span-12 md:p-6">
          <div className="mb-5 flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-primary">Latest entries</p><h3 className="mt-1 font-headline-md text-headline-md font-bold text-on-surface">Recent academic records</h3></div><Icon name="history_edu" className="text-primary" /></div>
          {report.recent_academic_records.length === 0 ? (
            <EmptyState icon="history_edu" title="No recent records" description="New academic records will be listed here for quick access." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-outline-variant/30 text-on-surface-variant font-label-md text-label-md">
                  <tr>
                    <th className="py-2 pr-4">Youth</th>
                    <th className="py-2 pr-4">Subject</th>
                    <th className="py-2 pr-4">Score</th>
                    <th className="py-2">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {report.recent_academic_records.map((rec) => (
                    <tr key={rec.id} className="border-b border-outline-variant/15 last:border-0 hover:bg-surface-container-low">
                      <td className="py-2 pr-4 text-on-surface">{rec.youth_name}</td>
                      <td className="py-2 pr-4 text-on-surface-variant">{rec.subject}</td>
                      <td className="py-2 pr-4 text-on-surface-variant">{rec.score}</td>
                      <td className="py-2 text-on-surface-variant">{formatShortDate(rec.recorded_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </>
  )
}
