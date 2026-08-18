import { useState } from 'react'
import Icon from '../ui/Icon'
import { downloadBookBriefPdf, downloadFreeBookPdf } from '../../services/libraryService'

// A plain <a href={epub_url}> would save under Gutenberg's own filename
// (e.g. "pg2944-images-3.epub") since browsers ignore the `download`
// attribute's suggested filename for cross-origin links. Fetching the file
// ourselves and saving it via a blob: object URL (same-origin) lets us
// give it the book's real title instead.
async function triggerPdfDownload(book) {
  // Free (public-domain) books download the real full text; curated,
  // copyrighted books download DERA's own "Book Brief" summary instead —
  // see Backend/library/pdf_export.py for why the two can't be the same.
  const isFree = book.kind === 'free_book'
  const blob = isFree ? await downloadFreeBookPdf(book.id) : await downloadBookBriefPdf(book.id)
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download =
    `${book.title} - ${book.author}${isFree ? '' : ' (DERA Book Brief)'}`
      .replace(/[^\w\s-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim() + '.pdf'
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export default function DownloadPdfButton({ book, className }) {
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState(false)

  const handleClick = async () => {
    setBusy(true)
    setFailed(false)
    try {
      await triggerPdfDownload(book)
    } catch {
      setFailed(true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      aria-label={failed ? 'PDF download failed, try again' : 'Download PDF'}
      title={failed ? 'PDF download failed — try again' : 'Download PDF'}
      className={className}
    >
      <Icon
        name={busy ? 'progress_activity' : failed ? 'error' : 'picture_as_pdf'}
        className={`text-[16px] ${busy ? 'animate-spin' : ''} ${failed ? 'text-error' : ''}`}
      />
      {failed ? 'Try again' : 'Download PDF'}
    </button>
  )
}
