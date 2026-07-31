import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import Icon from '../components/ui/Icon'

const SUGGESTIONS = ['How do I transfer credits?', 'Help with budgeting', 'Career change advice']

const CANNED_REPLIES = [
  "Thanks for sharing that. Based on what you've told me, I'd recommend starting with our re-enrollment checklist and checking your eligibility for the Rural Bright Stars Award.",
  "That's a great question. Many students in your situation qualify for reduced tuition through DERA's returning-student track. Would you like me to connect you with a mentor who's been through this?",
  "I hear you. Let's break this down into small steps so it feels less overwhelming first, could you tell me a bit more about your current situation?",
  "Got it, I've noted that. You can also explore the Scholarships hub for funding options tailored to your situation.",
]

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

let messageId = 3

const INITIAL_MESSAGES = [
  {
    id: 1,
    role: 'user',
    time: '10:42 AM',
    content: (
      <p className="text-body-md">
        I dropped out two years ago because of money, but I want to go back. Is it too late?
      </p>
    ),
  },
  {
    id: 2,
    role: 'assistant',
    time: '10:43 AM',
    content: (
      <div className="flex flex-col gap-4">
        <p className="text-body-md font-medium">
          It is absolutely not too late. In fact, many students return with more clarity and determination after a
          break.
        </p>
        <p className="text-body-md">
          Your experience in the last two years is valuable. DERA has specific re-entry paths designed for students
          who took a financial hiatus. We can help you navigate the academic credit recovery and find funding to
          ensure you stay this time.
        </p>
        <div className="bg-surface-container-lowest p-4 rounded-lg border border-secondary/20 flex flex-col gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary-container rounded-full flex items-center justify-center shrink-0">
              <Icon name="auto_awesome" className="text-secondary" />
            </div>
            <div>
              <h4 className="font-label-lg text-label-lg text-primary">Rural Bright Stars Award</h4>
              <p className="text-xs text-on-surface-variant">Financial aid for returning students</p>
            </div>
          </div>
          <p className="text-sm text-on-surface-variant">
            This scholarship specifically targets individuals returning to finish their degrees after a gap of 1+
            years. It covers up to 75% of tuition fees.
          </p>
          <button className="bg-secondary-container text-on-secondary-fixed font-semibold px-4 py-2 rounded-lg text-sm self-start hover:opacity-90 transition-all flex items-center gap-2">
            Check Eligibility
            <Icon name="arrow_forward" className="text-sm" />
          </button>
        </div>
        <p className="text-body-md">
          Would you like to see the re-enrollment checklist or speak with a mentor who has been through a similar
          journey?
        </p>
      </div>
    ),
    actions: [
      { icon: 'person_search', label: 'Find a Mentor' },
      { icon: 'school', label: 'View Scholarships' },
      { icon: 'task_alt', label: 'Re-enrollment Guide' },
    ],
  },
]

