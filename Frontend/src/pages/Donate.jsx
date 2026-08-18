import { useState } from 'react'
import PageLayout from '../components/layout/PageLayout'
import Icon from '../components/ui/Icon'
import { useAuth } from '../context/AuthContext'
import { ApiError } from '../services/apiClient'
import { initializeDonation, loadPaystackScript, verifyDonation } from '../services/donationService'

const QUICK_AMOUNTS = [20, 50, 100, 200, 500]

export default function Donate() {
  const { user } = useAuth()
  const [amount, setAmount] = useState(50)
  const [customAmount, setCustomAmount] = useState('')
  const [donorName, setDonorName] = useState(user?.fullName || '')
  const [donorEmail, setDonorEmail] = useState(user?.email || '')
  const [status, setStatus] = useState('idle') // idle | processing | success | failed
  const [error, setError] = useState('')

  const selectedAmount = customAmount ? Number(customAmount) : amount

  function handleQuickAmount(value) {
    setAmount(value)
    setCustomAmount('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!donorEmail.trim()) {
      setError('Please enter your email address.')
      return
    }
    if (!selectedAmount || selectedAmount <= 0) {
      setError('Please enter a valid donation amount.')
      return
    }

    setStatus('processing')
    try {
      const donation = await initializeDonation({
        donorName: donorName.trim(),
        donorEmail: donorEmail.trim(),
        amount: selectedAmount,
      })

      await loadPaystackScript()

      const handler = window.PaystackPop.setup({
        key: donation.public_key,
        email: donation.donor_email,
        amount: Math.round(Number(donation.amount) * 100), // pesewas
        currency: 'GHS',
        ref: donation.reference,
        callback: (response) => {
          verifyDonation(response.reference)
            .then((verified) => {
              setStatus(verified.status === 'success' ? 'success' : 'failed')
            })
            .catch(() => setStatus('failed'))
        },
        onClose: () => {
          setStatus((current) => (current === 'processing' ? 'idle' : current))
          // The popup was closed without completing payment — verify anyway
          // so the backend resolves this reference to "failed" instead of
          // leaving it "pending" forever (Paystack reports it as not
          // successful, since no payment was actually completed).
          verifyDonation(donation.reference).catch(() => {})
        },
      })
      handler.openIframe()
    } catch (err) {
      setStatus('idle')
      setError(err instanceof ApiError ? err.message : 'Could not start your donation. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <PageLayout>
        <div className="min-h-[70vh] flex items-center justify-center px-margin-mobile">
          <div className="max-w-md w-full text-center bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-lg shadow-sm">
            <div className="w-16 h-16 mx-auto bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center mb-4">
              <Icon name="favorite" className="text-4xl" filled />
            </div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-2">Thank You!</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">
              Your donation of GHS {Number(selectedAmount).toFixed(2)} was received. You're helping a young Ghanaian
              take the next step in their future.
            </p>
            <button
              onClick={() => {
                setStatus('idle')
                setCustomAmount('')
              }}
              className="h-12 px-8 rounded-full bg-primary text-on-primary font-label-md inline-flex items-center justify-center gap-2"
            >
              Donate Again
            </button>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="px-margin-mobile md:px-margin-desktop max-w-[1280px] mx-auto">
        <section className="py-lg text-center md:text-left">
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg mb-sm">
            Support a Young Dream
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Your donation helps cover application fees, scholarships, and mentorship for young Ghanaians building
            their future. Every cedi counts.
          </p>
        </section>

        <div className="max-w-xl mx-auto mb-xl">
          <div className="bg-surface-container-lowest rounded-xl shadow-[0px_-4px_20px_rgba(13,31,8,0.05)] p-md md:p-lg">
            <form className="space-y-md" onSubmit={handleSubmit}>
              {status === 'failed' && (
                <div className="p-md rounded-lg bg-error-container flex items-start gap-2">
                  <Icon name="error" className="text-on-error-container" />
                  <p className="font-body-md text-body-md text-on-error-container">
                    Your payment could not be confirmed. If you were charged, please contact us — otherwise, feel
                    free to try again.
                  </p>
                </div>
              )}
              {error && (
                <div className="p-md rounded-lg bg-error-container">
                  <p className="font-body-md text-body-md text-on-error-container">{error}</p>
                </div>
              )}

              <div className="space-y-xs">
                <label className="font-label-lg text-label-lg text-on-surface-variant">Amount (GHS)</label>
                <div className="flex flex-wrap gap-2">
                  {QUICK_AMOUNTS.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleQuickAmount(value)}
                      className={`px-5 py-2 rounded-full font-label-md text-label-md border transition-all ${
                        !customAmount && amount === value
                          ? 'bg-primary text-on-primary border-primary'
                          : 'border-outline-variant text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      GHS {value}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="Or enter a custom amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full bg-surface-container-low border-none rounded-lg p-md focus:ring-2 focus:ring-secondary-fixed transition-all text-on-surface mt-2"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div className="space-y-xs">
                  <label className="font-label-lg text-label-lg text-on-surface-variant" htmlFor="donorName">
                    Name (optional)
                  </label>
                  <input
                    id="donorName"
                    type="text"
                    placeholder="Jane Doe"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="w-full bg-surface-container-low border-none rounded-lg p-md focus:ring-2 focus:ring-secondary-fixed transition-all text-on-surface"
                  />
                </div>
                <div className="space-y-xs">
                  <label className="font-label-lg text-label-lg text-on-surface-variant" htmlFor="donorEmail">
                    Email
                  </label>
                  <input
                    id="donorEmail"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    className="w-full bg-surface-container-low border-none rounded-lg p-md focus:ring-2 focus:ring-secondary-fixed transition-all text-on-surface"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={status === 'processing'}
                className="w-full bg-secondary text-on-secondary font-label-lg py-md rounded-lg flex items-center justify-center gap-sm active:scale-95 transition-all disabled:opacity-70"
              >
                {status === 'processing' ? (
                  <>
                    <Icon name="progress_activity" className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Donate GHS {selectedAmount ? Number(selectedAmount).toFixed(2) : '0.00'}
                    <Icon name="favorite" filled />
                  </>
                )}
              </button>
              <p className="text-xs text-on-surface-variant/70 text-center italic">
                Payments are securely processed by Paystack. DERA never sees or stores your card details.
              </p>
            </form>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
