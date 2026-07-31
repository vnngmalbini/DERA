import { useEffect, useMemo, useState } from 'react'
import FormField from '../ui/FormField'
import Combobox from '../ui/Combobox'
import SubmitButton from '../ui/SubmitButton'
import { validateRequiredFields } from '../../utils/formValidation'
import { apiGet, apiPost } from '../../services/apiClient'

const OTHER_INSTITUTION = '__other__'

// Best-effort type for an institution the user typed in themselves — an
// admin can always correct it later via /admin/; this just needs to be a
// reasonable default so the record isn't left untyped.
function inferInstitutionType(educationLevel) {
  if (educationLevel === 'tertiary' || educationLevel === 'shs_graduate') return 'university'
  return 'school'
}

const REGIONS = [
  'Ahafo',
  'Ashanti',
  'Bono',
  'Bono East',
  'Central',
  'Eastern',
  'Greater Accra',
  'North East',
  'Northern',
  'Oti',
  'Savannah',
  'Upper East',
  'Upper West',
  'Volta',
  'Western',
  'Western North',
]

const EDUCATION_LEVELS = [
  { value: 'jhs', label: 'Junior High School (JHS)' },
  { value: 'shs', label: 'Senior High School (SHS)' },
  { value: 'shs_graduate', label: 'SHS Graduate' },
  { value: 'tertiary', label: 'Tertiary' },
  { value: 'dropout_re_entry', label: 'Dropout Re-entry' },
  { value: 'teen_mother_program', label: 'Teen Mother Program' },
]

// Which Institution.type values are relevant for each education level —
// drives the institution dropdown filtering below. Levels not listed here
// (dropout re-entry, teen mother program) don't have an institution field
// at all — those students aren't currently enrolled anywhere, so asking
// for one would block them from continuing.
const TERTIARY_TYPES = ['university', 'technical_university', 'college_of_education', 'tvet_centre']
const LEVEL_TO_INSTITUTION_TYPES = {
  jhs: ['school'],
  shs: ['school'],
  shs_graduate: TERTIARY_TYPES,
  tertiary: TERTIARY_TYPES,
}

const GENDERS = ['Female', 'Male', 'Prefer not to say']

const BASE_REQUIRED_FIELDS = ['dateOfBirth', 'region', 'district', 'educationLevel', 'gender']

function institutionApplies(educationLevel) {
  return Object.prototype.hasOwnProperty.call(LEVEL_TO_INSTITUTION_TYPES, educationLevel)
}

export default function YouthProfileForm({ onSubmit, submitting, institutions = [] }) {
  const [values, setValues] = useState({
    dateOfBirth: '',
    region: '',
    district: '',
    educationLevel: '',
    institution: '',
    customInstitutionName: '',
    gender: '',
  })
  const [errors, setErrors] = useState({})
  const [districts, setDistricts] = useState([])
  const [districtsLoading, setDistrictsLoading] = useState(false)
  const [creatingInstitution, setCreatingInstitution] = useState(false)

  useEffect(() => {
    if (!values.region) {
      setDistricts([])
      return
    }
    setDistrictsLoading(true)
    apiGet(`/districts/?region=${encodeURIComponent(values.region)}`)
      .then((data) => setDistricts(data.results ?? data))
      .catch(() => setDistricts([]))
      .finally(() => setDistrictsLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.region])

  const filteredInstitutions = useMemo(() => {
    const relevantTypes = LEVEL_TO_INSTITUTION_TYPES[values.educationLevel]
    if (!relevantTypes) return []
    return institutions.filter((inst) => relevantTypes.includes(inst.type))
  }, [institutions, values.educationLevel])

  const handleChange = (field) => (e) => {
    const value = e.target.value
    setValues((prev) => {
      if (field === 'region' && value !== prev.region) {
        // District options depend on region — clear the stale selection.
        return { ...prev, region: value, district: '' }
      }
      if (field === 'educationLevel' && value !== prev.educationLevel) {
        // Institution options depend on education level — clear the stale selection.
        return { ...prev, educationLevel: value, institution: '', customInstitutionName: '' }
      }
      return { ...prev, [field]: value }
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const needsInstitution = institutionApplies(values.educationLevel)
    const requiredFields = needsInstitution ? [...BASE_REQUIRED_FIELDS, 'institution'] : BASE_REQUIRED_FIELDS
    const nextErrors = validateRequiredFields(values, requiredFields)

    if (values.dateOfBirth && !nextErrors.dateOfBirth) {
      const dob = new Date(values.dateOfBirth)
      const ageYears = (Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
      if (Number.isNaN(dob.getTime()) || dob > new Date()) {
        nextErrors.dateOfBirth = 'Enter a valid date of birth.'
      } else if (ageYears < 10 || ageYears > 100) {
        nextErrors.dateOfBirth = 'Please double-check this date of birth.'
      }
    }

    if (needsInstitution && values.institution === OTHER_INSTITUTION && !values.customInstitutionName.trim()) {
      nextErrors.institution = 'Type the name of your institution.'
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    if (!needsInstitution) {
      onSubmit({ ...values, institution: '', customInstitutionName: '' })
      return
    }

    if (values.institution === OTHER_INSTITUTION) {
      setCreatingInstitution(true)
      try {
        const created = await apiPost('/institutions/', {
          name: values.customInstitutionName.trim(),
          type: inferInstitutionType(values.educationLevel),
          region: values.region,
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
        <FormField
          id="dateOfBirth"
          label="Date of Birth"
          type="date"
          required
          value={values.dateOfBirth}
          onChange={handleChange('dateOfBirth')}
          error={errors.dateOfBirth}
        />
        <FormField
          id="gender"
          label="Gender"
          type="select"
          required
          value={values.gender}
          onChange={handleChange('gender')}
          error={errors.gender}
          options={GENDERS}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
        <FormField
          id="region"
          label="Region"
          type="select"
          required
          value={values.region}
          onChange={handleChange('region')}
          error={errors.region}
          options={REGIONS}
        />
        <Combobox
          id="district"
          label={districtsLoading ? 'District (loading…)' : 'District'}
          required
          value={values.district}
          onChange={handleChange('district')}
          error={errors.district}
          options={districts.map((d) => ({ value: d.name, label: d.name }))}
          placeholder={values.region ? 'Type to search districts...' : 'Choose a region first'}
          disabled={!values.region}
        />
      </div>

      <FormField
        id="educationLevel"
        label="Education Level"
        type="select"
        required
        value={values.educationLevel}
        onChange={handleChange('educationLevel')}
        error={errors.educationLevel}
        options={EDUCATION_LEVELS}
      />

      {institutionApplies(values.educationLevel) && (
        <>
          <Combobox
            id="institution"
            label="Institution"
            required
            value={values.institution}
            onChange={handleChange('institution')}
            error={errors.institution}
            options={[
              ...filteredInstitutions.map((inst) => ({ value: inst.id, label: inst.name })),
              { value: OTHER_INSTITUTION, label: "Other (not listed — type your own)" },
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
              placeholder="Enter the name of your school or institution"
            />
          )}
        </>
      )}

      <SubmitButton submitting={submitting || creatingInstitution} />
    </form>
  )
}
