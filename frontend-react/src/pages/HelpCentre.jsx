import { useState } from 'react'
import PageLayout from '../components/layout/PageLayout'
import MobileBottomNav from '../components/layout/MobileBottomNav'
import Icon from '../components/ui/Icon'

const PRIVACY_BADGES = [
  { icon: 'no_accounts', label: 'No Identity Required' },
  { icon: 'encrypted', label: 'End-to-End Private' },
  { icon: 'gavel', label: 'Expert Vetted Advice' },
  { icon: 'volunteer_activism', label: 'Compassionate Support' },
]

const QUICK_QUESTIONS = [
  {
    icon: 'school',
    title: 'Returning to School',
    subtitle: 'How to re-enroll after a break',
    prompt: 'How do I re-enroll in school after taking a break?',
  },
  {
    icon: 'health_and_safety',
    title: 'Health & Pregnancy',
    subtitle: 'SRHR info and care links',
    prompt: 'Where can I get information about health and pregnancy care?',
  },
  {
    icon: 'diversity_3',
    title: 'Family Pressure',
    subtitle: 'Managing conflict and stress',
    prompt: 'How do I manage family pressure and conflict at home?',
  },
  {
    icon: 'payments',
    title: 'Financial Support',
    subtitle: 'Small business and study grants',
    prompt: 'What financial support or study grants are available for young people?',
  },
]

const HELPLINES = [
  {
    tag: '24/7 Hotline',
    number: '233',
    name: 'DOVVSU Helpline',
    desc: 'Domestic violence and victim support unit of the Ghana Police Service.',
    action: 'Call Now',
    icon: 'call',
    href: 'tel:233',
  },
  {
    tag: 'Health',
    number: '0800...',
    name: 'PPAG Counselors',
    desc: 'Professional sexual and reproductive health counseling services.',
    action: 'Start Chat',
    icon: 'chat',
    href: '#',
  },
  {
    tag: 'Mental Health',
    number: 'NGO',
    name: 'Ghana Psych Association',
    desc: 'Connect with licensed psychologists for emotional support.',
    action: 'Visit Site',
    icon: 'language',
    href: '#',
  },
]

const INITIAL_MESSAGES = [
  {
    from: 'bot',
    text: "Hello! I'm Auntie DERA. I'm here to listen and help with any questions about your education, health, or family life. Everything we discuss is 100% private. What's on your mind today?",
  },
  {
    from: 'user',
    text: "I'm worried about my school fees for next semester. My family says they can't afford it but I really want to finish my SHS.",
  },
  {
    from: 'bot',
    text: "I hear you, and it's brave to share this. There are several scholarships and vocational support programs in Ghana specifically for students in your position. Would you like me to show you how to apply for the DERA Scholarship Fund or other NGO grants?",
  },
]

