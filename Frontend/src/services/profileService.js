import { apiPatch, apiPatchForm, apiPost } from './apiClient'

const ENDPOINTS = {
  youth: 'youth-profiles',
  counselor: 'counselor-profiles',
  donor: 'donor-profiles',
}

export async function submitProfile(role, profileId, payload) {
  const endpoint = ENDPOINTS[role]
  if (!endpoint || !profileId) {
    throw new Error('Cannot submit profile: missing role or profile id')
  }
  return apiPatch(`/${endpoint}/${profileId}/`, payload)
}

// Forms collect camelCase values; the backend expects snake_case fields.
// full_name is carried through as-is rather than collected by the forms
// themselves, since it's already captured at signup.
export function toSnakeCasePayload(role, values, fullName) {
  if (role === 'youth') {
    return {
      full_name: fullName,
      date_of_birth: values.dateOfBirth || null,
      region: values.region,
      district: values.district,
      education_level: values.educationLevel,
      institution: values.institution || null,
      custom_institution_name: values.customInstitutionName || '',
      gender: values.gender,
    }
  }
  if (role === 'counselor') {
    return {
      full_name: fullName,
      institution: values.institution,
      custom_institution_name: values.customInstitutionName || '',
      role_title: values.roleTitle,
    }
  }
  return {
    full_name: fullName,
    organization: values.organization,
    donor_type: values.donorType,
  }
}

export function changePassword(oldPassword, newPassword) {
  return apiPost('/auth/change-password/', { old_password: oldPassword, new_password: newPassword })
}

export function uploadProfilePicture(file) {
  const formData = new FormData()
  formData.append('profile_picture', file)
  return apiPatchForm('/auth/me/', formData)
}
