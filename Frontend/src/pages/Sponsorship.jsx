import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import { useAuth } from '../context/AuthContext'
import { apiGet, apiPost, ApiError } from '../services/apiClient'

const INITIAL_FORM = {
  academicProfile: '',
  reason: '',
  terms: false,
}

const ELIGIBILITY_POINTS = [
  'You are a young person who needs help paying for an official education or application form.',
  'The form is listed in the DERA Forms Marketplace and the fee is confirmed by the institution.',
  'You can provide accurate academic information and explain why financial support is needed.',
  'You agree that DERA may review your request and share only the necessary details with a vetted sponsor.',
]

export default function Sponsorship() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const formId = searchParams.get('form')
  const isEligibilityView = !formId
  const { isLoggedIn, user, loading: authLoading } = useAuth()

  const [applicationForm, setApplicationForm] = useState(null)
  const [loadError, setLoadError] = useState('')
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [submitted, setSubmitted] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [story, setStory] = useState(null)

  useEffect(() => {
    if (!formId) return
    apiGet(`/application-forms/${formId}/`)
      .then(setApplicationForm)
      .catch(() => setLoadError('Could not load this application form.'))
  }, [formId])

  useEffect(() => {
    apiGet('/stories/')
      .then((data) => {
        const stories = data.results ?? data
        if (stories.length > 0) setStory(stories[Math.floor(Math.random() * stories.length)])
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!submitted) return undefined
    const timer = setTimeout(() => setModalVisible(true), 10)
    return () => clearTimeout(timer)
  }, [submitted])

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setModalVisible(false)
        setSubmitted(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (authLoading) return null
  if (!isLoggedIn && !isEligibilityView) return <Navigate to="/login" replace />
  if (isLoggedIn && user.role !== 'youth') {
    return (
      <>
        <div className="min-h-[60vh] flex items-center justify-center px-margin-mobile text-center">
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">
            Only youth accounts can request form sponsorships. If you'd like to fund a request instead, visit the
            donor dashboard.
          </p>
        </div>
      </>
    )
  }

  function handleChange(e) {
    const { id, value, type, checked } = e.target
    setFormData((prev) => ({ ...prev, [id]: type === 'checkbox' ? checked : value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (submitting) return
    setErrorMessage('')
    setSubmitting(true)
    try {
      // Note: academicProfile/reason are collected for the review process
      // but there's no field on FormOrder to persist free-text narrative
      // yet (schema gap) — only the structured order itself is recorded.
      await apiPost('/form-orders/', { form: formId, order_type: 'sponsorship_request' })
      setSubmitted(true)
    } catch (err) {
      setErrorMessage(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  function handleReturnToDashboard() {
    setModalVisible(false)
    setSubmitted(false)
    setFormData(INITIAL_FORM)
    navigate('/')
  }

  return (
    <>
      {/* Hero Section / Encouragement */}
        <section className="relative overflow-hidden pt-lg pb-xl px-margin-mobile md:px-margin-desktop bg-primary-container text-on-primary">
          <div className="max-w-[800px] mx-auto text-center relative z-10">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-secondary-container text-on-secondary-container mb-md">
              <Icon name="volunteer_activism" filled />
            </div>
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg mb-sm">
              Empowering Your Dreams
            </h1>
            <p className="font-body-lg text-body-lg text-on-primary-container max-w-[600px] mx-auto">
              Don&apos;t let the cost of a form stop your future. Our sponsors are here to help students with
              potential.
            </p>
          </div>
        </section>

        {/* Application Form Content */}
        <section className="px-margin-mobile md:px-margin-desktop -mt-12 relative z-20">
          <div className="max-w-[800px] mx-auto">
            {!formId ? (
              <div className="space-y-md">
                <div className="bg-surface-container-lowest rounded-xl p-md md:p-lg border border-outline-variant/30 shadow-[0px_4px_20px_rgba(13,31,8,0.05)]">
                <div className="w-16 h-16 mx-auto bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center">
                  <Icon name="volunteer_activism" filled className="text-3xl" />
                </div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">How Sponsorship Works</h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-lg mx-auto">
                  Browse the Forms Marketplace, pick the application form you need help paying for, then choose
                  &quot;Apply for Sponsorship&quot; on that form. Tell us about your academic background and why you
                  need support, and a vetted sponsor can cover the fee directly.
                </p>
                <Link
                  to="/forms"
                  className="inline-flex items-center justify-center gap-2 bg-secondary-container text-on-secondary-container font-label-lg text-label-lg py-3 px-8 rounded-full shadow-sm hover:bg-secondary hover:text-on-secondary transition-all"
                >
                  Browse Forms to Apply
                  <Icon name="arrow_forward" />
                </Link>
                </div>

                <div className="bg-secondary-container/25 rounded-xl p-md md:p-lg border border-secondary/20 text-left">
                  <div className="flex items-start gap-3 mb-4">
                    <Icon name="fact_check" className="text-secondary text-2xl shrink-0" />
                    <div>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface">Check your eligibility first</h2>
                      <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                        Review these requirements before choosing a form. Meeting them does not guarantee funding, but it helps you submit a complete request.
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {ELIGIBILITY_POINTS.map((point) => (
                      <li key={point} className="flex items-start gap-3">
                        <Icon name="check_circle" className="text-secondary text-xl mt-0.5 shrink-0" filled />
                        <span className="font-body-md text-body-md text-on-surface">{point}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-4">
                    Not sure if you qualify? Use the DERA Guide button or contact the Help Centre before applying.
                  </p>
                </div>
              </div>
            ) : (
            <div className="bg-surface-container-lowest rounded-xl p-md md:p-lg border border-outline-variant/30 shadow-[0px_4px_20px_rgba(13,31,8,0.05)]">
              <form className="space-y-gutter" onSubmit={handleSubmit}>
                <div className="bg-secondary-container/25 rounded-xl p-md border border-secondary/20 text-left">
                  <div className="flex items-start gap-3">
                    <Icon name="fact_check" className="text-secondary text-2xl shrink-0" />
                    <div>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface">Eligibility reminder</h2>
                      <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                        Before submitting, confirm that you need help with an official form, can provide accurate academic details, and can explain your financial need. Requests are reviewed individually.
                      </p>
                    </div>
                  </div>
                </div>
                {/* Header Information */}
                <div className="border-b border-outline-variant pb-md">
                  <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
                    <Icon name="assignment" className="text-secondary" />
                    Sponsorship Application
                  </h2>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
                    Please provide accurate details to help our reviewers understand your situation.
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-md rounded-lg bg-error-container flex items-start gap-2">
                    <span className="material-symbols-outlined text-on-error-container text-[20px]">error</span>
                    <p className="font-body-md text-body-md text-on-error-container">{errorMessage}</p>
                  </div>
                )}

                {/* Selected form context */}
                <div className="space-y-xs">
                  <span className="font-label-lg text-label-lg text-on-surface-variant">Applying for</span>
                  {loadError ? (
                    <p className="text-error font-label-md text-label-md">{loadError}</p>
                  ) : !applicationForm ? (
                    <p className="text-on-surface-variant font-label-md text-label-md">Loading…</p>
                  ) : (
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-surface-container-low border border-outline-variant/30">
                      <Icon name="account_balance" className="text-secondary" />
                      <div>
                        <p className="font-label-lg text-label-lg text-on-surface">{applicationForm.title}</p>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">
                          {applicationForm.institution?.name}
                          {applicationForm.price_ghs !== null && applicationForm.price_ghs !== undefined
                            ? ` · GHS ${Number(applicationForm.price_ghs).toFixed(2)}`
                            : ' · Fee to be confirmed with sponsor'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Grid for inputs */}
                <div className="grid grid-cols-1 gap-gutter">
                  {/* Academic Profile */}
                  <div className="space-y-xs">
                    <label className="font-label-lg text-label-lg text-on-surface-variant" htmlFor="academicProfile">
                      Academic Profile (WASSCE Grades)
                    </label>
                    <div className="relative">
                      <Icon name="school" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
                      <input
                        id="academicProfile"
                        type="text"
                        required
                        placeholder="e.g. 7As, 2Bs in WASSCE 2023"
                        value={formData.academicProfile}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 rounded-lg border border-outline-variant focus:border-secondary-fixed focus:ring-2 focus:ring-secondary-fixed/20 bg-surface outline-none transition-all font-body-md text-body-md"
                      />
                    </div>
                  </div>

                  {/* Reason for Need */}
                  <div className="space-y-xs">
                    <label className="font-label-lg text-label-lg text-on-surface-variant" htmlFor="reason">
                      Reason for Need
                    </label>
                    <textarea
                      id="reason"
                      rows={4}
                      required
                      placeholder="Tell us why you need this sponsorship and your career goals..."
                      value={formData.reason}
                      onChange={handleChange}
                      className="w-full p-4 rounded-lg border border-outline-variant focus:border-secondary-fixed focus:ring-2 focus:ring-secondary-fixed/20 bg-surface outline-none transition-all font-body-md text-body-md"
                    />
                    <p className="text-xs text-on-surface-variant/70 italic">
                      Maximum 500 words. Focus on your financial constraints and passion for learning.
                    </p>
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-start gap-3 p-4 rounded-lg bg-surface-container-low border border-outline-variant/30">
                  <input
                    id="terms"
                    type="checkbox"
                    required
                    checked={formData.terms}
                    onChange={handleChange}
                    className="mt-1 rounded border-outline-variant text-secondary focus:ring-secondary"
                  />
                  <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="terms">
                    I certify that the information provided is true. I understand that misrepresentation will lead
                    to immediate disqualification and potential blacklisting from future DERA programs.
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col md:flex-row gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={submitting || !applicationForm}
                    className="flex-1 bg-secondary-container text-on-secondary-container font-headline-sm text-label-lg py-4 px-lg rounded-lg shadow-sm hover:bg-secondary hover:text-on-secondary active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
                  >
                    {submitting ? 'Submitting...' : 'Submit Application'}
                    <Icon name="send" className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="md:w-auto px-lg py-4 border border-outline text-on-surface-variant rounded-lg font-label-lg text-label-lg hover:bg-surface-variant/50 transition-colors flex items-center justify-center gap-2"
                  >
                    Back
                  </button>
                </div>
              </form>
            </div>
            )}

            {/* Testimonial/Side Note Card */}
            <div className={`mt-lg grid grid-cols-1 gap-gutter ${story ? 'md:grid-cols-2' : ''}`}>
              {story && (
                <div className="bg-secondary/10 p-md rounded-xl flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-secondary-container flex items-center justify-center">
                    {story.photo ? (
                      <img className="w-full h-full object-cover" alt={story.title} src={story.photo} loading="lazy" decoding="async" />
                    ) : (
                      <Icon name="person" className="text-secondary text-2xl" />
                    )}
                  </div>
                  <div>
                    <p className="font-body-md text-on-surface italic line-clamp-3">&quot;{story.narrative}&quot;</p>
                    {story.speaker_name && (
                      <p className="font-label-sm text-secondary font-bold">— {story.speaker_name}</p>
                    )}
                  </div>
                </div>
              )}
              <div className="bg-surface-container-high p-md rounded-xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-secondary">
                  <Icon name="verified_user" filled />
                </div>
                <div>
                  <h4 className="font-label-lg text-label-lg text-on-surface">Secure &amp; Confidential</h4>
                  <p className="font-label-sm text-on-surface-variant">
                    Your personal story is safe with us and only shared with vetted sponsors.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

      {/* Success Modal */}
      {submitted && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-margin-mobile">
          <div className="absolute inset-0 bg-inverse-surface/60 backdrop-blur-sm" />
          <div
            className={`relative bg-surface rounded-xl p-lg max-w-[500px] w-full text-center shadow-2xl transition-all duration-300 ${
              modalVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
          >
            <div className="w-20 h-20 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center mx-auto mb-md">
              <Icon name="check_circle" className="text-[48px]" filled />
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-sm">Application Received!</h3>
            <p className="font-body-md text-on-surface-variant mb-lg">
              Your sponsorship request has been submitted successfully. We will review your profile and notify you
              via email within 3-5 business days.
            </p>
            <button
              onClick={handleReturnToDashboard}
              className="w-full bg-secondary text-on-secondary py-3 px-6 rounded-lg font-label-lg text-label-lg hover:shadow-lg transition-shadow"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      )}
    </>
  )
}
