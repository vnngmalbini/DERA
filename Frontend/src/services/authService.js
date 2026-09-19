import { apiPost } from './apiClient'

export function requestPasswordReset(email) {
  return apiPost('/auth/password-reset/', { email })
}

export function confirmPasswordReset({ uid, token, newPassword }) {
  return apiPost('/auth/password-reset-confirm/', { uid, token, new_password: newPassword })
}
