import { apiGet, apiPost } from './apiClient'

export const fetchNotifications = () => apiGet('/notifications/')
export const markNotificationRead = (id) => apiPost(`/notifications/${id}/mark_read/`)
export const markAllNotificationsRead = () => apiPost('/notifications/mark-all-read/')
