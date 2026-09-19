import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import DashboardPageHeader from '../components/dashboard/DashboardPageHeader'
import { useAuth } from '../context/AuthContext'
import { fetchCounsellorHistory, sendCounsellorMessage } from '../services/counsellorService'

const SUGGESTIONS = [
  "I don't know what career to choose",
  'What careers fit someone who likes helping others?',
  'Help me figure out my strengths',
]

const ERROR_TEXT = "Something went wrong on my end. Could you try sending that again?"

function formatTime(isoOrDate) {
  const date = isoOrDate instanceof Date ? isoOrDate : new Date(isoOrDate)
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

let tempId = -1

export default function AiChat() {
  const { user, isLoggedIn, loading: authLoading } = useAuth()
  const [messages, setMessages] = useState([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef(null)

  const authorized = isLoggedIn && user?.role === 'youth'

  useEffect(() => {
    if (!authorized) {
      setHistoryLoading(false)
      return
    }
    let cancelled = false
    fetchCounsellorHistory()
      .then((history) => {
        if (cancelled) return
        setMessages(
          history.map((m) => ({
            id: m.id,
            role: m.role,
            time: formatTime(m.created_at),
            content: <p className="text-body-md whitespace-pre-wrap">{m.content}</p>,
          })),
        )
      })
      .finally(() => {
        if (!cancelled) setHistoryLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [authorized])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  async function sendMessage(text) {
    const trimmed = text.trim()
    if (!trimmed || isTyping) return

    setMessages((prev) => [
      ...prev,
      {
        id: tempId--,
        role: 'user',
        time: formatTime(new Date()),
        content: <p className="text-body-md">{trimmed}</p>,
      },
    ])
    setInput('')
    setIsTyping(true)

    try {
      const [, assistantMessage] = await sendCounsellorMessage(trimmed)
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessage.id,
          role: 'assistant',
          time: formatTime(assistantMessage.created_at),
          content: <p className="text-body-md whitespace-pre-wrap">{assistantMessage.content}</p>,
        },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: tempId--,
          role: 'assistant',
          time: formatTime(new Date()),
          content: <p className="text-body-md">{ERROR_TEXT}</p>,
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    sendMessage(input)
  }

  if (authLoading || historyLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Icon name="progress_activity" className="animate-spin text-4xl text-primary" />
      </div>
    )
  }

  if (!authorized) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] px-margin-mobile">
        <div className="max-w-sm w-full text-center bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-md shadow-sm py-xl">
          <div className="w-16 h-16 mx-auto bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center mb-4">
            <Icon name="smart_toy" className="text-4xl" filled />
          </div>
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-2">AI Career Counsellor</h2>
          <p className="text-body-md text-on-surface-variant mb-6">
            Sign in with a youth account to chat with your AI Career Counsellor.
          </p>
          <Link
            to="/login"
            className="h-12 px-8 rounded-full bg-primary text-on-primary font-label-md inline-flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
          >
            Sign In
            <Icon name="arrow_forward" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <DashboardPageHeader
        title="AI Career Counsellor"
        description="Ask me anything about choosing a career, your strengths, or what to study next."
      />
      <div className="max-w-5xl w-full mx-auto flex flex-col gap-6 pb-24">
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
                  {message.role === 'assistant' ? 'Career Counsellor' : user?.fullName?.split(' ')[0] || 'You'}
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
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start items-center gap-2 text-on-surface-variant/40 animate-pulse">
            <Icon name="more_horiz" className="text-sm" />
            <span className="text-xs italic">Career Counsellor is thinking...</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="sticky bottom-4 z-10 max-w-5xl w-full mx-auto mt-4">
        {messages.length === 0 && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-2 px-1">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => sendMessage(suggestion)}
                className="whitespace-nowrap bg-surface-container-lowest border border-outline-variant px-4 py-2 rounded-full text-xs font-semibold shadow-sm hover:bg-secondary-container/20 transition-all"
              >
                "{suggestion}"
              </button>
            ))}
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="relative flex items-center bg-surface-container-lowest/90 backdrop-blur-md rounded-2xl border border-outline-variant shadow-xl overflow-hidden focus-within:border-secondary transition-all"
        >
          <input
            className="w-full bg-transparent border-none focus:ring-0 py-4 px-5 text-on-surface placeholder:text-on-surface-variant/50"
            placeholder="Type your question here..."
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
          />
          <div className="flex items-center gap-2 pr-4">
            <button
              type="submit"
              disabled={isTyping || !input.trim()}
              className="bg-primary hover:bg-primary-container text-on-primary w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Icon name="send" filled />
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
