import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Modal from '../../components/ui/Modal'
import Icon from '../../components/ui/Icon'
import { apiGet, apiPost } from '../../services/apiClient'

const EDUCATION_LEVEL_LABELS = {
  primary: 'Primary',
  jhs: 'JHS',
  shs: 'SHS',
  shs_graduate: 'SHS Graduate',
  tertiary: 'Tertiary',
  dropout_re_entry: 'Dropout Re-entry',
  teen_mother_program: 'Teen Mother Program',
}

const RISK_INDICATOR_LABELS = {
  academic_decline: 'Academic Decline',
  absenteeism: 'Absenteeism',
  financial_distress: 'Financial Distress',
  behavioural_change: 'Behavioural Change',
}

const INTERVENTION_STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
]

const EMPTY_INDICATOR = { category: '', description: '', weight: '' }

function initialsFor(name) {
  if (!name) return '?'
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
}

function formatDate(dateString) {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
}

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

const inputClass =
  'w-full rounded-xl border border-outline-variant bg-surface-container-lowest p-3 font-body-md text-body-md outline-none focus:ring-2 focus:ring-primary'
const labelClass = 'block font-label-md text-label-md text-on-surface-variant mb-2'
const logButtonClass =
  'bg-secondary-container text-on-secondary-container px-4 py-2 rounded-full font-label-md text-label-md flex items-center gap-2 active:scale-95 transition-all hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none'

