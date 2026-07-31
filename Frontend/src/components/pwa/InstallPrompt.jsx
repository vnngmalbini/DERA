import { useInstallPrompt } from '../../hooks/useInstallPrompt'
import Icon from '../ui/Icon'

export default function InstallPrompt() {
  const { shouldShow, canPromptInstall, showIosInstructions, promptInstall, dismiss } = useInstallPrompt()

  if (!shouldShow) return null

  return (
    <div className="fixed inset-x-0 bottom-24 md:bottom-6 z-[70] px-margin-mobile md:px-0 flex justify-center pointer-events-none">
      <div className="pointer-events-auto w-full max-w-md bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shadow-xl p-md flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-primary-container flex items-center justify-center shrink-0">
          <Icon name="spa" className="text-on-primary-container text-2xl" filled />
        </div>

        <div className="flex-1 min-w-0">
          {canPromptInstall ? (
            <>
              <p className="font-label-lg text-label-lg text-on-surface">Install DERA</p>
              <p className="font-body-md text-body-md text-on-surface-variant mb-3">
                Add DERA to your home screen for quick, full-screen access — even offline.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={promptInstall}
                  className="bg-primary text-on-primary font-label-md text-label-md px-4 py-2 rounded-full hover:shadow-md active:scale-95 transition-all"
                >
                  Install App
                </button>
                <button
                  onClick={dismiss}
                  className="text-on-surface-variant font-label-md text-label-md px-4 py-2 rounded-full hover:bg-surface-container transition-colors"
                >
                  Not now
                </button>
              </div>
            </>
          ) : showIosInstructions ? (
            <>
              <p className="font-label-lg text-label-lg text-on-surface">Install DERA on your iPhone</p>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Tap <Icon name="ios_share" className="text-[16px] align-text-bottom mx-0.5" /> Share, then
                select <span className="font-semibold text-on-surface">"Add to Home Screen"</span>.
              </p>
              <button
                onClick={dismiss}
                className="mt-3 text-on-surface-variant font-label-md text-label-md px-4 py-2 rounded-full hover:bg-surface-container transition-colors -ml-4"
              >
                Got it
              </button>
            </>
          ) : null}
        </div>

        <button
          onClick={dismiss}
          aria-label="Dismiss install prompt"
          className="text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-container transition-colors shrink-0"
        >
          <Icon name="close" className="text-[20px]" />
        </button>
      </div>
    </div>
  )
}
