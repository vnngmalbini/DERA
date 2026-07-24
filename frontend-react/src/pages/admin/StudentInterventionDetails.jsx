import { useState } from 'react'
import { useParams } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import Icon from '../../components/ui/Icon'

const STUDENT = {
  name: 'Kofi Mensah',
  grade: 'Grade 10-B',
  riskLevel: 'Moderate',
  joined: 'Sep 2023',
  location: 'Kwame Danso Region',
  avatar:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAnrJPdylsP_pkkdGH7MoOCZ8z9sw7hnCh2Cx5aHJh0kRBXbTviK2bjrWGH5qHLR5PEqQuIQcV8a8tMJdsJE4PkmAMcqK4PoYjg44hkh9qQjHoO5naXqO5o0OCNNnPYtlPB26D-6bFV8wV5JCV_pqUlN36Z37XFtD1NMQD-iSb-ff2rC0iFzoiY_e4jqECUUTbJ9hOO-ED2vSqsgH__o6pwrEjmLuJzw9sKuaK8zaysfbvC1LEcx96D',
}

const TREND_BARS = [
  { height: 40, tone: 'bg-primary-container/30' },
  { height: 55, tone: 'bg-primary-container/40' },
  { height: 35, tone: 'bg-primary-container/50' },
  { height: 65, tone: 'bg-primary-container' },
  { height: 50, tone: 'bg-tertiary-container' },
  { height: 20, tone: 'bg-error-container' },
]

const ALERTS = [
  {
    title: 'Attendance Drop',
    time: '2 days ago',
    desc: 'Missed 3 consecutive morning sessions without prior notice.',
    severity: 'high',
  },
  {
    title: 'Math Quiz Score',
    time: 'Feb 12',
    desc: 'Sudden 15% drop in Math assessment compared to class average.',
    severity: 'normal',
  },
  {
    title: 'Resource Gap',
    time: 'Jan 28',
    desc: 'Informed teacher about missing Science workbook.',
    severity: 'normal',
  },
]

const TYPES = [
  { value: 'home_visit', label: 'Home Visit', icon: 'home' },
  { value: 'peer_mentor', label: 'Mentoring', icon: 'psychology' },
  { value: 'tutoring', label: 'Tutoring', icon: 'school' },
]

const TYPE_STYLES = {
  home_visit: { title: 'Home Visit', icon: 'home', badge: 'bg-secondary text-white' },
  peer_mentor: { title: 'Peer Mentoring', icon: 'psychology', badge: 'bg-primary-container text-on-primary-container' },
  tutoring: { title: 'Tutoring Session', icon: 'school', badge: 'bg-tertiary-container text-on-tertiary-container' },
}

const INITIAL_LOG = [
  {
    id: 1,
    type: 'home_visit',
    date: 'Feb 15, 2024',
    notes:
      'Met with parents. Kofi was helping with harvest, causing attendance issues. Agreed on a split-shift for his chores during exam prep.',
  },
  {
    id: 2,
    type: 'peer_mentor',
    date: 'Feb 05, 2024',
    notes: 'Assigned Senior Mentor (Abena) to help with Mathematics foundation topics. Positive first session reported.',
  },
]

function formatToday() {
  return new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
}

