import { apiDelete, apiGet, apiGetBlob, apiPatch, apiPost } from './apiClient'

export const fetchBooks = (params = '') => apiGet(`/books/${params}`)
export const fetchBookReviews = (bookId) => apiGet(`/books/${bookId}/reviews/`)

// Curated books are copyrighted, so this never serves the book's own text —
// it's a downloadable "DERA Book Brief" PDF (why recommended, key lessons,
// who should read it), typeset server-side. See Backend/library/pdf_export.py.
export const downloadBookBriefPdf = (bookId) => apiGetBlob(`/books/${bookId}/download/`)

export const fetchMyBooks = () => apiGet('/my-books/')
export const addBookToTracker = (bookId, status = 'want_to_read') =>
  apiPost('/my-books/', { book_id: bookId, status })
export const updateMyBook = (userBookId, payload) => apiPatch(`/my-books/${userBookId}/`, payload)
export const removeMyBook = (userBookId) => apiDelete(`/my-books/${userBookId}/`)

export const fetchReadingChallenges = () => apiGet('/reading-challenges/')
export const fetchReadingStats = () => apiGet('/reading-stats/')

// Self Development Library — real, public-domain books that can legally be
// read in full and downloaded (see Backend/library/management/commands/seed_free_books.py).
export const fetchFreeBooks = (params = '') => apiGet(`/free-books/${params}`)
export const fetchFreeBookText = (freeBookId) => apiGet(`/free-books/${freeBookId}/read/`)
export const downloadFreeBookPdf = (freeBookId) => apiGetBlob(`/free-books/${freeBookId}/download/`)
