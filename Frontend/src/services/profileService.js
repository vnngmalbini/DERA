import { apiPatch } from './apiClient'

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
