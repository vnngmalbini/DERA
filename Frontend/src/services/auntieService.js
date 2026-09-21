import { apiPostAnonymous } from './apiClient'

export function sendAuntieMessage(message, history) {
  return apiPostAnonymous('/auntie-chat/', { message, history }, { timeoutMs: 12000 })
}
