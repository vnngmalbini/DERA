import DashboardLayout from '../../components/layout/DashboardLayout'
import Icon from '../../components/ui/Icon'

const TREND_WEEKS = [
  { label: 'Week 1', science: 60, math: 45 },
  { label: 'Week 2', science: 65, math: 50 },
  { label: 'Week 3', science: 75, math: 60 },
  { label: 'Week 4', science: 85, math: 70 },
  { label: 'Week 5', science: 80, math: 65 },
]

const MATH_TEXTURE = {
  backgroundImage:
    'repeating-linear-gradient(45deg, rgba(255,255,255,0.35) 0px, rgba(255,255,255,0.35) 2px, transparent 2px, transparent 6px)',
}

const KEY_ALERTS = [
  { icon: 'directions_bus', label: 'Transport Issues', value: 12 },
  { icon: 'medical_services', label: 'Health Concerns', value: 8 },
  { icon: 'payments', label: 'Financial Barriers', value: 15 },
]

const RISK_BREAKDOWN = [
  { label: 'Literacy Levels', value: 78, bar: 'bg-primary', text: 'text-primary' },
  { label: 'Numeracy Foundation', value: 62, bar: 'bg-tertiary', text: 'text-tertiary' },
  { label: 'Creative Arts Engagement', value: 94, bar: 'bg-primary-container', text: 'text-primary-container' },
]

const ATTENDANCE = [
  [82, 88, 76, 91, 68],
  [90, 85, 94, 88, 72],
  [95, 92, 89, 97, 80],
  [78, 84, 90, 93, 65],
  [96, 98, 91, 95, 88],
  [85, 90, 93, 97, 91],
]

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

function attendanceOpacity(value) {
  if (value < 70) return 0.2
  if (value < 80) return 0.4
  if (value < 88) return 0.6
  if (value < 95) return 0.8
  return 1
}