export default function HelpCentre() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  function handleSend(e) {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed) return
    setMessages((prev) => [...prev, { from: 'user', text: trimmed }])
    setInput('')
  }

  return (
    <PageLayout bare>
      <header className="sticky top-0 z-50 bg-surface h-16 w-full">
        <div className="flex justify-between items-center px-margin-mobile h-full w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-secondary-container/20 transition-colors active:opacity-80 active:scale-95">
              <Icon name="menu" className="text-primary" />
            </button>
            <div className="flex items-center gap-xs">
              <Icon name="spa" filled className="text-secondary text-headline-sm" />
              <h1 className="font-headline-md text-headline-sm font-bold text-secondary">DERA</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-secondary-container/20 transition-colors active:opacity-80 active:scale-95">
              <Icon name="search" className="text-primary" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-base pb-24 md:pb-12">
        {/* Hero Section: Safe & Anonymous */}
        <section className="mt-8 mb-xl">
          <div className="relative overflow-hidden bg-primary-container rounded-xl p-md md:p-lg flex flex-col md:flex-row items-center gap-md">
            <div className="z-10 flex-1 space-y-4 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-container/10 border border-secondary-container/30 rounded-full">
                <Icon name="shield_person" filled className="text-secondary-fixed text-sm" />
                <span className="text-secondary-fixed font-label-lg uppercase tracking-wider">
                  Safe &amp; Anonymous
                </span>
              </div>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-primary">
                You are not alone. Ask anything privately.
              </h2>
              <p className="text-primary-fixed-dim font-body-lg max-w-xl">
                A safe space for young Ghanaians to seek guidance on education, health, and family without judgment.
                Your identity is always protected.
              </p>
            </div>
            <div className="relative w-48 h-48 md:w-64 md:h-64 flex-shrink-0">
              <div className="absolute inset-0 bg-secondary-container/20 rounded-full animate-pulse" />
              <img
                className="w-full h-full object-cover rounded-full border-4 border-secondary-container/30"
                alt="A portrait of a warm, friendly Ghanaian woman in her late 40s, a trustworthy mentor for the DERA platform."
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuChEQ4cLnoC7c-3Y1NAHtLxtTuyRyCWF31Owr_p-kSqCjBXyB-7ceA703JydSLrR2iacko4WQpqf74sa5lCUX3VXx9fqxQFNV2NUoodpEJCyGmTIXOQFz9JVZOfUiJE_XBGanlr5iaq_9cbuHVrk5S_XPdKfFSNsfE_L3epxA-HH5Ni2YUonSn9xl9V0YLFKfIgnthiAvaUiIMfcMnzZ9Z2grZUgtKOBKhly1P4yJ0xYNkVg5t4TL21"
              />
              <div className="absolute bottom-2 right-2 bg-secondary-container text-on-secondary-fixed px-3 py-1 rounded-full font-label-lg shadow-lg">
                Auntie DERA
              </div>
            </div>
          </div>
        </section>

        {/* Privacy Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-sm mb-xl">
          {PRIVACY_BADGES.map((badge) => (
            <div
              key={badge.label}
              className="flex flex-col items-center p-md bg-surface-container-low rounded-lg text-center border border-outline-variant/30"
            >
              <Icon name={badge.icon} className="text-secondary mb-2 text-3xl" />
              <span className="font-label-lg text-on-surface">{badge.label}</span>
            </div>
          ))}
        </div>

        {/* Chat / Ask Question Interface */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-md items-start mb-xl">
          <div className="lg:col-span-8 shadow-[0px_4px_20px_rgba(13,31,8,0.05)] bg-surface-container-lowest border border-outline-variant/20 rounded-xl overflow-hidden h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="bg-surface p-md border-b border-outline-variant/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center">
                  <Icon name="support_agent" filled className="text-secondary" />
                </div>
                <div>
                  <h3 className="font-label-lg text-on-surface">Chat with Auntie DERA</h3>
                  <p className="text-label-sm text-secondary flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" /> Online &amp; Ready to help
                  </p>
                </div>
              </div>
            </div>
            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-md space-y-md bg-surface/30">
              {messages.map((msg, i) =>
                msg.from === 'bot' ? (
                  <div key={i} className="flex gap-3 max-w-[85%]">
                    <div className="w-8 h-8 rounded-full bg-secondary-container/30 flex-shrink-0 flex items-center justify-center">
                      <Icon name="face" className="text-secondary text-sm" />
                    </div>
                    <div className="bg-surface-container p-md rounded-xl rounded-tl-none">
                      <p className="text-on-surface">{msg.text}</p>
                    </div>
                  </div>
                ) : (
                  <div key={i} className="flex flex-col items-end gap-1 ml-auto">
                    <div className="max-w-[85%] bg-secondary-container text-on-secondary-fixed p-md rounded-xl rounded-tr-none">
                      <p>{msg.text}</p>
                    </div>
                    <span className="text-[10px] text-outline px-2">Read</span>
                  </div>
                )
              )}
            </div>
            {/* Chat Input */}
            <div className={`p-md bg-surface border-t border-outline-variant/20 ${isFocused ? 'ring-1 ring-secondary' : ''}`}>
              <form className="relative" onSubmit={handleSend}>
                <textarea
                  className="w-full bg-surface-container-low border-outline-variant/50 focus:border-secondary rounded-xl py-3 px-4 pr-12 text-on-surface resize-none focus:ring-0"
                  placeholder="Type your question anonymously..."
                  rows={2}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
                <button
                  type="submit"
                  className="absolute right-3 bottom-3 p-2 bg-secondary text-white rounded-full hover:opacity-90 transition-all"
                >
                  <Icon name="send" filled />
                </button>
              </form>
              <p className="text-[11px] text-outline mt-2 text-center italic">
                Your message is encrypted and your identity is hidden.
              </p>
            </div>
          </div>

          {/* Common Questions Sidebar */}
          <div className="lg:col-span-4 space-y-md">
            <h3 className="font-headline-sm text-on-surface px-1">Common Questions</h3>
            <div className="grid grid-cols-1 gap-sm">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q.title}
                  onClick={() => setInput(q.prompt)}
                  className="flex items-center gap-4 p-md bg-surface shadow-[0px_4px_20px_rgba(13,31,8,0.05)] rounded-xl hover:bg-secondary-container/10 transition-all text-left border border-outline-variant/10 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-secondary-container/20 flex items-center justify-center group-hover:bg-secondary-container group-hover:text-on-secondary-container transition-colors">
                    <Icon name={q.icon} />
                  </div>
                  <div>
                    <p className="font-label-lg text-on-surface">{q.title}</p>
                    <p className="text-label-sm text-outline">{q.subtitle}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Helpline Section */}
        <section className="mb-xl bg-surface-container-high rounded-xl p-md md:p-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md mb-md">
            <div>
              <h3 className="font-headline-sm text-on-surface">Emergency &amp; Professional Help</h3>
              <p className="text-body-md text-on-surface-variant">
                Connect directly with verified organizations in Ghana.
              </p>
            </div>
            <button className="bg-primary text-on-primary px-6 py-2 rounded-full font-label-lg hover:opacity-90 transition-all">
              View All Helplines
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-md">
            {HELPLINES.map((line) => (
              <div
                key={line.name}
                className="bg-surface p-md rounded-lg shadow-[0px_4px_20px_rgba(13,31,8,0.05)] border border-outline-variant/30 flex flex-col h-full"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-secondary font-bold text-headline-sm">{line.number}</span>
                  <div className="bg-secondary-container/10 px-2 py-1 rounded text-[10px] text-secondary font-bold uppercase">
                    {line.tag}
                  </div>
                </div>
                <h4 className="font-label-lg text-on-surface mb-2">{line.name}</h4>
                <p className="text-label-sm text-outline mb-4 flex-1">{line.desc}</p>
                <a className="text-secondary font-bold flex items-center gap-1 hover:underline" href={line.href}>
                  <Icon name={line.icon} className="text-sm" /> {line.action}
                </a>
              </div>
            ))}
          </div>
        </section>
      </main>

      <MobileBottomNav />
    </PageLayout>
  )
}
