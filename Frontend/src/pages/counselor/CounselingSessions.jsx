import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader'
import Icon from '../../components/ui/Icon'
import { apiGet, apiPost } from '../../services/apiClient'

const SESSION_TYPES = [
  { value: 'academic_checkin', label: 'Academic Check-in' },
  { value: 'home_visit', label: 'Home Visit' },
  { value: 'mentorship_pairing', label: 'Mentorship Pairing' },
  { value: 'crisis_support', label: 'Crisis Support' },
  { value: 'other', label: 'Other' },
]

const STATUS_STYLES = {
  upcoming: 'bg-secondary-container text-on-secondary-container',
  completed: 'bg-surface-container-highest text-on-surface-variant',
  cancelled: 'bg-error-container text-on-error-container',
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

export default function CounselingSessions() {
  const [sessions, setSessions] = useState([])
  const [roster, setRoster] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState({ youth: '', session_type: 'academic_checkin', scheduled_at: '', notes: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  function load() {
    setLoading(true)
    Promise.all([apiGet('/counseling-sessions/'), apiGet('/counselor-roster/')])
      .then(([sessionsData, rosterData]) => {
        setSessions(sessionsData.results ?? sessionsData)
        setRoster(rosterData)
      })
      .catch(() => setLoadError('Could not load counseling sessions right now.'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const closeModal = () => {
    setIsModalOpen(false)
    setForm({ youth: '', session_type: 'academic_checkin', scheduled_at: '', notes: '' })
    setSubmitError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.youth || !form.scheduled_at) return
    setSubmitting(true)
    setSubmitError('')
    try {
      await apiPost('/counseling-sessions/', {
        youth: form.youth,
        session_type: form.session_type,
        scheduled_at: new Date(form.scheduled_at).toISOString(),
        notes: form.notes.trim() || null,
      })
      closeModal()
      load()
    } catch {
      setSubmitError("Couldn't schedule that session. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DashboardLayout role="counselor">
      <DashboardPageHeader
        title="Counseling Sessions"
        description="Upcoming and past sessions with your assigned youth."
        action={
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded-full flex items-center gap-2 hover:shadow-lg active:scale-95 transition-all w-fit"
          >
            <Icon name="add" />
            Schedule Session
          </button>
        }
      />

      {loading ? (
        <p className="text-on-surface-variant">Loading…</p>
      ) : loadError ? (
        <p className="text-error">{loadError}</p>
      ) : sessions.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 shadow-sm p-xl text-center">
          <p className="text-on-surface-variant">No sessions scheduled yet.</p>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low border-b border-outline-variant/40 text-on-surface-variant font-label-md text-label-md">
                <tr>
                  <th className="px-6 py-4">Youth</th>
                  <th className="px-6 py-4">Session Type</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {sessions.map((s) => (
                  <tr key={s.id} className="hover:bg-surface-container transition-colors">
                    <td className="px-6 py-4 font-label-md text-label-md text-on-surface">{s.youth_name}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{s.session_type_display}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{formatDate(s.scheduled_at)}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{formatTime(s.scheduled_at)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full font-label-sm text-label-sm ${STATUS_STYLES[s.status]}`}>
                        {s.status_display}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-xl overflow-hidden">
            <div className="p-md border-b border-outline-variant/40 flex justify-between items-center bg-surface-container-high">
              <h3 className="font-headline-md text-headline-md text-primary">Schedule Session</h3>
              <button className="text-on-surface-variant hover:text-primary transition-colors" onClick={closeModal}>
                <Icon name="close" />
              </button>
            </div>
            <form className="p-md space-y-4" onSubmit={handleSubmit}>
              {submitError && <p className="text-error font-body-md text-body-md">{submitError}</p>}
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-2">Youth</label>
                <select
                  required
                  value={form.youth}
                  onChange={(e) => setForm((f) => ({ ...f, youth: e.target.value }))}
                  className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest p-3 font-body-md text-body-md outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="" disabled>
                    Select a youth
                  </option>
                  {roster.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.full_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-2">Session Type</label>
                <select
                  value={form.session_type}
                  onChange={(e) => setForm((f) => ({ ...f, session_type: e.target.value }))}
                  className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest p-3 font-body-md text-body-md outline-none focus:ring-2 focus:ring-primary"
                >
                  {SESSION_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-2">Date &amp; Time</label>
                <input
                  required
                  type="datetime-local"
                  value={form.scheduled_at}
                  onChange={(e) => setForm((f) => ({ ...f, scheduled_at: e.target.value }))}
                  className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest p-3 font-body-md text-body-md outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-2">Notes (optional)</label>
                <textarea
                  className="w-full h-24 rounded-xl border border-outline-variant bg-surface-container-lowest p-3 font-body-md text-body-md outline-none focus:ring-2 focus:ring-primary"
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                />
              </div>
              <div className="flex gap-4 pt-2">
                <button
                  type="submit"
                  disabled={submitting || roster.length === 0}
                  className="flex-1 py-3 bg-primary text-on-primary font-bold rounded-full hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-95 disabled:opacity-60"
                >
                  {submitting ? 'Scheduling…' : 'Schedule Session'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 border border-primary text-primary font-bold rounded-full hover:bg-surface-variant transition-all"
                >
                  Cancel
                </button>
              </div>
              {roster.length === 0 && (
                <p className="text-on-surface-variant font-label-sm text-label-sm">
                  You have no assigned youth to schedule a session with yet.
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
