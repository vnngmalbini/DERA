import { useEffect, useState } from 'react'
import Icon from '../ui/Icon'
import { fetchFreeBookText } from '../../services/libraryService'
import DownloadPdfButton from './DownloadPdfButton'

export default function FreeBookReaderModal({ book, onClose }) {
  const [text, setText] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setText(null)
    setError('')
    fetchFreeBookText(book.id)
      .then((data) => {
        if (!cancelled) setText(data.content)
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load this book right now. Please try again in a moment.")
      })
    return () => {
      cancelled = true
    }
  }, [book.id])

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center px-margin-mobile py-lg">
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl max-w-6xl w-[95vw] max-h-[90vh] flex flex-col border border-outline-variant/30">
        <div className="flex items-start justify-between gap-4 px-lg pt-lg pb-md border-b border-outline-variant/20 shrink-0">
          <div>
            <p className="font-label-sm text-label-sm text-tertiary uppercase tracking-wide mb-1 flex items-center gap-1.5">
              <Icon name="public" className="text-[14px]" />
              Free &amp; Public Domain
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
              onClick={onClose}
              className="p-2 text-on-surface-variant hover:text-error transition-colors"
              aria-label="Close"
            >
              <Icon name="close" />
            </button>
          </div>
        </div>

        <div className="px-lg py-md overflow-y-auto flex-1">
          {error ? (
            <p className="text-error text-center py-xl">{error}</p>
          ) : text === null ? (
            <div className="flex items-center justify-center gap-2 text-on-surface-variant py-xl">
              <Icon name="progress_activity" className="animate-spin" />
              Loading book…
            </div>
          ) : (
            <pre className="font-body-md text-body-md text-on-surface whitespace-pre-wrap font-sans max-w-3xl mx-auto">
              {text}
            </pre>
          )}
        </div>
      </div>
    </div>
  )
}
