import { useState } from 'react'
import FormField from '../ui/FormField'
import Combobox from '../ui/Combobox'
import SubmitButton from '../ui/SubmitButton'
import { validateRequiredFields } from '../../utils/formValidation'
import { apiPost } from '../../services/apiClient'

const OTHER_INSTITUTION = '__other__'
const REQUIRED_FIELDS = ['institution', 'roleTitle']

export default function CounselorProfileForm({ onSubmit, submitting, institutions = [], defaultValues, submitLabel }) {
  const [values, setValues] = useState({ institution: '', roleTitle: '', customInstitutionName: '', ...defaultValues })
  const [errors, setErrors] = useState({})
  const [creatingInstitution, setCreatingInstitution] = useState(false)

  const handleChange = (field) => (e) => setValues((prev) => ({ ...prev, [field]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    const nextErrors = validateRequiredFields(values, REQUIRED_FIELDS)
    if (values.institution === OTHER_INSTITUTION && !values.customInstitutionName.trim()) {
      nextErrors.institution = 'Type the name of your institution.'
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    if (values.institution === OTHER_INSTITUTION) {
      setCreatingInstitution(true)
      try {
        // Best-effort type — an admin can correct it later via /admin/; this
        // just needs to be a reasonable default so the record isn't untyped.
        const created = await apiPost('/institutions/', {
          name: values.customInstitutionName.trim(),
          type: 'school',
        })
        onSubmit({ ...values, institution: created.id })
      } catch {
        setErrors({ institution: "Couldn't add that institution — please try again." })
      } finally {
        setCreatingInstitution(false)
      }
      return
    }

    onSubmit(values)
  }

  return (
    <form className="space-y-md" onSubmit={handleSubmit} noValidate>
      <Combobox
        id="institution"
        label="Institution"
        required
        value={values.institution}
        onChange={handleChange('institution')}
        error={errors.institution}
        options={[
          ...institutions.map((inst) => ({ value: inst.id, label: inst.name })),
          { value: OTHER_INSTITUTION, label: 'Other (not listed — type your own)' },
        ]}
        placeholder="Type to search institutions..."
      />

      {values.institution === OTHER_INSTITUTION && (
        <FormField
          id="customInstitutionName"
          label="Your Institution's Name"
          required
          value={values.customInstitutionName}
          onChange={handleChange('customInstitutionName')}
          error={errors.customInstitutionName}
          placeholder="Enter the name of your institution"
        />
      )}

      <FormField
        id="roleTitle"
        label="Role Title"
        required
        value={values.roleTitle}
        onChange={handleChange('roleTitle')}
        error={errors.roleTitle}
        placeholder="e.g. School Counselor, Career Coach"
      />

      <SubmitButton submitting={submitting || creatingInstitution}>{submitLabel}</SubmitButton>
    </form>
  )
}
