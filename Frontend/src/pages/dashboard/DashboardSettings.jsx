import { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Icon from '../../components/ui/Icon'
import { useAuth } from '../../context/AuthContext'
import { changePassword } from '../../services/profileService'

const INPUT_CLASSES =
  'w-full px-md py-sm rounded-lg border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-secondary-container focus:border-secondary transition-all font-body-md text-body-md'

function ChangePasswordForm() {
  const [expanded, setExpanded] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [message, setMessage] = useState('')

  function reset() {
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setStatus('idle')
    setMessage('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (newPassword.length < 8) {
      setStatus('error')
      setMessage('New password must be at least 8 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setStatus('error')
      setMessage('New password and confirmation do not match.')
      return
    }
    setStatus('submitting')
    setMessage('')
    try {
      await changePassword(currentPassword, newPassword)
      setStatus('success')
      setMessage('Password updated successfully.')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setStatus('error')
      setMessage(err.message || 'Could not update your password. Please try again.')
    }
  }

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="inline-flex items-center gap-2 border-2 border-outline text-on-surface font-label-md text-label-md px-6 py-3 rounded-full hover:bg-surface-container transition-colors"
      >
        <Icon name="lock_reset" />
        Change Password
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-sm max-w-sm" noValidate>
      <input
        type="password"
        required
        placeholder="Current password"
        autoComplete="current-password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        className={INPUT_CLASSES}
      />
      <input
        type="password"
        required
        placeholder="New password"
        autoComplete="new-password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className={INPUT_CLASSES}
      />
      <input
        type="password"
        required
        placeholder="Confirm new password"
        autoComplete="new-password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className={INPUT_CLASSES}
      />
      {message && (
        <p className={`font-label-sm text-label-sm ${status === 'error' ? 'text-error' : 'text-primary'}`}>
          {message}
        </p>
      )}
      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="bg-primary text-on-primary font-label-md text-label-md px-6 py-2.5 rounded-full disabled:opacity-60"
        >
          {status === 'submitting' ? 'Updating…' : 'Update Password'}
        </button>
        <button
          type="button"
          onClick={() => {
            reset()
            setExpanded(false)
          }}
          className="border-2 border-outline text-on-surface-variant font-label-md text-label-md px-6 py-2.5 rounded-full"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between gap-4 py-md border-b border-outline-variant/20 last:border-b-0">
      <div>
        <p className="font-label-md text-label-md text-on-surface">{label}</p>
        {description && <p className="font-body-md text-body-md text-on-surface-variant">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`w-12 h-7 rounded-full flex items-center px-1 transition-colors shrink-0 ${
          checked ? 'bg-primary justify-end' : 'bg-outline-variant justify-start'
        }`}
      >
        <span className="w-5 h-5 rounded-full bg-white shadow" />
      </button>
    </div>
  )
}

export default function DashboardSettings() {
  const { user } = useAuth()
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [smsNotifs, setSmsNotifs] = useState(false)
  const [language, setLanguage] = useState('English')

  return (
    <DashboardLayout role={user?.role}>
      <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-lg">
        Settings
      </h1>

      <div className="max-w-2xl space-y-lg">
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 shadow-sm p-md md:p-lg">
          <h3 className="font-headline-md text-headline-md text-on-surface mb-sm">Notifications</h3>
          <Toggle
            checked={emailNotifs}
            onChange={() => setEmailNotifs((v) => !v)}
            label="Email Notifications"
            description="Get updates about your account by email."
          />
          <Toggle
            checked={smsNotifs}
            onChange={() => setSmsNotifs((v) => !v)}
            label="SMS Notifications"
            description="Get important alerts by text message."
          />
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 shadow-sm p-md md:p-lg">
          <h3 className="font-headline-md text-headline-md text-on-surface mb-md">Preferences</h3>
          <label className="block font-label-md text-label-md text-on-surface-variant mb-2" htmlFor="language">
            Language
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full sm:w-64 px-4 py-3 rounded-lg border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-secondary-container focus:border-secondary transition-all font-body-md text-body-md"
          >
            <option>English</option>
            <option>Twi</option>
          </select>
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 shadow-sm p-md md:p-lg">
          <h3 className="font-headline-md text-headline-md text-on-surface mb-sm">Account</h3>
          <ChangePasswordForm />
        </div>
      </div>
    </DashboardLayout>
  )
}
