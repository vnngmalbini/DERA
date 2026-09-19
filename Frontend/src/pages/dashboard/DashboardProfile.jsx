import { useEffect, useState } from 'react'
import Icon from '../../components/ui/Icon'
import { useAuth } from '../../context/AuthContext'
import { getDashboardMetaForUser } from '../../config/dashboardNav'
import { apiGet } from '../../services/apiClient'
import { submitProfile, toSnakeCasePayload, uploadProfilePicture } from '../../services/profileService'
import YouthProfileForm from '../../components/profile/YouthProfileForm'
import CounselorProfileForm from '../../components/profile/CounselorProfileForm'
import DonorProfileForm from '../../components/profile/DonorProfileForm'

const ROLE_FIELDS = {
  youth: [
    { key: 'fullName', label: 'Full Name' },
    { key: 'dateOfBirth', label: 'Date of Birth' },
    { key: 'region', label: 'Region' },
    { key: 'district', label: 'District' },
    { key: 'educationLevel', label: 'Education Level' },
    { key: 'institution', label: 'Institution' },
    { key: 'gender', label: 'Gender' },
  ],
  counselor: [
    { key: 'fullName', label: 'Full Name' },
    { key: 'institution', label: 'Institution' },
    { key: 'roleTitle', label: 'Role Title' },
  ],
  donor: [
    { key: 'fullName', label: 'Full Name' },
    { key: 'organization', label: 'Organization' },
    { key: 'donorType', label: 'Donor Type' },
  ],
}

const ROLE_FORM = {
  youth: YouthProfileForm,
  counselor: CounselorProfileForm,
  donor: DonorProfileForm,
}

const PROFILE_ID_KEY = {
  youth: 'youth_profile',
  counselor: 'counselor_profile',
  donor: 'donor_profile',
}

function initialsFor(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export default function DashboardProfile() {
  const { user, refreshUser } = useAuth()
  const meta = getDashboardMetaForUser(user)
  const fields = ROLE_FIELDS[user?.role] ?? []
  const Form = ROLE_FORM[user?.role]

  const [editing, setEditing] = useState(false)
  const [institutions, setInstitutions] = useState([])
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [photoError, setPhotoError] = useState('')

  useEffect(() => {
    if (user?.role === 'youth' || user?.role === 'counselor') {
      apiGet('/institutions/')
        .then((data) => setInstitutions(data.results ?? data))
        .catch(() => setInstitutions([]))
    }
  }, [user?.role])

  async function handleSave(values) {
    setSaving(true)
    setSaveError('')
    try {
      const profile = user[PROFILE_ID_KEY[user.role]]
      await submitProfile(user.role, profile?.id, toSnakeCasePayload(user.role, values, profile?.full_name))
      await refreshUser()
      setEditing(false)
    } catch {
      setSaveError('Something went wrong while saving your profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function handlePhotoChange(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setPhotoError('')
    setUploadingPhoto(true)
    try {
      await uploadProfilePicture(file)
      await refreshUser()
    } catch {
      setPhotoError("Couldn't upload that photo. Please try a different image.")
    } finally {
      setUploadingPhoto(false)
    }
  }

  return (
    <>
      <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-lg">
        Profile
      </h1>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 shadow-sm p-md md:p-lg max-w-2xl">
        <div className="flex items-center gap-4 mb-lg pb-lg border-b border-outline-variant/30">
          <div className="relative shrink-0">
            {user?.profile_picture ? (
              <img
                src={user.profile_picture}
                alt=""
                loading="lazy"
                decoding="async"
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-headline-md text-headline-md">
                {initialsFor(user?.fullName)}
              </div>
            )}
            <label
              htmlFor="profile-picture-input"
              title="Change profile picture"
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center cursor-pointer shadow"
            >
              <Icon
                name={uploadingPhoto ? 'progress_activity' : 'photo_camera'}
                className={`text-[14px] ${uploadingPhoto ? 'animate-spin' : ''}`}
              />
            </label>
            <input
              id="profile-picture-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
              disabled={uploadingPhoto}
            />
          </div>
          <div>
            <p className="font-headline-md text-headline-md text-on-surface">{user?.fullName || 'Unnamed User'}</p>
            <p className="font-label-md text-label-md text-on-surface-variant">{meta?.label} Account</p>
            {photoError && <p className="font-label-sm text-label-sm text-error mt-1">{photoError}</p>}
          </div>
        </div>

        {editing && Form ? (
          <>
            {saveError && (
              <div className="mb-md p-md rounded-lg bg-error-container flex items-start gap-2">
                <Icon name="error" className="text-on-error-container text-[20px]" />
                <p className="font-body-md text-body-md text-on-error-container">{saveError}</p>
              </div>
            )}
            <Form
              onSubmit={handleSave}
              submitting={saving}
              institutions={institutions}
              submitLabel="Save Changes"
              defaultValues={{
                dateOfBirth: user?.dateOfBirth || '',
                region: user?.region || '',
                district: user?.district || '',
                educationLevel: user?.educationLevel || '',
                institution: user?.institutionId || '',
                gender: user?.gender || '',
                roleTitle: user?.roleTitle || '',
                organization: user?.organization || '',
                donorType: user?.donorType || '',
              }}
            />
            <button
              type="button"
              onClick={() => {
                setEditing(false)
                setSaveError('')
              }}
              className="mt-sm inline-flex items-center gap-2 text-on-surface-variant font-label-md text-label-md px-6 py-3 rounded-full hover:bg-surface-container transition-colors"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-md">
              {fields.map((field) => (
                <div key={field.key}>
                  <dt className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant mb-1">
                    {field.label}
                  </dt>
                  <dd className="font-body-md text-body-md text-on-surface">{user?.[field.key] || '—'}</dd>
                </div>
              ))}
            </dl>

            <button
              type="button"
              onClick={() => setEditing(true)}
              disabled={!Form}
              className="mt-lg inline-flex items-center gap-2 border-2 border-primary text-primary font-label-md text-label-md px-6 py-3 rounded-full hover:bg-primary/5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Icon name="edit" />
              Edit Profile
            </button>
          </>
        )}
      </div>
    </>
  )
}
