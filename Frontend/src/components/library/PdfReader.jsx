import { useEffect, useRef, useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url'
import Icon from '../ui/Icon'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl

/**
 * Renders a PDF one page at a time onto a canvas we control (instead of an
 * <iframe>, which hands the PDF to the browser's own viewer and gives us no
 * way to know which page is on screen). Page navigation here is what lets
 * FreeBookReaderModal report automatic reading progress.
 */
export default function PdfReader({ data, initialPage = 1, onPageChange }) {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const pdfDocRef = useRef(null)
  const renderTaskRef = useRef(null)
  const [numPages, setNumPages] = useState(0)
  const [pageNum, setPageNum] = useState(initialPage)
  const [containerWidth, setContainerWidth] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    // pdf.js transfers (detaches) the buffer it's given to its worker, so a
    // shared `data` reference can't survive a second getDocument() call —
    // React StrictMode's double-invoke of this effect hits that exactly.
    // Handing it a copy keeps the caller's buffer intact either way.
    pdfjsLib
      .getDocument({ data: data.slice() })
      .promise.then((pdf) => {
        if (cancelled) return
        pdfDocRef.current = pdf
        setNumPages(pdf.numPages)
        setPageNum(Math.min(Math.max(initialPage, 1), pdf.numPages))
      })
      .catch(() => {
        if (!cancelled) setError('Could not open this book right now.')
      })
    return () => {
      cancelled = true
      pdfDocRef.current?.destroy()
    }
    // Only ever load `data` once per mount — initialPage is just the
    // starting point, not something that should reload the document.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  useEffect(() => {
    if (!containerRef.current) return
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width
      if (width) setContainerWidth(width)
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const pdf = pdfDocRef.current
    const canvas = canvasRef.current
    if (!pdf || !canvas || !containerWidth) return

    let cancelled = false
    pdf.getPage(pageNum).then((page) => {
      if (cancelled) return
      const unscaledWidth = page.getViewport({ scale: 1 }).width
      const scale = Math.min(2, (containerWidth - 32) / unscaledWidth)
      const viewport = page.getViewport({ scale })
      const outputScale = window.devicePixelRatio || 1

      canvas.width = Math.floor(viewport.width * outputScale)
      canvas.height = Math.floor(viewport.height * outputScale)
      canvas.style.width = `${viewport.width}px`
      canvas.style.height = `${viewport.height}px`

      renderTaskRef.current?.cancel()
      const task = page.render({
        canvasContext: canvas.getContext('2d'),
        viewport,
        transform: outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null,
      })
      renderTaskRef.current = task
      task.promise.catch(() => {})
    })
    return () => {
      cancelled = true
    }
  }, [pageNum, containerWidth])

  useEffect(() => {
    if (numPages > 0) onPageChange?.(pageNum, numPages)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNum, numPages])

  if (error) return <p className="text-error text-center py-xl">{error}</p>

  return (
    <div className="flex flex-col h-full">
      <div ref={containerRef} className="flex-1 min-h-0 overflow-y-auto flex items-start justify-center p-4">
        <canvas ref={canvasRef} className="shadow-lg rounded bg-white max-w-full" />
      </div>
      <div className="flex items-center justify-center gap-4 py-3 border-t border-outline-variant/20 shrink-0">
        <button
          onClick={() => setPageNum((p) => Math.max(1, p - 1))}
          disabled={pageNum <= 1}
          aria-label="Previous page"
          className="p-2 rounded-full hover:bg-surface-container disabled:opacity-30 transition-colors"
        >
          <Icon name="chevron_left" />
        </button>
        <span className="font-label-md text-label-md text-on-surface-variant tabular-nums">
          Page {pageNum} of {numPages || '…'}
        </span>
        <button
          onClick={() => setPageNum((p) => Math.min(numPages, p + 1))}
          disabled={pageNum >= numPages}
          aria-label="Next page"
          className="p-2 rounded-full hover:bg-surface-container disabled:opacity-30 transition-colors"
        >
          <Icon name="chevron_right" />
        </button>
      </div>
    </div>
  )
}
