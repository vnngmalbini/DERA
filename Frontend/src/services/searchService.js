import { apiGet } from './apiClient'

export function search(query) {
  return apiGet(`/search/?q=${encodeURIComponent(query)}`)
}
