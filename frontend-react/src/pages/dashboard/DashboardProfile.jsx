import DashboardLayout from '../../components/layout/DashboardLayout'
import Icon from '../../components/ui/Icon'
import { useAuth } from '../../context/AuthContext'
import { getDashboardMeta } from '../../config/dashboardNav'

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
  const { user } = useAuth()
  const meta = getDashboardMeta(user?.role)
  const fields = ROLE_FIELDS[user?.role] ?? []

  return (
    <DashboardLayout role={user?.role}>
      <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-lg">
        Profile
      </h1>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 shadow-sm p-md md:p-lg max-w-2xl">
        <div className="flex items-center gap-4 mb-lg pb-lg border-b border-outline-variant/30">
          <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-headline-md text-headline-md">
            {initialsFor(user?.fullName)}
          </div>
          <div>
            <p className="font-headline-md text-headline-md text-on-surface">{user?.fullName || 'Unnamed User'}</p>
            <p className="font-label-md text-label-md text-on-surface-variant">{meta?.label} Account</p>
          </div>
        </div>

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
          disabled
          title="Editing connects to live data once the backend is wired up"
          className="mt-lg inline-flex items-center gap-2 border-2 border-outline text-on-surface-variant font-label-md text-label-md px-6 py-3 rounded-full opacity-60 cursor-not-allowed"
        >
          <Icon name="edit" />
          Edit Profile
        </button>
      </div>
    </DashboardLayout>
  )
}
