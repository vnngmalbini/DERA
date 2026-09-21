import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Icon from '../ui/Icon'
import { sendAuntieMessage } from '../../services/auntieService'

const QUICK_LINKS = [
  { label: 'Chat with AI Counsellor', to: '/ai-chat', icon: 'chat_bubble' },
  { label: 'Scholarships', to: '/scholarships', icon: 'school' },
  { label: 'Career quiz', to: '/career-quiz', icon: 'psychology' },
  { label: 'Forms', to: '/forms', icon: 'assignment' },
  { label: 'Help centre', to: '/help', icon: 'support_agent' },
]

const SUGGESTIONS = [
  'I need help finding a scholarship',
  'I am not sure what to do next',
  'How can DERA help me?',
]

const WELCOME_MESSAGE = 'Hi, I’m Auntie DERA. Tell me what you’re looking for and I’ll help you find the right place to start.'
const ERROR_MESSAGE = 'I’m having trouble replying right now. You can use the quick links below, or try again in a moment.'

let temporaryId = 0

function getLocalReply(message) {
  const text = message.toLowerCase()
  if (text.includes('scholarship') || text.includes('grant') || text.includes('funding')) {
    return 'You can find available scholarships in the Scholarships section. I can also take you to the Career Quiz so you can explore a path that fits your goals.'
  }
  if (
    text.includes('career') ||
    text.includes('what should i do') ||
    text.includes('not sure') ||
    text.includes('locate') ||
    text.includes('where') ||
    text.includes('find')
  ) {
    return 'The Career Quiz is a good place to start. It helps you explore strengths, interests, and career paths before you choose your next step.'
  }
  if (text.includes('form') || text.includes('application')) {
    return 'You can find application forms in the Forms Marketplace. Open it from the quick links below to browse what is available.'
  }
  if (text.includes('help') || text.includes('support')) {
    return 'The Help Centre is the best place for personal support. You can open it from the quick links below and send a request if you need someone to follow up.'
  }
  return null
}

export default function GlobalAssistant() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState([])
  const bottomRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping, open])

  function openChat() {
    setOpen(true)
    if (messages.length === 0) setMessages([{ id: 'welcome', from: 'bot', text: WELCOME_MESSAGE }])
  }

  function closeChat() {
    setOpen(false)
  }

  async function sendMessage(text) {
    const trimmed = text.trim()
    if (!trimmed || isTyping) return

    const userMessage = { id: temporaryId++, from: 'user', text: trimmed }
    const history = messages.map(({ from, text: messageText }) => ({ from, text: messageText }))
    const localReply = getLocalReply(trimmed)
    setMessages((current) => [...current, userMessage])
    setInput('')

    if (localReply) {
      setMessages((current) => [...current, { id: temporaryId++, from: 'bot', text: localReply }])
      return
    }

    setIsTyping(true)

    try {
      const response = await sendAuntieMessage(trimmed, history)
      setMessages((current) => [
        ...current,
        { id: temporaryId++, from: 'bot', text: response?.reply || getLocalReply(trimmed) || ERROR_MESSAGE },
      ])
    } catch {
      setMessages((current) => [
        ...current,
        { id: temporaryId++, from: 'bot', text: getLocalReply(trimmed) || ERROR_MESSAGE },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    sendMessage(input)
  }

  return (
    <div className="fixed bottom-6 right-4 z-[70] sm:right-6">
      {open && (
        <section
          aria-label="Chat with Auntie DERA"
          className="mb-3 flex h-[min(38rem,calc(100vh-7rem))] w-[min(92vw,23rem)] flex-col overflow-hidden rounded-2xl border border-outline-variant/70 bg-surface-container-lowest shadow-[0_18px_50px_rgba(31,45,34,0.2)]"
        >
          <header className="flex items-center justify-between gap-3 border-b border-outline-variant/50 bg-primary px-4 py-3 text-on-primary">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-surface text-primary">
                <Icon name="support_agent" filled className="text-xl" />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-primary bg-[#8bc34a]" />
              </div>
              <div>
                <p className="font-label-md text-label-md font-bold">Auntie DERA</p>
                <p className="font-label-sm text-label-sm opacity-80">Here to help you find your way</p>
              </div>
            </div>
            <button type="button" aria-label="Close chat" onClick={closeChat} className="rounded-full p-2 hover:bg-white/15">
              <Icon name="close" />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto bg-background/60 px-3 py-4">
            <div className="space-y-3">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[88%] whitespace-pre-wrap px-3.5 py-2.5 font-body-sm text-body-sm leading-relaxed ${
                      message.from === 'user'
                        ? 'rounded-2xl rounded-br-sm bg-primary text-on-primary'
                        : 'rounded-2xl rounded-bl-sm border border-outline-variant/50 bg-surface-container text-on-surface'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-1.5 px-3 text-on-surface-variant" aria-label="Auntie DERA is typing">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary [animation-delay:300ms]" />
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </div>

          <div className="border-t border-outline-variant/50 bg-surface px-3 pb-3 pt-2">
            {messages.length <= 1 && (
              <div className="mb-2 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => sendMessage(suggestion)}
                    className="shrink-0 rounded-full border border-outline-variant px-3 py-1.5 font-label-sm text-label-sm text-on-surface-variant hover:border-primary hover:text-primary"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            <div className="mb-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <span className="shrink-0 font-label-sm text-label-sm text-on-surface-variant">Go to:</span>
              {QUICK_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={closeChat}
                  aria-current={location.pathname === link.to ? 'page' : undefined}
                  className="flex shrink-0 items-center gap-1 rounded-full bg-secondary-container/30 px-2.5 py-1.5 font-label-sm text-label-sm text-on-surface hover:bg-secondary-container"
                >
                  <Icon name={link.icon} className="text-sm" />
                  {link.label}
                </Link>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex items-center gap-2 rounded-xl border border-outline-variant bg-surface-container px-2 py-1.5 focus-within:border-primary">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                disabled={isTyping}
                aria-label="Message Auntie DERA"
                placeholder="Type your message..."
                className="min-w-0 flex-1 bg-transparent px-2 py-2 font-body-sm text-body-sm text-on-surface outline-none placeholder:text-on-surface-variant/60"
              />
              <button
                type="submit"
                disabled={isTyping || !input.trim()}
                aria-label="Send message"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-on-primary disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Icon name="send" filled className="text-lg" />
              </button>
            </form>
            <p className="mt-2 text-center font-label-sm text-label-sm text-on-surface-variant/60">Your chat is private and not saved</p>
          </div>
        </section>
      )}

      <button
        type="button"
        aria-label={open ? 'Close website assistant' : 'Open website assistant'}
        onClick={open ? closeChat : openChat}
        className="relative flex h-14 w-14 items-center justify-center rounded-full border-4 border-surface bg-primary text-on-primary shadow-xl transition-transform active:scale-95 hover:scale-[1.02]"
      >
        <Icon name={open ? 'close' : 'support_agent'} filled className="text-2xl" />
        {!open && <span className="absolute right-0 top-0 h-3 w-3 rounded-full border-2 border-surface bg-[#8bc34a]" />}
      </button>
    </div>
  )
}
