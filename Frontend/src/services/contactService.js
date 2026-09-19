import { apiPostAnonymous } from './apiClient'

export function submitContactMessage({ name, email, message }) {
  return apiPostAnonymous('/contact-messages/', { name, email, message })
}
