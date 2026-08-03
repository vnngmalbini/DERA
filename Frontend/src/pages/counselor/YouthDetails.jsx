import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
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

function initialsFor(name) {
  if (!name) return '?'
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
}

function formatDate(dateString) {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
}

export default function YouthDetails() {
  const { youthId } = useParams()
  const [youth, setYouth] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

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

  const closeModal = () => {
    setIsModalOpen(false)
    setNotes('')
    setSubmitError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!notes.trim()) return
    setSubmitting(true)
    setSubmitError('')
    try {
      const assessment = await apiPost('/risk-assessments/', {
        youth: youthId,
        risk_score: youth.latest_risk_score ?? 50,
      })
      await apiPost('/interventions/', {
        assessment: assessment.id,
        recommendation: notes.trim(),
        status: 'pending',
      })
      closeModal()
      load()
    } catch {
      setSubmitError("Couldn't save that entry. Please try again.")
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

      <div className="grid grid-cols-1 md:grid-cols-12 gap-md">
        <div className="md:col-span-5 bg-surface-container-lowest p-md rounded-xl border border-outline-variant/40 shadow-sm">
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
            <div className="space-y-4">
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
            {allInterventions.length === 0 ? (
              <p className="text-on-surface-variant font-body-md text-body-md">No interventions logged yet.</p>
            ) : (
              <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
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
              {submitError && <p className="text-error font-body-md text-body-md">{submitError}</p>}
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                  Intervention Notes
                </label>
                <textarea
                  className="w-full h-32 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary bg-surface-container-lowest p-3 font-body-md text-body-md outline-none transition-shadow"
                  placeholder="Describe the outcome or next steps..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <div className="flex gap-4 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 bg-primary text-on-primary font-bold rounded-full hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-95 disabled:opacity-60"
                >
                  {submitting ? 'Saving…' : 'Save Log Entry'}
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
    </DashboardLayout>
  )
}
