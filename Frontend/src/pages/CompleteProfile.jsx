import { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import SideNav from '../components/layout/SideNav'
import { useAuth } from '../context/AuthContext'
import { getDashboardMetaForUser } from '../config/dashboardNav'
import { submitProfile, toSnakeCasePayload } from '../services/profileService'
import { apiGet } from '../services/apiClient'
import YouthProfileForm from '../components/profile/YouthProfileForm'
import CounselorProfileForm from '../components/profile/CounselorProfileForm'
import DonorProfileForm from '../components/profile/DonorProfileForm'

const ROLE_META = {
  youth: { label: 'Young Person', Form: YouthProfileForm },
  counselor: { label: 'Counselor', Form: CounselorProfileForm },
  donor: { label: 'Donor', Form: DonorProfileForm },
}

const GENERIC_ERROR = 'Something went wrong while saving your profile. Please try again.'

function humanizeField(key) {
  const words = key.replace(/_/g, ' ')
  return words.charAt(0).toUpperCase() + words.slice(1)
}

// The register and profile endpoints use DRF's default error format:
// serializer validation gives { field: ["message", ...] }, while auth,
// permission, not-found and throttle errors give { detail: "message" }.
function getErrorMessages(error) {
  const data = error?.data
  if (!data || typeof data !== 'object') return [GENERIC_ERROR]
  if (typeof data.detail === 'string') return [data.detail]
  const messages = Object.entries(data).flatMap(([field, fieldErrors]) =>
    [].concat(fieldErrors).map((message) => `${humanizeField(field)}: ${message}`),
  )
  return messages.length > 0 ? messages : [GENERIC_ERROR]
}

const PROFILE_ID_KEY = {
  youth: 'youth_profile',
  counselor: 'counselor_profile',
  donor: 'donor_profile',
}

export default function CompleteProfile() {
  const { user, isLoggedIn, register, refreshUser, loading: authLoading } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [status, setStatus] = useState('idle') // idle | submitting | error
  const [errorMessages, setErrorMessages] = useState([])
  const [institutions, setInstitutions] = useState([])
  const registration = location.state?.registration
  const isRegistrationFlow = Boolean(registration)

  useEffect(() => {
    if (user?.role === 'youth' || user?.role === 'counselor') {
      apiGet('/institutions/')
        .then((data) => setInstitutions(data.results ?? data))
        .catch(() => setInstitutions([]))
    }
  }, [user?.role])

  if (authLoading && !isRegistrationFlow) return null
  if (!isLoggedIn && !isRegistrationFlow) return <Navigate to="/login" replace />
  if (user?.profileComplete) return <Navigate to={getDashboardMetaForUser(user)?.basePath ?? '/'} replace />

  const meta = ROLE_META[user?.role] ?? ROLE_META.youth
  const { Form, label } = meta

  async function handleSubmit(values) {
    setStatus('submitting')
    setErrorMessages([])
    try {
      if (isRegistrationFlow) {
        await register({ ...registration, ...toSnakeCasePayload(registration.role, values, registration.full_name) })
        navigate('/login', {
          state: {
            email: registration.email,
            message: 'Profile saved successfully. Please log in to continue.',
          },
        })
        return
      }
      const profile = user[PROFILE_ID_KEY[user.role]]
      await submitProfile(user.role, profile?.id, toSnakeCasePayload(user.role, values, profile?.full_name))
      const updatedUser = await refreshUser()
      navigate(getDashboardMetaForUser(updatedUser)?.basePath ?? '/', { replace: true })
    } catch (error) {
      setStatus('error')
      setErrorMessages(getErrorMessages(error))
    }
  }

  return (
    <>
      <SideNav>
        <div className="bg-background text-on-background min-h-screen flex flex-col">
          <main className="flex-grow flex items-center justify-center px-margin-mobile py-lg md:py-xl">
            <div className="w-full max-w-2xl">
              <div
                className="w-full bg-surface-container-lowest p-lg md:p-xl rounded-xl border border-outline-variant/30"
                style={{ boxShadow: '0px 4px 20px rgba(13, 31, 8, 0.05)' }}
              >
                <div className="mb-lg">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-container/30 text-on-secondary-container rounded-full w-fit mb-3">
                    <span className="material-symbols-outlined text-[18px]">badge</span>
                    <span className="font-label-lg text-label-lg">{label} Profile</span>
                  </div>
                  <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-xs">
                    Complete Your Profile
                  </h1>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Just a few more details so we can personalize DERA for you.
                  </p>
                </div>

                {status === 'error' && (
                  <div className="mb-md p-md rounded-lg bg-error-container flex items-start gap-2">
                    <span className="material-symbols-outlined text-on-error-container text-[20px]">error</span>
                    <div className="font-body-md text-body-md text-on-error-container space-y-xs">
                      {errorMessages.map((message) => (
                        <p key={message}>{message}</p>
                      ))}
                    </div>
                  </div>
                )}

                <Form
                  onSubmit={handleSubmit}
                  submitting={status === 'submitting'}
                  institutions={institutions}
                  submitLabel={isRegistrationFlow ? 'Save Profile and Continue' : 'Save Profile'}
                  deferInstitutionCreation={isRegistrationFlow}
                />
              </div>
            </div>
          </main>
        </div>
      </SideNav>
    </>
  )
}
