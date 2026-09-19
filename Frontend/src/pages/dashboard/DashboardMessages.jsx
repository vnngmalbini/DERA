import { useState } from 'react'
import Icon from '../../components/ui/Icon'
import { useAuth } from '../../context/AuthContext'

// TODO(backend): replace with a real fetch, e.g. GET /api/messages/threads/
const THREADS = []

export default function DashboardMessages() {
  const { user } = useAuth()
  const [selected, setSelected] = useState(null)

  return (
    <>
      <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-lg">
        Messages
      </h1>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 shadow-sm flex flex-col md:flex-row min-h-[420px] overflow-hidden">
        <div className="w-full md:w-72 border-b md:border-b-0 md:border-r border-outline-variant/40">
          {THREADS.length === 0 ? (
            <div className="p-lg text-center">
              <Icon name="mail" className="text-on-surface-variant text-3xl mb-2" />
              <p className="font-body-md text-body-md text-on-surface-variant">No conversations yet.</p>
            </div>
          ) : (
            THREADS.map((thread) => (
              <button
                key={thread.id}
                onClick={() => setSelected(thread.id)}
                className={`w-full text-left px-md py-3 border-b border-outline-variant/20 hover:bg-surface-container transition-colors ${
                  selected === thread.id ? 'bg-secondary-container' : ''
                }`}
              >
                {thread.name}
              </button>
            ))
          )}
        </div>
        <div className="flex-1 flex items-center justify-center p-lg text-center">
          <div>
            <Icon name="forum" className="text-on-surface-variant text-4xl mb-3" />
            <p className="font-body-md text-body-md text-on-surface-variant max-w-xs">
              Messaging will connect to live conversations once the backend is wired up.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
