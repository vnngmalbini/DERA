import { useEffect, useState } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import Icon from '../ui/Icon'

/**
 * registerType is 'autoUpdate' (see vite.config.js), so new versions are
 * detected and activated automatically — this just gives the user a brief,
 * friendly heads-up rather than an unexplained page refresh.
 */
export default function UpdateToast() {
  const [visible, setVisible] = useState(false)
  const [message, setMessage] = useState('')

  const { offlineReady, needRefresh, setOfflineReady, setNeedRefresh } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      registration?.update?.().catch(() => {})
    },
  })

  useEffect(() => {
    // if (offlineReady[0]) {
    //   setMessage('DERA is ready to work offline.')
    //   setVisible(true)
    // } else
    if (needRefresh[0]) {
      setMessage('Updating to the latest version...')
      setVisible(true)
    }
  }, [offlineReady, needRefresh])

  useEffect(() => {
    if (!visible) return
    const timer = setTimeout(() => {
      setVisible(false)
      setOfflineReady(false)
      setNeedRefresh(false)
    }, 4000)
    return () => clearTimeout(timer)
  }, [visible, setOfflineReady, setNeedRefresh])

  if (!visible) return null

  return (
    <div className="fixed top-4 inset-x-0 z-[80] flex justify-center px-margin-mobile pointer-events-none">
      <div className="pointer-events-auto bg-on-surface text-inverse-on-surface font-label-md text-label-md px-4 py-3 rounded-full shadow-lg flex items-center gap-2">
        <Icon name="check_circle" className="text-[18px] text-primary-fixed-dim" />
        {message}
      </div>
    </div>
  )
}
