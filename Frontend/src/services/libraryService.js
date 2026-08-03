import { apiDelete, apiGet, apiPatch, apiPost } from './apiClient'

export const fetchBooks = (params = '') => apiGet(`/books/${params}`)
export const fetchBookReviews = (bookId) => apiGet(`/books/${bookId}/reviews/`)

export const fetchMyBooks = () => apiGet('/my-books/')
export const addBookToTracker = (bookId, status = 'want_to_read') =>
  apiPost('/my-books/', { book_id: bookId, status })
export const updateMyBook = (userBookId, payload) => apiPatch(`/my-books/${userBookId}/`, payload)
export const removeMyBook = (userBookId) => apiDelete(`/my-books/${userBookId}/`)

export const fetchReadingChallenges = () => apiGet('/reading-challenges/')
export const fetchReadingStats = () => apiGet('/reading-stats/')
