import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
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
      <DashboardLayout role="counselor">
        <p className="text-on-surface-variant">Loading…</p>
      </DashboardLayout>
    )
  }

  if (loadError || !report) {
    return (
      <DashboardLayout role="counselor">
        <p className="text-error">{loadError || 'No report data available.'}</p>
      </DashboardLayout>
    )
  }

  const maxSubjectScore = Math.max(100, ...report.subject_averages.map((s) => s.avg_score))

  return (
    <DashboardLayout role="counselor">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-lg">
        <div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-xs">
            Reports &amp; Insights
          </h1>
          <p className="text-on-surface-variant font-body-md text-body-md max-w-2xl">
            Based on {report.assigned_youth_count} youth assigned to you.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        <div className="md:col-span-8 bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-md shadow-sm">
          <h3 className="font-headline-md text-headline-md text-on-surface mb-md">Subject Score Averages</h3>
          {report.subject_averages.length === 0 ? (
            <p className="text-on-surface-variant font-body-md text-body-md">No academic records logged yet.</p>
          ) : (
            <div className="space-y-4">
              {report.subject_averages.map((row) => (
                <div key={row.subject}>
                  <div className="flex justify-between mb-1">
                    <span className="font-label-md text-label-md text-on-surface">{row.subject}</span>
                    <span className="font-bold text-primary">{Number(row.avg_score).toFixed(1)}</span>
                  </div>
                  <div className="h-3 w-full bg-outline-variant rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-1000"
                      style={{ width: `${(row.avg_score / maxSubjectScore) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="md:col-span-4 bg-primary text-on-primary rounded-xl p-md shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-headline-md text-headline-md mb-md">Risk Indicators</h3>
            {report.risk_indicator_categories.length === 0 ? (
              <p className="font-body-md text-body-md text-on-primary/80">No risk indicators recorded yet.</p>
            ) : (
              <div className="space-y-4">
                {report.risk_indicator_categories.map((row, i) => (
                  <div
                    key={row.category}
                    className={
                      i < report.risk_indicator_categories.length - 1
                        ? 'flex items-center justify-between border-b border-on-primary/20 pb-3'
                        : 'flex items-center justify-between'
                    }
                  >
                    <span className="font-label-md text-label-md">
                      {RISK_CATEGORY_LABELS[row.category] || row.category}
                    </span>
                    <span className="font-headline-md text-headline-md">{row.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-12 bg-surface-container-low rounded-xl border border-outline-variant/40 p-md shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-md gap-4">
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface">Attendance — Last 30 Days</h3>
              <p className="text-xs text-on-surface-variant">Daily attendance rate across your assigned youth</p>
            </div>
            {report.attendance_by_day.length > 0 && (
              <div className="flex items-center gap-2 text-[10px] font-label-sm text-on-surface-variant">
                <span>Low</span>
                <div className="flex gap-1">
                  {[0.2, 0.4, 0.6, 0.8, 1].map((o) => (
                    <div key={o} className="w-4 h-4 rounded-sm bg-primary" style={{ opacity: o }} />
                  ))}
                </div>
                <span>High</span>
              </div>
            )}
          </div>
          {report.attendance_by_day.length === 0 ? (
            <p className="text-on-surface-variant font-body-md text-body-md">No attendance records logged yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <div className="flex gap-2 min-w-max pb-2">
                {report.attendance_by_day.map((day) => (
                  <div key={day.date} className="flex flex-col items-center gap-1">
                    <div
                      title={`${formatShortDate(day.date)}: ${day.rate}% present`}
                      className="w-8 h-8 rounded-sm bg-primary transition-transform duration-200 hover:scale-110 cursor-default"
                      style={{ opacity: attendanceOpacity(day.rate) }}
                    />
                    <span className="text-[10px] text-outline font-label-sm">{formatShortDate(day.date)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-12 bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-md shadow-sm">
          <h3 className="font-headline-md text-headline-md text-on-surface mb-md flex items-center gap-2">
            <Icon name="history_edu" className="text-primary" />
            Recent Academic Records
          </h3>
          {report.recent_academic_records.length === 0 ? (
            <p className="text-on-surface-variant font-body-md text-body-md">No academic records logged yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-on-surface-variant font-label-md text-label-md border-b border-outline-variant/40">
                  <tr>
                    <th className="py-2 pr-4">Youth</th>
                    <th className="py-2 pr-4">Subject</th>
                    <th className="py-2 pr-4">Score</th>
                    <th className="py-2">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {report.recent_academic_records.map((rec) => (
                    <tr key={rec.id}>
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
        </div>
      </div>
    </DashboardLayout>
  )
}