export default function AiChat() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  function sendMessage(text) {
    const trimmed = text.trim()
    if (!trimmed) return

    const userMessage = {
      id: messageId++,
      role: 'user',
      time: formatTime(new Date()),
      content: <p className="text-body-md">{trimmed}</p>,
    }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const reply = CANNED_REPLIES[Math.floor(Math.random() * CANNED_REPLIES.length)]
      setMessages((prev) => [
        ...prev,
        {
          id: messageId++,
          role: 'assistant',
          time: formatTime(new Date()),
          content: <p className="text-body-md">{reply}</p>,
        },
      ])
      setIsTyping(false)
    }, 1200)
  }

  function handleSubmit(e) {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <PageLayout bare>
      <div className="h-screen flex flex-col bg-background">
        <header className="sticky top-0 z-10 flex items-center gap-3 px-margin-mobile h-16 border-b border-outline-variant/30 bg-surface/80 backdrop-blur-md shrink-0">
          <Link
            to="/"
            className="p-2 rounded-full text-on-surface hover:bg-secondary-container/20 transition-colors"
            aria-label="Back"
          >
            <Icon name="arrow_back" />
          </Link>
          <div className="flex flex-col leading-tight">
            <h1 className="font-headline-sm text-headline-sm text-on-surface">AI Career Assistant</h1>
            <div className="flex items-center gap-1 text-secondary font-label-sm text-label-sm uppercase tracking-wider">
              <Icon name="security" className="text-[14px]" filled />
              Secure Anonymous Session
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl w-full mx-auto px-margin-mobile md:px-margin-desktop py-6 flex flex-col gap-6">
            <p className="text-on-surface-variant max-w-2xl -mt-2 mb-2">
              Ask anything about re-enrolling, funding, or career paths. Your identity is protected under{' '}
              <strong>User #429</strong>.
            </p>

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex w-full ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] md:max-w-[70%] ${message.role === 'assistant' ? 'md:max-w-[75%]' : ''}`}>
                  <div
                    className={`flex items-center gap-2 mb-1 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-6 h-6 bg-secondary-container rounded-full flex items-center justify-center">
                        <Icon name="smart_toy" className="text-[14px] text-on-secondary-fixed" filled />
                      </div>
                    )}
                    <span
                      className={`font-label-sm text-label-sm ${
                        message.role === 'assistant' ? 'text-on-surface font-bold' : 'text-on-surface-variant'
                      }`}
                    >
                      {message.role === 'assistant' ? 'DERA Assistant' : 'User #429'}
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant/60">{message.time}</span>
                  </div>

                  {message.role === 'user' ? (
                    <div className="bg-primary-container text-on-primary-container px-5 py-4 rounded-xl rounded-br-[2px] shadow-sm">
                      {message.content}
                    </div>
                  ) : (
                    <div className="bg-surface-container-highest text-on-surface px-5 py-5 rounded-xl rounded-bl-[2px] shadow-sm border border-outline-variant/30">
                      {message.content}
                    </div>
                  )}

                  {message.actions && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {message.actions.map((action) => (
                        <button
                          key={action.label}
                          className="bg-surface-container-high hover:bg-secondary-container/30 text-primary border border-outline-variant py-2 px-4 rounded-full text-sm font-semibold transition-all flex items-center gap-2"
                        >
                          <Icon name={action.icon} className="text-[18px]" />
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start items-center gap-2 text-on-surface-variant/40 animate-pulse">
                <Icon name="more_horiz" className="text-sm" />
                <span className="text-xs italic">Assistant is thinking...</span>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        <div className="shrink-0 border-t border-outline-variant/30 bg-background px-margin-mobile pt-4 pb-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-2">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => sendMessage(suggestion)}
                  className="whitespace-nowrap bg-surface-container-lowest border border-outline-variant px-4 py-2 rounded-full text-xs font-semibold hover:bg-secondary-container/20 transition-all"
                >
                  "{suggestion}"
                </button>
              ))}
            </div>
            <form
              onSubmit={handleSubmit}
              className="relative flex items-center bg-surface-container-lowest/80 backdrop-blur-md rounded-2xl border border-outline-variant shadow-xl overflow-hidden focus-within:border-secondary transition-all"
            >
              <button type="button" className="p-4 text-on-surface-variant hover:text-secondary">
                <Icon name="add_circle" />
              </button>
              <input
                className="w-full bg-transparent border-none focus:ring-0 py-4 px-2 text-on-surface placeholder:text-on-surface-variant/50"
                placeholder="Type your question here..."
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <div className="flex items-center gap-2 pr-4">
                <button type="button" className="p-2 text-on-surface-variant hover:text-secondary">
                  <Icon name="mic" />
                </button>
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-container text-on-primary w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95"
                >
                  <Icon name="send" filled />
                </button>
              </div>
            </form>
            <p className="text-center text-[10px] text-on-surface-variant/60 mt-3 uppercase tracking-widest font-semibold">
              End-to-end encrypted session &bull; DERA AI v4.2
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
