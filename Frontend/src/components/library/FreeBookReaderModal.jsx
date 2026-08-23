import { useEffect, useRef, useState } from 'react'
import Icon from '../ui/Icon'
import PdfReader from './PdfReader'
import DownloadPdfButton from './DownloadPdfButton'
import { downloadFreeBookPdf, fetchMyFreeBookProgress, trackFreeBookProgress } from '../../services/libraryService'

const PROGRESS_SAVE_DEBOUNCE_MS = 1000

export default function FreeBookReaderModal({ book, onClose }) {
  const [pdfData, setPdfData] = useState(null)
  const [initialPage, setInitialPage] = useState(1)
  const [error, setError] = useState('')
  const [progressPercent, setProgressPercent] = useState(null)

  const saveTimerRef = useRef(null)
  const latestProgressRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    setPdfData(null)
    setError('')

    Promise.all([downloadFreeBookPdf(book.id), fetchMyFreeBookProgress(book.id)])
      .then(async ([blob, existing]) => {
        if (cancelled) return
        setInitialPage(existing?.current_page || 1)
        setProgressPercent(existing?.progress_percent ?? null)
        setPdfData(new Uint8Array(await blob.arrayBuffer()))
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load this book right now. Please try again in a moment.")
      })

    return () => {
      cancelled = true
    }
  }, [book.id])

  const flushProgress = () => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    if (latestProgressRef.current) {
      const { currentPage, totalPages } = latestProgressRef.current
      trackFreeBookProgress(book.id, currentPage, totalPages).catch(() => {})
    }
  }

  // Save on every page turn (debounced against rapid clicking), and flush
  // immediately when the reader closes so the last page isn't lost.
  useEffect(() => () => flushProgress(), []) // eslint-disable-line react-hooks/exhaustive-deps

  const handlePageChange = (currentPage, totalPages) => {
    setProgressPercent(Math.round((100 * currentPage) / totalPages))
    latestProgressRef.current = { currentPage, totalPages }
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => {
      trackFreeBookProgress(book.id, currentPage, totalPages).catch(() => {})
    }, PROGRESS_SAVE_DEBOUNCE_MS)
  }

  const handleClose = () => {
    flushProgress()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full h-full flex flex-col border border-outline-variant/30">
        <div className="flex items-start justify-between gap-4 px-lg pt-lg pb-md border-b border-outline-variant/20 shrink-0">
          <div>
            <p className="font-label-sm text-label-sm text-tertiary uppercase tracking-wide mb-1 flex items-center gap-1.5">
              <Icon name="public" className="text-[14px]" />
              Free &amp; Public Domain
              {progressPercent !== null && (
                <span className="text-on-surface-variant normal-case tracking-normal">· {progressPercent}% read</span>
              )}
            </p>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">{book.title}</h3>
            <p className="font-label-md text-label-md text-on-surface-variant">{book.author}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <DownloadPdfButton
              book={book}
              className="px-3 py-2 rounded-full flex items-center gap-1.5 border border-outline-variant text-on-surface-variant font-label-sm text-label-sm hover:bg-surface-container transition-colors disabled:opacity-60"
            />
            <button
              onClick={handleClose}
              className="p-2 text-on-surface-variant hover:text-error transition-colors"
              aria-label="Close"
            >
              <Icon name="close" />
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0 bg-surface-container">
          {error ? (
            <p className="text-error text-center py-xl">{error}</p>
          ) : pdfData === null ? (
            <div className="flex items-center justify-center gap-2 text-on-surface-variant py-xl h-full">
              <Icon name="progress_activity" className="animate-spin" />
              Loading book…
            </div>
          ) : (
            <PdfReader data={pdfData} initialPage={initialPage} onPageChange={handlePageChange} />
          )}
        </div>
      </div>
    </div>
  )
}
