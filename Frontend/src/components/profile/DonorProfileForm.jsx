import { useState } from 'react'
import FormField from '../ui/FormField'
import SubmitButton from '../ui/SubmitButton'
import { validateRequiredFields } from '../../utils/formValidation'

const DONOR_TYPES = [
  { value: 'individual', label: 'Individual' },
  { value: 'ngo', label: 'NGO / Foundation' },
  { value: 'alumni', label: 'Alumni' },
  { value: 'corporate', label: 'Corporate' },
]
const REQUIRED_FIELDS = ['organization', 'donorType']

export default function DonorProfileForm({ onSubmit, submitting, defaultValues, submitLabel }) {
  const [values, setValues] = useState({ organization: '', donorType: '', ...defaultValues })
  const [errors, setErrors] = useState({})

  const handleChange = (field) => (e) => setValues((prev) => ({ ...prev, [field]: e.target.value }))

  function handleSubmit(e) {
    e.preventDefault()
    const nextErrors = validateRequiredFields(values, REQUIRED_FIELDS)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) onSubmit(values)
  }

  return (
    <form className="space-y-md" onSubmit={handleSubmit} noValidate>
      <FormField
        id="organization"
        label="Organization"
        required
        value={values.organization}
        onChange={handleChange('organization')}
        error={errors.organization}
        placeholder="Organization name (or 'Individual')"
      />
      <FormField
        id="donorType"
        label="Donor Type"
        type="select"
        required
        value={values.donorType}
        onChange={handleChange('donorType')}
        error={errors.donorType}
        options={DONOR_TYPES}
      />

      <SubmitButton submitting={submitting}>{submitLabel}</SubmitButton>
    </form>
  )
}