export default function CounselorReports() {
  return (
    <DashboardLayout role="counselor">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-lg">
        <div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-xs">
            Class Performance Insights
          </h1>
          <p className="text-on-surface-variant font-body-md text-body-md max-w-2xl">
            Visualizing growth and risk patterns for JHS 2 Section B. Data updated as of Oct 24, 2023.
          </p>
        </div>
        <button className="bg-primary text-on-primary font-label-md text-label-md px-6 h-12 rounded-full flex items-center gap-2 hover:shadow-lg active:scale-95 transition-all w-fit">
          <Icon name="download" />
          Download Full Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        <div className="md:col-span-8 bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-md shadow-sm">
          <div className="flex justify-between items-center mb-md flex-wrap gap-2">
            <h3 className="font-headline-md text-headline-md text-on-surface">Class-wide Trends</h3>
            <div className="flex gap-4">
              <span className="flex items-center gap-2 text-xs font-label-md text-on-surface-variant">
                <span className="w-3 h-3 rounded-full bg-primary" /> Science
              </span>
              <span className="flex items-center gap-2 text-xs font-label-md text-on-surface-variant">
                <span className="w-3 h-3 rounded-full bg-tertiary" style={MATH_TEXTURE} /> Mathematics
              </span>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-2 px-2">
            {TREND_WEEKS.map((week) => (
              <div key={week.label} className="group relative flex-1 flex flex-col items-center gap-2 h-full">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full hidden group-hover:flex items-center gap-2 bg-on-surface text-white text-[11px] font-label-sm px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap z-20">
                  <span>Science {week.science}%</span>
                  <span className="opacity-50">|</span>
                  <span>Math {week.math}%</span>
                </div>
                <div className="w-full flex gap-1 items-end h-full">
                  <div
                    className="bg-primary rounded-t-md w-full transition-all group-hover:brightness-110"
                    style={{ height: `${week.science}%` }}
                  />
                  <div
                    className="bg-tertiary rounded-t-md w-full transition-all group-hover:brightness-110"
                    style={{ height: `${week.math}%`, ...MATH_TEXTURE }}
                  />
                </div>
                <span className="text-[10px] text-outline font-label-sm">{week.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-4 bg-primary text-on-primary rounded-xl p-md shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-headline-md text-headline-md mb-md">Key Alerts</h3>
            <div className="space-y-4">
              {KEY_ALERTS.map((alert, i) => (
                <div
                  key={alert.label}
                  className={
                    i < KEY_ALERTS.length - 1
                      ? 'flex items-center justify-between border-b border-on-primary/20 pb-3'
                      : 'flex items-center justify-between'
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon name={alert.icon} className="text-primary-fixed" />
                    <span className="font-label-md text-label-md">{alert.label}</span>
                  </div>
                  <span className="font-headline-md text-headline-md">{String(alert.value).padStart(2, '0')}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-lg">
            <button className="w-full bg-on-primary text-primary font-label-md text-label-md py-3 rounded-lg hover:bg-primary-fixed transition-colors">
              View All Risks
            </button>
          </div>
        </div>

        <div className="md:col-span-12 bg-surface-container-low rounded-xl border border-outline-variant/40 p-md shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-md gap-4">
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface">Attendance Heatmap</h3>
              <p className="text-xs text-on-surface-variant">Monitoring daily presence across the last 30 days</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-label-sm text-on-surface-variant">
              <span>Low</span>
              <div className="flex gap-1">
                {[0.2, 0.4, 0.6, 0.8, 1].map((o) => (
                  <div key={o} className="w-4 h-4 rounded-sm bg-primary" style={{ opacity: o }} />
                ))}
              </div>
              <span>High</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[640px] grid grid-cols-[auto_1fr] gap-4">
              <div className="grid grid-rows-5 gap-2 text-[10px] text-outline font-label-sm py-0">
                {DAY_LABELS.map((d) => (
                  <span key={d} className="flex items-center h-8">
                    {d}
                  </span>
                ))}
              </div>
              <div className="grid grid-flow-col grid-rows-5 gap-2">
                {ATTENDANCE.flatMap((week, wi) =>
                  week.map((value, di) => (
                    <div
                      key={`${wi}-${di}`}
                      title={`Week ${wi + 1}, ${DAY_LABELS[di]}: ${value}% present`}
                      className="h-8 rounded-sm bg-primary transition-transform duration-200 hover:scale-110 hover:z-10 cursor-default"
                      style={{ opacity: attendanceOpacity(value) }}
                    />
                  )),
                )}
              </div>
              <div />
              <div className="grid grid-flow-col gap-2" style={{ gridTemplateColumns: `repeat(${ATTENDANCE.length}, minmax(0, 1fr))` }}>
                {ATTENDANCE.map((_, wi) => (
                  <span key={wi} className="text-[10px] text-outline font-label-sm text-center">
                    Week {wi + 1}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-12 lg:col-span-6 bg-surface-container-lowest rounded-xl border border-outline-variant/40 p-md shadow-sm">
          <h3 className="font-headline-md text-headline-md text-on-surface mb-md">Academic Risk Breakdown</h3>
          <div className="space-y-6">
            {RISK_BREAKDOWN.map((row) => (
              <div key={row.label}>
                <div className="flex justify-between mb-2">
                  <span className="font-label-md text-label-md text-on-surface">{row.label}</span>
                  <span className={`font-bold ${row.text}`}>{row.value}% Target Achieved</span>
                </div>
                <div className="h-3 w-full bg-outline-variant rounded-full overflow-hidden">
                  <div className={`h-full ${row.bar} rounded-full transition-all duration-1000`} style={{ width: `${row.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-12 lg:col-span-6 flex gap-4 overflow-x-auto pb-1">
          <div className="min-w-[320px] bg-secondary-container rounded-xl p-md shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0">
                  <Icon name="psychology" className="text-secondary" />
                </div>
                <div>
                  <h4 className="font-headline-md text-headline-md text-on-secondary-container">Learning Insight</h4>
                  <p className="text-xs text-on-secondary-container/80">Group Dynamics</p>
                </div>
              </div>
              <p className="font-body-md text-body-md text-on-secondary-container">
                Class collaboration has improved by 15% since introducing the community-rooted project model.
              </p>
            </div>
          </div>
          <div className="relative min-w-[320px] bg-tertiary-container text-on-tertiary-container rounded-xl p-md shadow-sm flex flex-col justify-between overflow-hidden">
            <div
              className="absolute inset-0 opacity-10 bg-cover bg-center pointer-events-none"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAjS8w9XpXKr1Fx6Ch-rnH31JJHqGW-1d1mIi8OwUnZk_XPUdpXd7_2GMpcDAIUR6Sx9CUsHX4r8V5pEg6ATzddflikzw3l2i0zxQ4FVhhqIxG0UffeXnjsdzb5FozI7HNAX3uDuIaKS_DITViZ-itoD8ywVrilWbTZTnl54zHh6bqWoCsSvfu7RsgkU7urAFU8dus91Cuf2N-nGjMH8e4DoROVrwemvbCTmrWNL36vZNn4JLV8p_QZ')",
              }}
            />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-tertiary flex items-center justify-center shrink-0">
                  <Icon name="agriculture" className="text-on-tertiary" />
                </div>
                <div>
                  <h4 className="font-headline-md text-headline-md">Agri-Tech Progress</h4>
                  <p className="text-xs text-on-tertiary-container/80">Practical Skills</p>
                </div>
              </div>
              <p className="font-body-md text-body-md">The school farm project is the highest driver of school attendance this quarter.</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
