import { apiGet, apiPost } from './apiClient'

export function fetchLibrarianHistory() {
  return apiGet('/librarian-messages/')
}

export function sendLibrarianMessage(content) {
  return apiPost('/librarian-messages/', { content })
}
