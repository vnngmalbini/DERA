import { useState } from 'react'
import FormField from '../ui/FormField'
import SubmitButton from '../ui/SubmitButton'
import { validateRequiredFields } from '../../utils/formValidation'

const REQUIRED_FIELDS = ['institution', 'roleTitle']

export default function CounselorProfileForm({ onSubmit, submitting, institutions = [] }) {
  const [values, setValues] = useState({ institution: '', roleTitle: '' })
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
        id="institution"
        label="Institution"
        type="select"
        required
        value={values.institution}
        onChange={handleChange('institution')}
        error={errors.institution}
        options={institutions.map((inst) => ({ value: inst.id, label: inst.name }))}
      />
      <FormField
        id="roleTitle"
        label="Role Title"
        required
        value={values.roleTitle}
        onChange={handleChange('roleTitle')}
        error={errors.roleTitle}
        placeholder="e.g. School Counselor, Career Coach"
      />

      <SubmitButton submitting={submitting} />
    </form>
  )
}
