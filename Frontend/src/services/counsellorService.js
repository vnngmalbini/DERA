import { apiGet, apiPost } from './apiClient'

export function fetchCounsellorHistory() {
  return apiGet('/counsellor-messages/')
}

export function sendCounsellorMessage(content) {
  return apiPost('/counsellor-messages/', { content })
}