export default function StudentInterventionDetails() {
  useParams()
  const [log, setLog] = useState(INITIAL_LOG)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState({ type: 'home_visit', notes: '' })

  const closeModal = () => {
    setIsModalOpen(false)
    setForm({ type: 'home_visit', notes: '' })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.notes.trim()) return
    setLog((prev) => [
      { id: Date.now(), type: form.type, date: formatToday(), notes: form.notes.trim() },
      ...prev,
    ])
    closeModal()
  }

  return (
    <AdminLayout>
      <section className="mb-lg">
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between bg-surface-container-lowest border border-outline-variant/40 p-md rounded-xl shadow-sm">
          <div className="flex items-center gap-6">
            <div className="relative shrink-0">
              <div className="w-24 h-24 rounded-2xl bg-secondary overflow-hidden">
                <img className="w-full h-full object-cover" alt={STUDENT.name} src={STUDENT.avatar} />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-primary p-1.5 rounded-lg text-white">
                <Icon name="verified" className="text-[20px]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h2 className="font-headline-lg text-headline-lg text-primary">{STUDENT.name}</h2>
                <span className="bg-secondary-fixed text-on-secondary-fixed px-3 py-0.5 rounded-full font-label-sm text-label-sm">
                  {STUDENT.grade}
                </span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Academic Risk Level: <span className="text-error font-bold">{STUDENT.riskLevel}</span>
              </p>
              <div className="flex gap-4 mt-3 flex-wrap">
                <div className="flex items-center gap-1 text-on-surface-variant">
                  <Icon name="calendar_today" className="text-[18px]" />
                  <span className="text-label-sm font-label-sm">Joined {STUDENT.joined}</span>
                </div>
                <div className="flex items-center gap-1 text-on-surface-variant">
                  <Icon name="location_on" className="text-[18px]" />
                  <span className="text-label-sm font-label-sm">{STUDENT.location}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-64 h-24 flex flex-col justify-end shrink-0">
            <p className="font-label-sm text-label-sm mb-2 text-on-surface-variant">Performance Trend (Last 6 Mos)</p>
            <div className="flex items-end justify-between h-full w-full gap-1">
              {TREND_BARS.map((bar, i) => (
                <div key={i} className={`w-full ${bar.tone} rounded-t-sm`} style={{ height: `${bar.height}%` }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-md">
        <div className="md:col-span-5 bg-surface-container-lowest p-md rounded-xl border border-outline-variant/40 shadow-sm">
          <div className="flex items-center justify-between mb-md">
            <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
              <Icon name="warning" className="text-error" />
              Historical Alerts
            </h3>
            <span className="text-label-sm font-label-sm bg-error-container text-on-error-container px-2 py-1 rounded">
              {ALERTS.length} Active
            </span>
          </div>
          <div className="space-y-4">
            {ALERTS.map((alert) => (
              <div
                key={alert.title}
                className={
                  alert.severity === 'high'
                    ? 'p-4 bg-error-container/20 rounded-lg border-l-4 border-error transition-colors hover:bg-error-container/30'
                    : 'p-4 bg-surface-container rounded-lg border-l-4 border-primary transition-colors hover:bg-surface-container-high'
                }
              >
                <div className="flex justify-between items-start mb-1 gap-2">
                  <span className={`font-label-md text-label-md ${alert.severity === 'high' ? 'text-error' : 'text-primary'}`}>
                    {alert.title}
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant shrink-0">{alert.time}</span>
                </div>
                <p className="text-body-md font-body-md text-on-surface">{alert.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-7 flex flex-col gap-6">
          <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant/40 shadow-sm flex-grow">
            <div className="flex items-center justify-between mb-md gap-4">
              <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
                <Icon name="history_edu" className="text-primary" />
                Intervention Log
              </h3>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-primary text-on-primary px-4 py-2 rounded-full font-label-md text-label-md flex items-center gap-2 active:scale-95 transition-transform hover:shadow-md"
              >
                <Icon name="add" className="text-[20px]" />
                New Intervention
              </button>
            </div>
            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
              {log.map((entry, i) => {
                const style = TYPE_STYLES[entry.type]
                return (
                  <div key={entry.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${style.badge}`}>
                        <Icon name={style.icon} className="text-[18px]" />
                      </div>
                      {i < log.length - 1 && <div className="w-0.5 flex-1 bg-outline-variant mt-2" />}
                    </div>
                    <div className="pb-6">
                      <h4 className="font-label-md text-label-md text-primary">{style.title}</h4>
                      <p className="font-label-sm text-label-sm text-on-surface-variant mb-2">
                        Logged by Kwame Mensah &bull; {entry.date}
                      </p>
                      <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/40">
                        <p className="text-body-md font-body-md text-on-surface">{entry.notes}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-xl overflow-hidden">
            <div className="p-md border-b border-outline-variant/40 flex justify-between items-center bg-surface-container-high">
              <h3 className="font-headline-md text-headline-md text-primary">New Intervention</h3>
              <button className="text-on-surface-variant hover:text-primary transition-colors" onClick={closeModal}>
                <Icon name="close" />
              </button>
            </div>
            <form className="p-md space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-2">Intervention Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {TYPES.map((t) => (
                    <label key={t.value} className="cursor-pointer">
                      <input
                        className="hidden peer"
                        name="type"
                        type="radio"
                        value={t.value}
                        checked={form.type === t.value}
                        onChange={() => setForm((f) => ({ ...f, type: t.value }))}
                      />
                      <div
                        className={
                          form.type === t.value
                            ? 'flex flex-col items-center justify-center p-3 border border-primary bg-primary-container text-on-primary-container rounded-xl transition-all'
                            : 'flex flex-col items-center justify-center p-3 border border-outline-variant rounded-xl text-on-surface-variant hover:bg-surface-container transition-all'
                        }
                      >
                        <Icon name={t.icon} className="mb-1" />
                        <span className="text-label-sm">{t.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-2">Intervention Notes</label>
                <textarea
                  className="w-full h-32 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary bg-surface-container-lowest p-3 font-body-md text-body-md outline-none transition-shadow"
                  placeholder="Describe the outcome or next steps..."
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                />
              </div>
              <div className="flex gap-4 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-primary text-on-primary font-bold rounded-full hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-95"
                >
                  Save Log Entry
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 border border-primary text-primary font-bold rounded-full hover:bg-surface-variant transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
