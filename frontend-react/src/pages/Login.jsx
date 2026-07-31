import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import { useAuth } from '../context/AuthContext'
import { getDashboardMeta } from '../config/dashboardNav'
import { ApiError } from '../services/apiClient'

const ROLES = [
  { key: 'youth', label: 'Young Person', icon: 'person' },
  { key: 'donor', label: 'Sponsor', icon: 'volunteer_activism' },
  { key: 'counselor', label: 'Counselor', icon: 'support_agent' },
]

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [mode, setMode] = useState('login') // 'login' | 'forgot' | 'sent'
  const [role, setRole] = useState(ROLES[0].key)
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [resetIdentifier, setResetIdentifier] = useState('')
  const [resetStatus, setResetStatus] = useState('idle')
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // The role tabs above are a cosmetic pre-selection only — the server is
  // the source of truth for identity, so the redirect below always uses
  // the role the API actually returns, not whichever tab was clicked.
  async function handleSubmit(e) {
    e.preventDefault()
    setErrorMessage('')
    setSubmitting(true)
    try {
      const me = await login(identifier, password)
      navigate(getDashboardMeta(me.role)?.basePath ?? '/')
    } catch (err) {
      setErrorMessage(
        err instanceof ApiError ? err.message : 'Something went wrong. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  function handleResetSubmit(e) {
    e.preventDefault()
    setResetStatus('submitting')
    setTimeout(() => {
      setResetStatus('idle')
      setMode('sent')
    }, 1200)
  }

  function backToLogin() {
    setMode('login')
    setResetStatus('idle')
  }

  const headings = {
    login: { title: 'Welcome Back', subtitle: 'Continue your journey to growth.' },
    forgot: {
      title: 'Reset Password',
      subtitle: "Enter the phone number or email linked to your account and we'll send you a link to reset it.",
    },
    sent: { title: 'Check Your Inbox', subtitle: "We've sent password reset instructions to your account." },
  }

  return (
    <PageLayout bare>
      <div className="bg-background text-on-background min-h-screen flex flex-col">
        <main className="flex-grow flex items-center justify-center px-margin-mobile py-lg">
          <div className="w-full max-w-7xl flex flex-col md:flex-row gap-lg items-center">
            <div className="hidden md:flex md:w-2/5 flex-col gap-md">
              <div
                className="relative w-full aspect-[3/4] rounded-xl overflow-hidden group"
                style={{ boxShadow: '0px 4px 20px rgba(13, 31, 8, 0.05)' }}
              >
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  alt="A serene and professional workspace with lush green plants and soft morning light streaming through a large window."
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdZS3tndHUz9cac7d3PM_1Ij8-zS4ASODkS2dA5kBEsLMs0k7V_16y-g2z0vcoqy49xydjoKLhvIQlFmLhcm9M2ZtV5MRFDDz2Sh7pUGTg6hbStK05MUZ9WtyXm5cIKwhvuXMlK9pPgPuh08-h3PLpwmpe7_Sri_zNnbacga0nsTmcN1Osgt0GwFdbNz1pAPSzlLAeOmY-7KIuZecW3dC4tQ9K7f_a4A_4ykAuwWkbbDkc7r55Tf60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-container/80 to-transparent flex flex-col justify-end p-lg">
                  <h2 className="font-headline-lg text-headline-lg text-white mb-xs">Nurture Your Ambition</h2>
                  <p className="font-body-lg text-body-lg text-on-primary-container">
                    Join a community built on reliability and organic professional development.
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full md:w-3/5">
              <div
                className="w-full bg-surface-container-lowest p-lg rounded-xl border border-outline-variant/30"
                style={{ boxShadow: '0px 4px 20px rgba(13, 31, 8, 0.05)' }}
              >
                <div className="mb-md">
                  <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-xs">
                    {headings[mode].title}
                  </h1>
                  <p className="font-body-md text-body-md text-on-surface-variant">{headings[mode].subtitle}</p>
                </div>

                {mode === 'login' && (
                  <>
                    <div className="mb-md space-y-sm">
                      <label className="font-label-lg text-label-lg text-on-surface-variant">I am a...</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-sm">
                        {ROLES.map((r) => (
                          <button
                            key={r.key}
                            type="button"
                            onClick={() => setRole(r.key)}
                            className={`role-card group flex items-center justify-center flex-col p-md rounded-lg border-2 transition-all active:scale-95 ${
                              role === r.key
                                ? 'border-secondary bg-secondary-container scale-[1.02]'
                                : 'border-outline-variant bg-surface hover:border-secondary/50'
                            }`}
                          >
                            <span className="material-symbols-outlined text-secondary text-[24px] mb-2 group-hover:scale-110 transition-transform">
                              {r.icon}
                            </span>
                            <span className="font-label-lg text-label-lg text-on-surface">{r.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <form className="space-y-md" onSubmit={handleSubmit}>
                      {errorMessage && (
                        <div className="p-md rounded-lg bg-error-container flex items-start gap-2">
                          <span className="material-symbols-outlined text-on-error-container text-[20px]">error</span>
                          <p className="font-body-md text-body-md text-on-error-container">{errorMessage}</p>
                        </div>
                      )}
                      <div className="space-y-xs">
                        <label className="block font-label-lg text-label-lg text-on-surface" htmlFor="identifier">
                          Email
                        </label>
                        <input
                          id="identifier"
                          type="email"
                          placeholder="Enter your email"
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          className="w-full px-md py-sm rounded-lg border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-secondary-container focus:border-secondary transition-all font-body-md text-body-md"
                        />
                      </div>
                      <div className="space-y-xs">
                        <div className="flex justify-between items-center">
                          <label className="block font-label-lg text-label-lg text-on-surface" htmlFor="password">
                            Password
                          </label>
                          <button
                            type="button"
                            onClick={() => setMode('forgot')}
                            className="font-label-sm text-label-sm text-secondary hover:underline transition-opacity"
                          >
                            Forgot Password? Reset Password
                          </button>
                        </div>
                        <div className="relative">
                          <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            placeholder={passwordFocused ? '' : '••••••••'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => setPasswordFocused(true)}
                            onBlur={() => setPasswordFocused(false)}
                            className="w-full px-md py-sm rounded-lg border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-secondary-container focus:border-secondary transition-all font-body-md text-body-md"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant"
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              {showPassword ? 'visibility_off' : 'visibility'}
                            </span>
                          </button>
                        </div>
                      </div>

                      <div className="pt-sm">
                        <button
                          type="submit"
                          disabled={submitting}
                          className="w-full bg-secondary-container text-on-secondary-container font-label-lg text-label-lg py-md rounded-lg font-semibold active:scale-[0.98] transition-all hover:bg-secondary-fixed shadow-sm disabled:opacity-70"
                        >
                          {submitting ? 'Logging In...' : 'Login to DERA'}
                        </button>
                      </div>
                    </form>

                    <div className="mt-md text-center">
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        Don&apos;t have an account?{' '}
                        <Link
                          to="/signup"
                          className="text-secondary font-semibold hover:underline decoration-2 underline-offset-4"
                        >
                          Sign Up
                        </Link>
                      </p>
                    </div>

                  </>
                )}

                {mode === 'forgot' && (
                  <form className="space-y-md" onSubmit={handleResetSubmit}>
                    <div className="space-y-xs">
                      <label className="block font-label-lg text-label-lg text-on-surface" htmlFor="reset-identifier">
                        Phone Number or Email
                      </label>
                      <input
                        id="reset-identifier"
                        type="text"
                        placeholder="Enter your email or phone"
                        value={resetIdentifier}
                        onChange={(e) => setResetIdentifier(e.target.value)}
                        required
                        className="w-full px-md py-sm rounded-lg border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-secondary-container focus:border-secondary transition-all font-body-md text-body-md"
                      />
                    </div>

                    <div className="pt-sm">
                      <button
                        type="submit"
                        disabled={resetStatus === 'submitting'}
                        className="w-full bg-secondary-container text-on-secondary-container font-label-lg text-label-lg py-md rounded-lg font-semibold active:scale-[0.98] transition-all hover:bg-secondary-fixed shadow-sm flex items-center justify-center gap-2 disabled:opacity-70"
                      >
                        {resetStatus === 'submitting' ? (
                          <>
                            <span className="material-symbols-outlined animate-spin">refresh</span>
                            Sending Link...
                          </>
                        ) : (
                          'Send Reset Link'
                        )}
                      </button>
                    </div>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={backToLogin}
                        className="font-label-lg text-label-lg text-secondary font-semibold hover:underline decoration-2 underline-offset-4"
                      >
                        Back to Login
                      </button>
                    </div>
                  </form>
                )}

                {mode === 'sent' && (
                  <div className="space-y-md">
                    <div className="text-center py-sm">
                      <span className="material-symbols-outlined text-secondary text-[48px] mb-sm">
                        mark_email_read
                      </span>
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        If an account exists for{' '}
                        <span className="font-semibold text-on-surface">{resetIdentifier}</span>, you&apos;ll receive
                        instructions to reset your password shortly.
                      </p>
                    </div>
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={backToLogin}
                        className="font-label-lg text-label-lg text-secondary font-semibold hover:underline decoration-2 underline-offset-4"
                      >
                        Back to Login
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        <footer className="py-md px-margin-mobile">
          <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-sm">
            <p className="font-label-sm text-label-sm text-on-surface-variant">© 2024 DERA Platform. All rights reserved.</p>
            <div className="flex gap-md">
              <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary transition-colors" href="#" onClick={(e) => e.preventDefault()}>
                Privacy Policy
              </a>
              <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary transition-colors" href="#" onClick={(e) => e.preventDefault()}>
                Terms of Service
              </a>
              <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary transition-colors" href="#" onClick={(e) => e.preventDefault()}>
                Support
              </a>
            </div>
          </div>
        </footer>
      </div>
    </PageLayout>
  )
}
