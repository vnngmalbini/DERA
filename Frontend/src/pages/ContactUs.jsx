import { useState } from 'react'
import PageLayout from '../components/layout/PageLayout'
import Icon from '../components/ui/Icon'
import Button from '../components/ui/Button'

const INITIAL_FORM = { name: '', email: '', message: '' }

const CONTACT_DETAILS = [
  { icon: 'mail', label: 'Email Us', value: 'hello@dera.com' },
  { icon: 'call', label: 'Call Us', value: '+233 (0) 24 000 0000' },
  { icon: 'location_on', label: 'Our Office', value: 'Accra, Ghana' },
]

export default function ContactUs() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [status, setStatus] = useState('idle') // idle | sending | sent

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Contact form submitted:', form)
    setStatus('sending')
    setTimeout(() => {
      setStatus('sent')
      setForm(INITIAL_FORM)
      setTimeout(() => setStatus('idle'), 3000)
    }, 1200)
  }

  return (
    <PageLayout>
      <div className="px-margin-mobile md:px-margin-desktop max-w-[1280px] mx-auto">
        {/* Hero Section */}
        <section className="py-lg text-center md:text-left">
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg mb-sm">
            Get in Touch
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Reach out to the DERA team for support, partnership, or questions. Every message is a step toward
            community growth.
          </p>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-xl">
          {/* Section 1: Contact Form */}
          <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl shadow-[0px_-4px_20px_rgba(13,31,8,0.05)] p-md md:p-lg">
            <form className="space-y-md" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div className="space-y-xs">
                  <label className="font-label-lg text-label-lg text-on-surface-variant" htmlFor="name">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    className="w-full bg-surface-container-low border-none rounded-lg p-md focus:ring-2 focus:ring-secondary-fixed transition-all text-on-surface"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-xs">
                  <label className="font-label-lg text-label-lg text-on-surface-variant" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="hello@example.com"
                    className="w-full bg-surface-container-low border-none rounded-lg p-md focus:ring-2 focus:ring-secondary-fixed transition-all text-on-surface"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-xs">
                <label className="font-label-lg text-label-lg text-on-surface-variant" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  placeholder="How can we help you today?"
                  className="w-full bg-surface-container-low border-none rounded-lg p-md focus:ring-2 focus:ring-secondary-fixed transition-all text-on-surface"
                  value={form.message}
                  onChange={handleChange}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={status === 'sending'}
                className={`w-full md:w-auto px-lg py-md rounded-lg font-label-lg flex items-center justify-center gap-sm active:scale-95 transition-all disabled:opacity-70 ${
                  status === 'sent' ? 'bg-green-600 text-white' : 'bg-secondary text-on-secondary hover:opacity-90'
                }`}
              >
                {status === 'idle' && (
                  <>
                    Send Message
                    <Icon name="send" />
                  </>
                )}
                {status === 'sending' && (
                  <>
                    <Icon name="sync" className="animate-spin" />
                    Sending...
                  </>
                )}
                {status === 'sent' && (
                  <>
                    <Icon name="check_circle" />
                    Message Sent!
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Section 2: Contact Details & Support */}
          <div className="lg:col-span-5 flex flex-col gap-gutter">
            {/* Info Card */}
            <div className="bg-primary-container text-on-primary-container rounded-xl p-md md:p-lg space-y-lg relative overflow-hidden">
              <div className="relative z-10 space-y-lg">
                <h2 className="font-headline-sm text-headline-sm text-secondary-fixed">Contact Details</h2>
                <div className="space-y-md">
                  {CONTACT_DETAILS.map((detail) => (
                    <div className="flex items-center gap-md" key={detail.label}>
                      <div className="w-12 h-12 rounded-full bg-on-primary-fixed-variant flex items-center justify-center text-secondary-fixed">
                        <Icon name={detail.icon} />
                      </div>
                      <div>
                        <p className="font-label-sm text-label-sm opacity-70">{detail.label}</p>
                        <p className="font-body-md text-body-md font-semibold">{detail.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -right-10 -bottom-10 opacity-10">
                <Icon name="eco" className="text-[200px]" filled />
              </div>
            </div>

            {/* Section 3: Live Chat CTA */}
            <div className="bg-secondary-container text-on-secondary-container rounded-xl p-md md:p-lg shadow-sm border border-secondary/10 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-secondary text-on-secondary flex items-center justify-center mb-md rotate-3 hover:rotate-0 transition-transform">
                <Icon name="record_voice_over" className="text-4xl" />
              </div>
              <h2 className="font-headline-sm text-headline-sm mb-base">Anonymous Support</h2>
              <p className="font-body-md text-body-md mb-lg">
                Need immediate help? Our Live Chat is available 24/7 in the Help Centre. Your identity remains
                private.
              </p>
              <Button to="/help" icon="forum" className="w-full !rounded-lg bg-primary text-on-primary hover:opacity-90">
                Launch Live Chat
              </Button>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <section className="mb-xl">
          <div className="rounded-xl overflow-hidden h-[350px] shadow-sm relative group">
            <img
              className="w-full h-full object-cover"
              alt="A clean, minimalist 3D map illustration of Accra, Ghana, using a sophisticated color palette of soft greens, charcoal grays, and lime highlights."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIGl45sj0yfkHbHMA1KEDGyl_s7LKPaErHSwc3ePFh2sQMMkPtssjLstfj4jdXoJJFdBl0xdc6m38uN4dyx15zVlHFDc5ezxP7FmedLVDDAdMFFjQvLLdc80QbgKhCTRpaECENlb7P3NlTJAcAc6-j1SvqochsE5efYjUrpio24Ej1oQvyBg5Biw4nuH5Nu469mfUAawFQ9Xp09MsiYsTyGOgcbQNettmvaqwB5d_JZBV365aSR9EC"
            />
            <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-all pointer-events-none" />
            <div className="absolute bottom-md left-md bg-surface p-md rounded-lg shadow-lg flex items-center gap-md">
              <div className="bg-secondary p-2 rounded-md">
                <Icon name="explore" className="text-on-secondary" />
              </div>
              <div>
                <h4 className="font-label-lg text-label-lg font-bold">DERA HQ</h4>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Accra Tech Hub District</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}
