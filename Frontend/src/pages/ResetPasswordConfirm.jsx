import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ApiError } from '../services/apiClient'
import { confirmPasswordReset } from '../services/authService'

export default function ResetPasswordConfirm() {
  const { uid, token } = useParams()
  const navigate = useNavigate()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setErrorMessage('')

    if (newPassword !== confirmPassword) {
      setErrorMessage('Those passwords don’t match.')
      return
    }

    setSubmitting(true)
    try {
      await confirmPasswordReset({ uid, token, newPassword })
      navigate('/login', { state: { message: 'Password updated successfully. Please log in with your new password.' } })
    } catch (err) {
      setErrorMessage(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <div className="bg-background text-on-background min-h-screen flex flex-col">
        <main className="flex-grow flex items-center justify-center px-margin-mobile py-lg">
          <div className="w-full max-w-md">
            <div
              className="w-full bg-surface-container-lowest p-lg rounded-xl border border-outline-variant/30"
              style={{ boxShadow: '0px 4px 20px rgba(13, 31, 8, 0.05)' }}
            >
              <div className="mb-md">
                <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-xs">
                  Set a New Password
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Choose a new password for your account.
                </p>
              </div>

              <form className="space-y-md" onSubmit={handleSubmit}>
                {errorMessage && (
                  <div className="p-md rounded-lg bg-error-container flex items-start gap-2">
                    <span className="material-symbols-outlined text-on-error-container text-[20px]">error</span>
                    <p className="font-body-md text-body-md text-on-error-container">{errorMessage}</p>
                  </div>
                )}

                <div className="space-y-xs">
                  <label className="block font-label-lg text-label-lg text-on-surface" htmlFor="new-password">
                    New Password
                  </label>
                  <input
                    id="new-password"
                    type="password"
                    placeholder="Enter a new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full px-md py-sm rounded-lg border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-secondary-container focus:border-secondary transition-all font-body-md text-body-md"
                  />
                </div>

                <div className="space-y-xs">
                  <label className="block font-label-lg text-label-lg text-on-surface" htmlFor="confirm-password">
                    Confirm Password
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    placeholder="Re-enter the new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full px-md py-sm rounded-lg border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-secondary-container focus:border-secondary transition-all font-body-md text-body-md"
                  />
                </div>

                <div className="pt-sm">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-secondary-container text-on-secondary-container font-label-lg text-label-lg py-md rounded-lg font-semibold active:scale-[0.98] transition-all hover:bg-secondary-fixed shadow-sm flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {submitting ? (
                      <>
                        <span className="material-symbols-outlined animate-spin">refresh</span>
                        Updating...
                      </>
                    ) : (
                      'Reset Password'
                    )}
                  </button>
                </div>

                <div className="text-center">
                  <Link
                    to="/login"
                    className="font-label-lg text-label-lg text-secondary font-semibold hover:underline decoration-2 underline-offset-4"
                  >
                    Back to Login
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
