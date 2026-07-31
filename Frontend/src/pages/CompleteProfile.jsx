import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import SideNav from '../components/layout/SideNav'
import { useAuth } from '../context/AuthContext'
import { getDashboardMeta } from '../config/dashboardNav'
import { submitProfile } from '../services/profileService'
import { apiGet } from '../services/apiClient'
import YouthProfileForm from '../components/profile/YouthProfileForm'
import CounselorProfileForm from '../components/profile/CounselorProfileForm'
import DonorProfileForm from '../components/profile/DonorProfileForm'

const ROLE_META = {
  youth: { label: 'Young Person', Form: YouthProfileForm },
  counselor: { label: 'Counselor', Form: CounselorProfileForm },
  donor: { label: 'Donor', Form: DonorProfileForm },
}

const PROFILE_ID_KEY = {
  youth: 'youth_profile',
  counselor: 'counselor_profile',
  donor: 'donor_profile',
}

// Forms collect camelCase values; the backend expects snake_case fields.
// full_name was already captured at signup (it lives on the profile created
// during registration), so we carry it through rather than asking again.
function toSnakeCasePayload(role, values, fullName) {
  if (role === 'youth') {
    return {
      full_name: fullName,
      date_of_birth: values.dateOfBirth || null,
      region: values.region,
      district: values.district,
      education_level: values.educationLevel,
      institution: values.institution || null,
      gender: values.gender,
    }
  }
  if (role === 'counselor') {
    return {
      full_name: fullName,
      institution: values.institution,
      role_title: values.roleTitle,
    }
  }
  return {
    full_name: fullName,
    organization: values.organization,
    donor_type: values.donorType,
  }
}

export default function CompleteProfile() {
  const { user, isLoggedIn, refreshUser, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [status, setStatus] = useState('idle') // idle | submitting | error
  const [errorMessage, setErrorMessage] = useState('')
  const [institutions, setInstitutions] = useState([])

  useEffect(() => {
    if (user?.role === 'youth' || user?.role === 'counselor') {
      apiGet('/institutions/')
        .then((data) => setInstitutions(data.results ?? data))
        .catch(() => setInstitutions([]))
    }
  }, [user?.role])

  if (authLoading) return null
  if (!isLoggedIn) return <Navigate to="/login" replace />
  if (user?.profileComplete) return <Navigate to={getDashboardMeta(user.role)?.basePath ?? '/'} replace />

  const meta = ROLE_META[user?.role] ?? ROLE_META.youth
  const { Form, label } = meta

  async function handleSubmit(values) {
    setStatus('submitting')
    setErrorMessage('')
    try {
      const profile = user[PROFILE_ID_KEY[user.role]]
      await submitProfile(user.role, profile?.id, toSnakeCasePayload(user.role, values, profile?.full_name))
      await refreshUser()
      navigate(getDashboardMeta(user.role)?.basePath ?? '/', { replace: true })
    } catch {
      setStatus('error')
      setErrorMessage('Something went wrong while saving your profile. Please try again.')
    }
  }

  return (
    <PageLayout bare>
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
                    <p className="font-body-md text-body-md text-on-error-container">{errorMessage}</p>
                  </div>
                )}

                <Form onSubmit={handleSubmit} submitting={status === 'submitting'} institutions={institutions} />
              </div>
            </div>
          </main>
        </div>
      </SideNav>
    </PageLayout>
  )
}
