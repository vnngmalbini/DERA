import { useEffect, useRef, useState } from 'react'

/**
 * Fades + slides a section in the first time it scrolls into view. Stays
 * visible afterward (no re-hiding on scroll back up) — a repeating reveal
 * reads as flicker on a page you're scrolling through more than once.
 * Skips the animation entirely if the section is already on screen at
 * mount (e.g. a short page, or a deep-link), so nothing above the fold
 * ever starts invisible.
 */
export default function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...props }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const rect = node.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={`${visible ? 'animate-fade-in-up' : 'opacity-0'} ${className}`}
      style={visible ? { animationDelay: `${delay}ms` } : undefined}
      {...props}
    >
      {children}
    </Tag>
  )
}
