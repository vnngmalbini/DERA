import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import SideNav from '../components/layout/SideNav'
import { useAuth } from '../context/AuthContext'

const ROLES = [
  { key: 'young_person', label: 'Young Person', icon: 'person' },
  { key: 'sponsor', label: 'Sponsor', icon: 'volunteer_activism' },
  { key: 'counselor', label: 'Counselor', icon: 'support_agent' },
]

export default function SignUp() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [role, setRole] = useState(null)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState('idle')

  function handleSubmit(e) {
    e.preventDefault()
    console.log({ role, fullName, phone, password })
    setStatus('submitting')
    setTimeout(() => {
      setStatus('success')
      login({ role, fullName })
      setTimeout(() => navigate('/'), 700)
    }, 1500)
  }

  return (
    <PageLayout bare>
      <SideNav>
      <div className="min-h-screen flex flex-col text-on-background selection:bg-secondary-container selection:text-on-secondary-container">
        <main className="flex-grow flex items-center justify-center relative overflow-hidden px-margin-mobile py-lg">
          <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-secondary-container/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 bg-primary-container/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="w-full max-w-7xl flex flex-col md:flex-row gap-lg items-center">
            <div className="w-full md:w-2/5 flex flex-col space-y-md">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-container/30 text-on-secondary-container rounded-full w-fit mb-2">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                <span className="font-label-lg text-label-lg">Secure Registration</span>
              </div>
              <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary leading-tight">
                Join the Community
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">
                Every Young Person Belongs Here. Create your account to get started and unlock a world of professional
                growth and organic connections.
              </p>
              <div className="hidden md:block mt-md relative rounded-xl overflow-hidden aspect-[4/3] shadow-lg group">
                <div className="absolute inset-0 bg-gradient-to-t from-primary-container/40 to-transparent z-10" />
                <div
                  className="bg-cover bg-center w-full h-full transition-transform duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCvpy9wQHXxv3B_tmZN-QX7he8XotvybMXi9fmMay-mt7xR-Zc5yV9zL1Kp85XoCFC-M-Pu_G7nxjXV-L8AVN9mB8_hsi_v2734QRFxSgpFVB8PxwmPm0XsvbVdJeZGPNL7P4YodbCknsYLLOWCTyhUetVRRqG3d1RnCpTdHg0SLlO1G7x9mmB_93GL_JJXFtYJvUuYXLXhwLTeUP3oWbbQ0mFk0LnbzXSxAMKVJLOXpTl1up2cX89Q")',
                  }}
                />
              </div>
            </div>

            <div className="w-full md:w-3/5">
              <div className="bg-surface-container-lowest rounded-xl p-md md:p-lg shadow-[0px_4px_20px_rgba(13,31,8,0.05)] border border-outline-variant/30 w-full">
                <form className="space-y-md" onSubmit={handleSubmit}>
                  <div className="space-y-sm">
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

                  <div className="space-y-sm">
                    <div className="space-y-xs">
                      <label className="font-label-lg text-label-lg text-on-surface-variant" htmlFor="full_name">
                        Full Name
                      </label>
                      <input
                        id="full_name"
                        type="text"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-secondary-fixed focus:ring-2 focus:ring-secondary-fixed/20 bg-background font-body-md text-body-md transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-xs">
                      <label className="font-label-lg text-label-lg text-on-surface-variant" htmlFor="phone">
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-secondary-fixed focus:ring-2 focus:ring-secondary-fixed/20 bg-background font-body-md text-body-md transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-xs relative">
                      <label className="font-label-lg text-label-lg text-on-surface-variant" htmlFor="password">
                        Create Password
                      </label>
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Min. 8 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-secondary-fixed focus:ring-2 focus:ring-secondary-fixed/20 bg-background font-body-md text-body-md transition-all outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-4 top-[38px] text-on-surface-variant/60 hover:text-secondary"
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
                      disabled={status !== 'idle'}
                      className={`w-full py-4 rounded-lg font-label-lg text-label-lg font-bold active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md ${
                        status === 'success'
                          ? 'bg-on-secondary-container text-white'
                          : 'bg-secondary-fixed text-on-secondary-fixed hover:opacity-90'
                      }`}
                    >
                      {status === 'idle' && (
                        <>
                          Create Account
                          <span className="material-symbols-outlined">arrow_forward</span>
                        </>
                      )}
                      {status === 'submitting' && (
                        <>
                          <span className="material-symbols-outlined animate-spin">refresh</span>
                          Creating Account...
                        </>
                      )}
                      {status === 'success' && (
                        <>
                          <span className="material-symbols-outlined">check_circle</span>
                          Success!
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 py-2">
                    <div className="flex-grow border-t border-outline-variant/30" />
                    <span className="font-label-sm text-label-sm text-on-surface-variant/60">OR</span>
                    <div className="flex-grow border-t border-outline-variant/30" />
                  </div>

                  <p className="text-center font-label-lg text-label-lg text-on-surface-variant">
                    Already have an account?{' '}
                    <Link className="text-secondary font-bold hover:underline" to="/login">
                      Log In
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </main>

        <footer className="md:hidden py-md px-margin-mobile text-center">
          <p className="font-label-sm text-label-sm text-on-surface-variant/40 italic">Part of the DERA Collective © 2024</p>
        </footer>
      </div>
      </SideNav>
    </PageLayout>
  )
}
