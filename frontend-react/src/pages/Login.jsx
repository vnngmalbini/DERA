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

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [role, setRole] = useState(ROLES[0].key)
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    console.log({ role, identifier, password })
    login({ role, identifier })
    navigate('/')
  }

  return (
    <PageLayout bare>
      <SideNav>
      <div className="bg-background text-on-background min-h-screen flex flex-col">
        <main className="flex-grow flex items-center justify-center px-margin-mobile py-lg md:py-xl">
          <div className="w-full max-w-7xl flex flex-col md:flex-row gap-lg items-center">
            <div className="hidden md:flex md:w-2/5 flex-col gap-md">
              <div
                className="relative w-full aspect-[4/3] rounded-xl overflow-hidden group"
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
                className="w-full bg-surface-container-lowest p-lg md:p-xl rounded-xl border border-outline-variant/30"
                style={{ boxShadow: '0px 4px 20px rgba(13, 31, 8, 0.05)' }}
              >
                <div className="mb-lg">
                  <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-xs">
                    Welcome Back
                  </h1>
                  <p className="font-body-md text-body-md text-on-surface-variant">Continue your journey to growth.</p>
                </div>

                <div className="mb-lg space-y-sm">
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
                  <div className="space-y-xs">
                    <label className="block font-label-lg text-label-lg text-on-surface" htmlFor="identifier">
                      Phone Number or Email
                    </label>
                    <input
                      id="identifier"
                      type="text"
                      placeholder="Enter your email or phone"
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
                      <a
                        className="font-label-sm text-label-sm text-secondary hover:underline transition-opacity"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                      >
                        Forgot Password?
                      </a>
                    </div>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                      className="w-full bg-secondary-container text-on-secondary-container font-label-lg text-label-lg py-md rounded-lg font-semibold active:scale-[0.98] transition-all hover:bg-secondary-fixed shadow-sm"
                    >
                      Login to DERA
                    </button>
                  </div>
                </form>

                <div className="mt-lg text-center">
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

                <div className="mt-lg pt-lg border-t border-outline-variant/30">
                  <p className="text-center font-label-sm text-label-sm text-on-surface-variant mb-md">
                    Or continue with
                  </p>
                  <div className="grid grid-cols-2 gap-sm">
                    <button
                      type="button"
                      className="flex items-center justify-center gap-xs py-sm px-md border border-outline-variant rounded-lg font-label-lg text-label-lg hover:bg-surface-container-low transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">account_circle</span>
                      Google
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-center gap-xs py-sm px-md border border-outline-variant rounded-lg font-label-lg text-label-lg hover:bg-surface-container-low transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">work</span>
                      LinkedIn
                    </button>
                  </div>
                </div>
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
      </SideNav>
    </PageLayout>
  )
}
