import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import { useAuth } from '../context/AuthContext'
import { apiGet, apiPost, ApiError } from '../services/apiClient'

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Scholarships', to: '/scholarships' },
  { label: 'Career', to: '/career-quiz' },
  { label: 'Help', to: '/help' },
]

const BOTTOM_NAV = [
  { label: 'Home', to: '/', icon: 'home' },
  { label: 'Scholarships', to: '/scholarships', icon: 'school' },
  { label: 'Career', to: '/career-quiz', icon: 'work_history' },
  { label: 'Help', to: '/help', icon: 'help_center' },
]

function formatMomoNumber(raw) {
  const digits = raw.replace(/\D/g, '').substring(0, 10)
  let formatted = ''
  if (digits.length > 0) {
    formatted += digits.substring(0, 3)
    if (digits.length > 3) formatted += ' ' + digits.substring(3, 6)
    if (digits.length > 6) formatted += ' ' + digits.substring(6, 10)
  }
  return formatted
}

export default function PurchaseForm() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const formId = searchParams.get('form')
  const { isLoggedIn, user, loading: authLoading } = useAuth()

  const [applicationForm, setApplicationForm] = useState(null)
  const [loadError, setLoadError] = useState('')
  const [momoNumber, setMomoNumber] = useState('')
  const [status, setStatus] = useState('form') // form | processing | success | error
  const [errorMessage, setErrorMessage] = useState('')
  const [paidOrder, setPaidOrder] = useState(null)

  useEffect(() => {
    if (!formId) return
    apiGet(`/application-forms/${formId}/`)
      .then(setApplicationForm)
      .catch(() => setLoadError('Could not load this application form.'))
  }, [formId])

  if (authLoading) return null
  if (!isLoggedIn) return <Navigate to="/login" replace />
  if (user.role !== 'youth') {
    return (
      <div className="min-h-screen flex items-center justify-center px-margin-mobile text-center">
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">
          Only youth accounts can purchase application forms directly. If you'd like to support a student instead,
          visit the sponsorship dashboard.
        </p>
      </div>
    )
  }
  if (!formId) return <Navigate to="/forms" replace />

  const handleMomoChange = (e) => {
    setMomoNumber(formatMomoNumber(e.target.value))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (status === 'processing') return
    setStatus('processing')
    setErrorMessage('')
    try {
      const order = await apiPost('/form-orders/', { form: formId, order_type: 'direct_purchase' })
      const paid = await apiPost(`/form-orders/${order.id}/simulate-payment/`, { momo_number: momoNumber })
      setPaidOrder(paid)
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMessage(err instanceof ApiError ? err.message : 'Payment failed. Please try again.')
    }
  }

  const handleDone = () => {
    setStatus('form')
    setMomoNumber('')
    navigate('/forms')
  }

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      <header className="bg-surface shadow-[0px_4px_20px_rgba(13,31,8,0.05)] w-full top-0 sticky z-50">
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-base max-w-[1280px] mx-auto w-full">
          <Link to="/" className="flex items-center gap-xs">
            <Icon name="spa" className="text-secondary text-headline-md" filled />
            <h1 className="font-headline-md text-headline-md font-bold text-secondary tracking-tight">DERA</h1>
          </Link>
          <nav className="hidden md:flex gap-md">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-on-surface-variant font-medium hover:text-secondary transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-xs cursor-pointer active:opacity-80">
            <Icon name="account_circle" className="text-on-surface-variant" />
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center py-xl px-margin-mobile">
        <div className="max-w-[1000px] w-full grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          <div className="lg:col-span-5 flex flex-col gap-gutter">
            <div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(13,31,8,0.05)] p-md flex-grow border border-surface-variant/30">
              <div className="flex items-start justify-between mb-md">
                <div>
                  <h1 className="font-headline-sm text-headline-sm text-on-surface mb-xs">Payment Summary</h1>
                  <p className="font-body-md text-body-md text-on-surface-variant">Review your application selection</p>
                </div>
                <div className="p-sm bg-secondary-container rounded-lg">
                  <Icon name="receipt_long" className="text-on-secondary-container" />
                </div>
              </div>
              {loadError ? (
                <p className="text-error font-label-md text-label-md py-4">{loadError}</p>
              ) : !applicationForm ? (
                <p className="text-on-surface-variant font-label-md text-label-md py-4">Loading…</p>
              ) : (
                <>
                  <div className="space-y-sm">
                    <div className="flex justify-between items-center py-sm border-b border-surface-variant/50">
                      <span className="font-label-lg text-label-lg text-on-surface-variant">Institution</span>
                      <span className="font-label-lg text-label-lg text-on-surface font-bold">
                        {applicationForm.institution?.name ?? '—'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-sm border-b border-surface-variant/50">
                      <span className="font-label-lg text-label-lg text-on-surface-variant">Form</span>
                      <span className="font-label-lg text-label-lg text-on-surface font-bold">
                        {applicationForm.title}
                      </span>
                    </div>
                  </div>
                  <div className="mt-lg pt-md">
                    <div className="flex justify-between items-baseline">
                      <span className="font-body-md text-body-md text-on-surface">Total Amount</span>
                      <span className="font-headline-md text-headline-md text-secondary font-bold">
                        GHS {Number(applicationForm.price_ghs).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="bg-primary-container rounded-xl p-md text-on-primary shadow-lg overflow-hidden relative">
              <div className="relative z-10">
                <h3 className="font-headline-sm text-headline-sm mb-xs">Need help?</h3>
                <p className="font-body-md text-body-md opacity-80 mb-sm">
                  Contact our university admissions desk for any payment issues.
                </p>
                <Link to="/help" className="flex items-center gap-xs text-secondary-fixed-dim font-bold cursor-pointer">
                  <Icon name="support_agent" className="text-sm" />
                  <span className="font-label-lg text-label-lg">Open Live Chat</span>
                </Link>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <Icon name="school" className="text-[120px]" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-surface-container-lowest rounded-xl shadow-[0px_10px_40px_rgba(13,31,8,0.08)] p-lg border border-surface-variant/30 h-full">
              <div className="flex items-center gap-sm mb-lg">
                <div className="h-10 w-10 bg-[#ffcc00] rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="font-black text-on-surface text-xs italic">MTN</span>
                </div>
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">MTN Mobile Money</h2>
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                    Primary Payment Gateway (simulated)
                  </p>
                </div>
              </div>

              {status === 'error' && (
                <div className="mb-md p-md rounded-lg bg-error-container flex items-start gap-2">
                  <span className="material-symbols-outlined text-on-error-container text-[20px]">error</span>
                  <p className="font-body-md text-body-md text-on-error-container">{errorMessage}</p>
                </div>
              )}

              <form className="space-y-md" onSubmit={handleSubmit}>
                <div className="space-y-xs">
                  <label className="font-label-lg text-label-lg text-on-surface-variant block" htmlFor="momo_number">
                    Momo Phone Number
                  </label>
                  <div className="relative group">
                    <input
                      className="w-full bg-surface-container border border-outline-variant rounded-lg px-md py-sm font-body-md focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                      id="momo_number"
                      name="momo_number"
                      placeholder="024 000 0000"
                      required
                      type="tel"
                      value={momoNumber}
                      onChange={handleMomoChange}
                      disabled={status === 'processing' || !applicationForm}
                    />
                    <div className="absolute right-md top-1/2 -translate-y-1/2 flex items-center gap-xs">
                      <Icon name="smartphone" className="text-outline" />
                    </div>
                  </div>
                  <p className="text-[11px] text-on-surface-variant/60 font-medium">
                    Please ensure this phone is nearby to approve the prompt.
                  </p>
                </div>

                <div className="pt-sm space-y-sm">
                  <button
                    className="w-full bg-secondary-container text-on-secondary-container font-semibold py-md rounded-lg flex items-center justify-center gap-sm active:scale-95 transition-transform duration-150 shadow-md hover:bg-secondary-fixed transition-colors disabled:opacity-70 disabled:active:scale-100"
                    type="submit"
                    disabled={status === 'processing' || !applicationForm}
                  >
                    {status === 'processing' ? (
                      <>
                        <Icon name="progress_activity" className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Icon name="payments" />
                        Pay with MTN MoMo
                      </>
                    )}
                  </button>
                  <button
                    className="w-full text-on-surface-variant font-label-lg text-label-lg py-sm hover:text-error transition-colors flex items-center justify-center gap-xs"
                    type="button"
                    onClick={() => navigate(-1)}
                    disabled={status === 'processing'}
                  >
                    <Icon name="cancel" className="text-sm" />
                    Cancel Transaction
                  </button>
                </div>
              </form>

              <div className="mt-xl flex flex-col items-center gap-sm">
                <div className="flex items-center gap-xs bg-surface-container px-md py-xs rounded-full border border-outline-variant/30">
                  <Icon name="verified_user" className="text-secondary text-sm" filled />
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Secured by <span className="font-bold text-secondary">DERA</span> Pay
                  </span>
                </div>
                <div className="flex gap-md opacity-40 grayscale transition-all duration-500">
                  <Icon name="security" className="text-headline-sm" />
                  <Icon name="lock" className="text-headline-sm" />
                  <Icon name="shield" className="text-headline-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {status === 'success' && paidOrder && (
        <div className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-md flex items-center justify-center transition-opacity duration-300">
          <div className="bg-surface-container-lowest p-lg rounded-xl shadow-2xl max-w-sm w-full mx-margin-mobile text-center border border-secondary/20">
            <div className="w-20 h-20 bg-secondary-container rounded-full flex items-center justify-center mx-auto mb-md animate-bounce">
              <Icon name="check_circle" className="text-on-secondary-container text-[40px]" filled />
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-xs">Payment Successful!</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-lg">
              Your payment of GHS {Number(paidOrder.payment?.amount ?? 0).toFixed(2)} was recorded and your order is
              now <span className="font-bold">{paidOrder.status}</span>.
            </p>
            <button
              className="w-full bg-secondary text-on-primary font-semibold py-sm rounded-lg shadow-md active:scale-95 transition-all"
              onClick={handleDone}
            >
              Done
            </button>
          </div>
        </div>
      )}

      <footer className="md:hidden">
        <div className="fixed bottom-0 left-0 w-full flex justify-around items-center py-sm px-margin-mobile bg-surface shadow-[0px_-4px_20px_rgba(13,31,8,0.05)] z-50">
          {BOTTOM_NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex flex-col items-center justify-center text-on-surface-variant active:scale-95 transition-transform"
            >
              <Icon name={item.icon} />
              <span className="font-label-lg text-label-lg">{item.label}</span>
            </Link>
          ))}
        </div>
      </footer>
    </div>
  )
}