export default function YouthDetails() {
  const { youthId } = useParams()
  const [youth, setYouth] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const [activeModal, setActiveModal] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const [riskForm, setRiskForm] = useState({ risk_score: '', indicators: [EMPTY_INDICATOR] })
  const [interventionForm, setInterventionForm] = useState({ assessment: '', recommendation: '', status: 'pending' })
  const [attendanceForm, setAttendanceForm] = useState({ date: todayISO(), present: true })
  const [academicForm, setAcademicForm] = useState({ subject: '', score: '', recorded_at: todayISO() })

  function load() {
    setLoading(true)
    apiGet(`/counselor-roster/${youthId}/`)
      .then(setYouth)
      .catch(() => setLoadError("Could not load this youth's record."))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [youthId])

  function openModal(type) {
    setSubmitError('')
    if (type === 'risk') setRiskForm({ risk_score: '', indicators: [EMPTY_INDICATOR] })
    if (type === 'intervention') {
      setInterventionForm({ assessment: youth?.risk_assessments[0]?.id || '', recommendation: '', status: 'pending' })
    }
    if (type === 'attendance') setAttendanceForm({ date: todayISO(), present: true })
    if (type === 'academic') setAcademicForm({ subject: '', score: '', recorded_at: todayISO() })
    setActiveModal(type)
  }

  function closeModal() {
    setActiveModal(null)
    setSubmitError('')
  }

  function updateIndicatorRow(index, field, value) {
    setRiskForm((f) => ({
      ...f,
      indicators: f.indicators.map((ind, i) => (i === index ? { ...ind, [field]: value } : ind)),
    }))
  }

  function addIndicatorRow() {
    setRiskForm((f) => ({ ...f, indicators: [...f.indicators, EMPTY_INDICATOR] }))
  }

  function removeIndicatorRow(index) {
    setRiskForm((f) => ({ ...f, indicators: f.indicators.filter((_, i) => i !== index) }))
  }

  async function handleRiskSubmit(e) {
    e.preventDefault()
    if (riskForm.risk_score === '') return
    setSubmitting(true)
    setSubmitError('')
    try {
      const assessment = await apiPost('/risk-assessments/', {
        youth: youthId,
        risk_score: Number(riskForm.risk_score),
      })
      const filledIndicators = riskForm.indicators.filter((ind) => ind.category)
      for (const ind of filledIndicators) {
        await apiPost('/risk-indicators/', {
          assessment: assessment.id,
          category: ind.category,
          description: ind.description.trim() || null,
          weight: ind.weight === '' ? 0 : Number(ind.weight),
        })
      }
      closeModal()
      load()
    } catch {
      setSubmitError("Couldn't save that assessment. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleInterventionSubmit(e) {
    e.preventDefault()
    if (!interventionForm.assessment || !interventionForm.recommendation.trim()) return
    setSubmitting(true)
    setSubmitError('')
    try {
      await apiPost('/interventions/', {
        assessment: interventionForm.assessment,
        recommendation: interventionForm.recommendation.trim(),
        status: interventionForm.status,
      })
      closeModal()
      load()
    } catch {
      setSubmitError("Couldn't save that intervention. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleAttendanceSubmit(e) {
    e.preventDefault()
    if (!attendanceForm.date) return
    setSubmitting(true)
    setSubmitError('')
    try {
      await apiPost('/attendance-records/', {
        youth: youthId,
        date: attendanceForm.date,
        present: attendanceForm.present,
      })
      closeModal()
      load()
    } catch {
      setSubmitError("Couldn't save that attendance record. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleAcademicSubmit(e) {
    e.preventDefault()
    if (!academicForm.subject.trim() || academicForm.score === '' || !academicForm.recorded_at) return
    setSubmitting(true)
    setSubmitError('')
    try {
      await apiPost('/academic-records/', {
        youth: youthId,
        subject: academicForm.subject.trim(),
        score: Number(academicForm.score),
        recorded_at: academicForm.recorded_at,
      })
      closeModal()
      load()
    } catch {
      setSubmitError("Couldn't save that academic record. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout role="counselor">
        <p className="text-on-surface-variant">Loading…</p>
      </DashboardLayout>
    )
  }

  if (loadError || !youth) {
    return (
      <DashboardLayout role="counselor">
        <p className="text-error">{loadError || 'Youth not found.'}</p>
      </DashboardLayout>
    )
  }

  const allIndicators = youth.risk_assessments
    .flatMap((a) => a.indicators.map((ind) => ({ ...ind, assessed_at: a.assessed_at })))
    .sort((a, b) => new Date(b.assessed_at) - new Date(a.assessed_at))

  const allInterventions = youth.risk_assessments
    .flatMap((a) => a.interventions.map((iv) => ({ ...iv, assessed_at: a.assessed_at })))
    .sort((a, b) => new Date(b.assessed_at) - new Date(a.assessed_at))

  const hasAssessments = youth.risk_assessments.length > 0

  return (
    <DashboardLayout role="counselor">
      <section className="mb-lg">
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between bg-surface-container-lowest border border-outline-variant/40 p-md rounded-xl shadow-sm">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-primary-container flex items-center justify-center text-on-primary-container font-headline-lg text-headline-lg shrink-0">
              {initialsFor(youth.full_name)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h2 className="font-headline-lg text-headline-lg text-primary">{youth.full_name}</h2>
                {youth.education_level && (
                  <span className="bg-secondary-fixed text-on-secondary-fixed px-3 py-0.5 rounded-full font-label-sm text-label-sm">
                    {EDUCATION_LEVEL_LABELS[youth.education_level] || youth.education_level}
                  </span>
                )}
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Risk Level:{' '}
                <span className={youth.risk_level ? 'text-error font-bold' : 'font-bold'}>
                  {youth.risk_level || 'Not yet assessed'}
                </span>
              </p>
              <div className="flex gap-4 mt-3 flex-wrap">
                {youth.institution_name && (
                  <div className="flex items-center gap-1 text-on-surface-variant">
                    <Icon name="school" className="text-[18px]" />
                    <span className="text-label-sm font-label-sm">{youth.institution_name}</span>
                  </div>
                )}
                {(youth.region || youth.district) && (
                  <div className="flex items-center gap-1 text-on-surface-variant">
                    <Icon name="location_on" className="text-[18px]" />
                    <span className="text-label-sm font-label-sm">
                      {[youth.district, youth.region].filter(Boolean).join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="w-full md:w-64 shrink-0 text-right">
            <p className="font-label-sm text-label-sm mb-1 text-on-surface-variant">Attendance (30d)</p>
            <p className="font-headline-lg text-headline-lg text-on-surface">
              {youth.attendance_rate_30d !== null ? `${youth.attendance_rate_30d}%` : '—'}
            </p>
          </div>
        </div>
      </section>

      <section className="mb-lg bg-surface-container-lowest border border-outline-variant/40 rounded-xl shadow-sm p-md">
        <h3 className="font-headline-md text-headline-md text-on-surface mb-1 flex items-center gap-2">
          <Icon name="edit_note" className="text-primary" />
          Log New Data
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant mb-md">
          Record a new risk assessment, intervention, attendance entry, or academic score for {youth.full_name}.
        </p>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => openModal('risk')} className={logButtonClass}>
            <Icon name="warning" className="text-[20px]" />
            Log Risk Assessment
          </button>
          <button onClick={() => openModal('intervention')} disabled={!hasAssessments} className={logButtonClass}>
            <Icon name="history_edu" className="text-[20px]" />
            Log Intervention
          </button>
          <button onClick={() => openModal('attendance')} className={logButtonClass}>
            <Icon name="event_available" className="text-[20px]" />
            Log Attendance
          </button>
          <button onClick={() => openModal('academic')} className={logButtonClass}>
            <Icon name="school" className="text-[20px]" />
            Log Academic Record
          </button>
        </div>
        {!hasAssessments && (
          <p className="font-label-sm text-label-sm text-on-surface-variant mt-3">
            Log a risk assessment first to unlock intervention logging.
          </p>
        )}
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant/40 shadow-sm">
          <div className="flex items-center justify-between mb-md">
            <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
              <Icon name="warning" className="text-error" />
              Risk Indicators
            </h3>
            {allIndicators.length > 0 && (
              <span className="text-label-sm font-label-sm bg-error-container text-on-error-container px-2 py-1 rounded">
                {allIndicators.length}
              </span>
            )}
          </div>
          {allIndicators.length === 0 ? (
            <p className="text-on-surface-variant font-body-md text-body-md">No risk indicators recorded yet.</p>
          ) : (
            <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2">
              {allIndicators.map((ind) => (
                <div key={ind.id} className="p-4 bg-error-container/20 rounded-lg border-l-4 border-error">
                  <div className="flex justify-between items-start mb-1 gap-2">
                    <span className="font-label-md text-label-md text-error">
                      {RISK_INDICATOR_LABELS[ind.category] || ind.category}
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant shrink-0">
                      {formatDate(ind.assessed_at)}
                    </span>
                  </div>
                  {ind.description && <p className="text-body-md font-body-md text-on-surface">{ind.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant/40 shadow-sm">
          <h3 className="font-headline-md text-headline-md text-on-surface mb-md flex items-center gap-2">
            <Icon name="history_edu" className="text-primary" />
            Intervention Log
          </h3>
          {allInterventions.length === 0 ? (
            <p className="text-on-surface-variant font-body-md text-body-md">No interventions logged yet.</p>
          ) : (
            <div className="space-y-6 max-h-[320px] overflow-y-auto pr-2">
              {allInterventions.map((entry, i) => (
                <div key={entry.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-primary-container text-on-primary-container">
                      <Icon name="history_edu" className="text-[18px]" />
                    </div>
                    {i < allInterventions.length - 1 && <div className="w-0.5 flex-1 bg-outline-variant mt-2" />}
                  </div>
                  <div className="pb-6">
                    <h4 className="font-label-md text-label-md text-primary capitalize">
                      {entry.status.replace('_', ' ')}
                    </h4>
                    <p className="font-label-sm text-label-sm text-on-surface-variant mb-2">
                      {formatDate(entry.assessed_at)}
                    </p>
                    <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/40">
                      <p className="text-body-md font-body-md text-on-surface">{entry.recommendation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant/40 shadow-sm">
          <h3 className="font-headline-md text-headline-md text-on-surface mb-md flex items-center gap-2">
            <Icon name="event_available" className="text-primary" />
            Attendance History
          </h3>
          {youth.attendance_records.length === 0 ? (
            <p className="text-on-surface-variant font-body-md text-body-md">No attendance recorded yet.</p>
          ) : (
            <ul className="space-y-1 max-h-[320px] overflow-y-auto pr-2">
              {youth.attendance_records.map((rec) => (
                <li
                  key={rec.id}
                  className="flex items-center justify-between py-2 border-b border-outline-variant/20 last:border-0"
                >
                  <span className="font-body-md text-body-md text-on-surface">{formatDate(rec.date)}</span>
                  <span
                    className={`px-3 py-1 rounded-full font-label-sm text-label-sm ${
                      rec.present
                        ? 'bg-secondary-container text-on-secondary-container'
                        : 'bg-error-container text-on-error-container'
                    }`}
                  >
                    {rec.present ? 'Present' : 'Absent'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant/40 shadow-sm">
          <h3 className="font-headline-md text-headline-md text-on-surface mb-md flex items-center gap-2">
            <Icon name="school" className="text-primary" />
            Academic Records
          </h3>
          {youth.academic_records.length === 0 ? (
            <p className="text-on-surface-variant font-body-md text-body-md">No academic records logged yet.</p>
          ) : (
            <div className="overflow-x-auto max-h-[320px] overflow-y-auto">
              <table className="w-full text-left">
                <thead className="text-on-surface-variant font-label-md text-label-md border-b border-outline-variant/40">
                  <tr>
                    <th className="py-2 pr-4">Subject</th>
                    <th className="py-2 pr-4">Score</th>
                    <th className="py-2">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {youth.academic_records.map((rec) => (
                    <tr key={rec.id}>
                      <td className="py-2 pr-4 text-on-surface">{rec.subject}</td>
                      <td className="py-2 pr-4 text-on-surface-variant">{rec.score}</td>
                      <td className="py-2 text-on-surface-variant">{formatDate(rec.recorded_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Modal open={activeModal === 'risk'} onClose={closeModal} title="Log Risk Assessment">
        <form className="space-y-4" onSubmit={handleRiskSubmit}>
          {submitError && <p className="text-error font-body-md text-body-md">{submitError}</p>}
          <div>
            <label className={labelClass}>Risk Score (0–100)</label>
            <input
              required
              type="number"
              min="0"
              max="100"
              value={riskForm.risk_score}
              onChange={(e) => setRiskForm((f) => ({ ...f, risk_score: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={labelClass}>Risk Indicators (optional)</label>
              <button
                type="button"
                onClick={addIndicatorRow}
                className="text-primary font-label-sm text-label-sm flex items-center gap-1"
              >
                <Icon name="add" className="text-[16px]" />
                Add indicator
              </button>
            </div>
            <div className="space-y-3">
              {riskForm.indicators.map((ind, i) => (
                <div key={i} className="p-3 rounded-xl border border-outline-variant/40 space-y-2">
                  <div className="flex gap-2">
                    <select
                      value={ind.category}
                      onChange={(e) => updateIndicatorRow(i, 'category', e.target.value)}
                      className="flex-1 rounded-lg border border-outline-variant bg-surface-container-lowest p-2 font-body-md text-body-md outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">No category</option>
                      {Object.entries(RISK_INDICATOR_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="Weight"
                      value={ind.weight}
                      onChange={(e) => updateIndicatorRow(i, 'weight', e.target.value)}
                      className="w-24 rounded-lg border border-outline-variant bg-surface-container-lowest p-2 font-body-md text-body-md outline-none focus:ring-2 focus:ring-primary"
                    />
                    {riskForm.indicators.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeIndicatorRow(i)}
                        aria-label="Remove indicator"
                        className="text-on-surface-variant hover:text-error transition-colors"
                      >
                        <Icon name="close" className="text-[18px]" />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Description (optional)"
                    value={ind.description}
                    onChange={(e) => updateIndicatorRow(i, 'description', e.target.value)}
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest p-2 font-body-md text-body-md outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 bg-primary text-on-primary font-bold rounded-full hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-95 disabled:opacity-60"
            >
              {submitting ? 'Saving…' : 'Save Assessment'}
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
      </Modal>

      <Modal open={activeModal === 'intervention'} onClose={closeModal} title="Log Intervention">
        <form className="space-y-4" onSubmit={handleInterventionSubmit}>
          {submitError && <p className="text-error font-body-md text-body-md">{submitError}</p>}
          <div>
            <label className={labelClass}>Risk Assessment</label>
            <select
              required
              value={interventionForm.assessment}
              onChange={(e) => setInterventionForm((f) => ({ ...f, assessment: e.target.value }))}
              className={inputClass}
            >
              <option value="" disabled>
                Select an assessment
              </option>
              {youth.risk_assessments.map((a) => (
                <option key={a.id} value={a.id}>
                  {formatDate(a.assessed_at)} — Score {a.risk_score}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select
              value={interventionForm.status}
              onChange={(e) => setInterventionForm((f) => ({ ...f, status: e.target.value }))}
              className={inputClass}
            >
              {INTERVENTION_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Intervention Notes</label>
            <textarea
              required
              className="w-full h-32 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary bg-surface-container-lowest p-3 font-body-md text-body-md outline-none transition-shadow"
              placeholder="Describe the outcome or next steps..."
              value={interventionForm.recommendation}
              onChange={(e) => setInterventionForm((f) => ({ ...f, recommendation: e.target.value }))}
            />
          </div>
          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 bg-primary text-on-primary font-bold rounded-full hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-95 disabled:opacity-60"
            >
              {submitting ? 'Saving…' : 'Save Intervention'}
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
      </Modal>

      <Modal open={activeModal === 'attendance'} onClose={closeModal} title="Log Attendance">
        <form className="space-y-4" onSubmit={handleAttendanceSubmit}>
          {submitError && <p className="text-error font-body-md text-body-md">{submitError}</p>}
          <div>
            <label className={labelClass}>Date</label>
            <input
              required
              type="date"
              value={attendanceForm.date}
              onChange={(e) => setAttendanceForm((f) => ({ ...f, date: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setAttendanceForm((f) => ({ ...f, present: true }))}
                className={`flex-1 py-3 rounded-xl font-label-md text-label-md border-2 transition-colors ${
                  attendanceForm.present
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-outline-variant/40 text-on-surface-variant'
                }`}
              >
                Present
              </button>
              <button
                type="button"
                onClick={() => setAttendanceForm((f) => ({ ...f, present: false }))}
                className={`flex-1 py-3 rounded-xl font-label-md text-label-md border-2 transition-colors ${
                  !attendanceForm.present
                    ? 'border-error bg-error/5 text-error'
                    : 'border-outline-variant/40 text-on-surface-variant'
                }`}
              >
                Absent
              </button>
            </div>
          </div>
          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 bg-primary text-on-primary font-bold rounded-full hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-95 disabled:opacity-60"
            >
              {submitting ? 'Saving…' : 'Save Attendance'}
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
      </Modal>

      <Modal open={activeModal === 'academic'} onClose={closeModal} title="Log Academic Record">
        <form className="space-y-4" onSubmit={handleAcademicSubmit}>
          {submitError && <p className="text-error font-body-md text-body-md">{submitError}</p>}
          <div>
            <label className={labelClass}>Subject</label>
            <input
              required
              type="text"
              placeholder="e.g. Mathematics"
              value={academicForm.subject}
              onChange={(e) => setAcademicForm((f) => ({ ...f, subject: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Score (0–100)</label>
            <input
              required
              type="number"
              min="0"
              max="100"
              value={academicForm.score}
              onChange={(e) => setAcademicForm((f) => ({ ...f, score: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Date</label>
            <input
              required
              type="date"
              value={academicForm.recorded_at}
              onChange={(e) => setAcademicForm((f) => ({ ...f, recorded_at: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 bg-primary text-on-primary font-bold rounded-full hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-95 disabled:opacity-60"
            >
              {submitting ? 'Saving…' : 'Save Record'}
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
      </Modal>
    </DashboardLayout>
  )
}
