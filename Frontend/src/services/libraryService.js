import { apiDelete, apiGet, apiGetBlob, apiPatch, apiPost } from './apiClient'

export const fetchBookReviews = (bookId) => apiGet(`/books/${bookId}/reviews/`)

// Curated books are copyrighted, so this never serves the book's own text —
// it's a downloadable "DERA Book Brief" PDF (why recommended, key lessons,
// who should read it), typeset server-side. See Backend/library/pdf_export.py.
export const downloadBookBriefPdf = (bookId) => apiGetBlob(`/books/${bookId}/download/`)

export const fetchMyBooks = () => apiGet('/my-books/')
export const updateMyBook = (userBookId, payload) => apiPatch(`/my-books/${userBookId}/`, payload)
export const removeMyBook = (userBookId) => apiDelete(`/my-books/${userBookId}/`)

export const fetchReadingChallenges = () => apiGet('/reading-challenges/')
export const fetchReadingStats = () => apiGet('/reading-stats/')

// Self Development Library — real, public-domain books that can legally be
// read in full and downloaded (see Backend/library/management/commands/seed_free_books.py).
export const fetchFreeBooks = (params = '') => apiGet(`/free-books/${params}`)
export const downloadFreeBookPdf = (freeBookId) => apiGetBlob(`/free-books/${freeBookId}/download/`)

// Automatic, page-based reading progress for the in-app PDF reader — see
// FreeBookViewSet.progress. Upserts the youth's tracker entry for this book
// and flips it to completed once they reach the last page.
export const trackFreeBookProgress = (freeBookId, currentPage, totalPages) =>
  apiPost(`/free-books/${freeBookId}/progress/`, { current_page: currentPage, total_pages: totalPages })

// The youth's existing progress for one free book, if any — used to resume
// the reader at the last page they were on instead of always page 1.
export const fetchMyFreeBookProgress = (freeBookId) =>
  apiGet(`/my-books/?free_book=${freeBookId}`).then((res) => (res.results ?? res)[0] ?? null)
