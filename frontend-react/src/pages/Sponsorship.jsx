import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import Icon from '../components/ui/Icon'

const SCHOOLS = [
  { value: 'unilag', label: 'University of Lagos' },
  { value: 'ui', label: 'University of Ibadan' },
  { value: 'knust', label: 'KNUST' },
  { value: 'other', label: 'Other Institution' },
]

const INITIAL_FORM = {
  academicProfile: '',
  schoolInterest: '',
  reason: '',
  terms: false,
}

export default function Sponsorship() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [submitted, setSubmitted] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    if (!submitted) return undefined
    const timer = setTimeout(() => setModalVisible(true), 10)
    return () => clearTimeout(timer)
  }, [submitted])

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setModalVisible(false)
        setSubmitted(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  function handleChange(e) {
    const { id, value, type, checked } = e.target
    setFormData((prev) => ({ ...prev, [id]: type === 'checkbox' ? checked : value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    console.log('Sponsorship application payload:', formData)
    setSubmitted(true)
  }

  function handleReturnToDashboard() {
    setModalVisible(false)
    setSubmitted(false)
    setFormData(INITIAL_FORM)
    navigate('/')
  }

  return (
    <PageLayout bare>
      {/* Top Navigation Bar */}
      <header className="w-full top-0 sticky z-50 bg-surface shadow-[0px_4px_20px_rgba(13,31,8,0.05)]">
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-base max-w-[1280px] mx-auto w-full">
          <Link to="/" className="flex items-center gap-xs cursor-pointer active:opacity-80">
            <Icon name="spa" className="text-secondary text-headline-md" filled />
            <h1 className="font-headline-md text-headline-md font-bold text-secondary">DERA</h1>
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-on-surface-variant hover:text-secondary transition-colors duration-200 font-label-lg text-label-lg"
          >
            <Icon name="arrow_back" />
            <span className="hidden md:inline">Back</span>
          </button>
        </div>
      </header>

      <main className="min-h-[calc(100vh-64px)] pb-xl">
        {/* Hero Section / Encouragement */}
        <section className="relative overflow-hidden pt-lg pb-xl px-margin-mobile md:px-margin-desktop bg-primary-container text-on-primary">
          <div className="max-w-[800px] mx-auto text-center relative z-10">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-secondary-container text-on-secondary-container mb-md">
              <Icon name="volunteer_activism" filled />
            </div>
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg mb-sm">
              Empowering Your Dreams
            </h1>
            <p className="font-body-lg text-body-lg text-on-primary-container max-w-[600px] mx-auto">
              Don&apos;t let the cost of a form stop your future. Our sponsors are here to help students with
              potential.
            </p>
          </div>
        </section>

        {/* Application Form Content */}
        <section className="px-margin-mobile md:px-margin-desktop -mt-12 relative z-20">
          <div className="max-w-[800px] mx-auto">
            <div className="bg-surface-container-lowest rounded-xl p-md md:p-lg border border-outline-variant/30 shadow-[0px_4px_20px_rgba(13,31,8,0.05)]">
              <form className="space-y-gutter" onSubmit={handleSubmit}>
                {/* Header Information */}
                <div className="border-b border-outline-variant pb-md">
                  <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
                    <Icon name="assignment" className="text-secondary" />
                    Sponsorship Application
                  </h2>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
                    Please provide accurate details to help our reviewers understand your situation.
                  </p>
                </div>

                {/* Grid for inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                  {/* Academic Profile */}
                  <div className="space-y-xs md:col-span-2">
                    <label className="font-label-lg text-label-lg text-on-surface-variant" htmlFor="academicProfile">
                      Academic Profile (WASSCE Grades)
                    </label>
                    <div className="relative">
                      <Icon name="school" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
                      <input
                        id="academicProfile"
                        type="text"
                        required
                        placeholder="e.g. 7As, 2Bs in WASSCE 2023"
                        value={formData.academicProfile}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 rounded-lg border border-outline-variant focus:border-secondary-fixed focus:ring-2 focus:ring-secondary-fixed/20 bg-surface outline-none transition-all font-body-md text-body-md"
                      />
                    </div>
                  </div>

                  {/* School of Interest */}
                  <div className="space-y-xs md:col-span-2">
                    <label className="font-label-lg text-label-lg text-on-surface-variant" htmlFor="schoolInterest">
                      School of Interest
                    </label>
                    <div className="relative">
                      <Icon name="account_balance" className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
                      <select
                        id="schoolInterest"
                        required
                        value={formData.schoolInterest}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 rounded-lg border border-outline-variant focus:border-secondary-fixed focus:ring-2 focus:ring-secondary-fixed/20 bg-surface outline-none transition-all font-body-md text-body-md appearance-none"
                      >
                        <option disabled value="">
                          Select an institution
                        </option>
                        {SCHOOLS.map((school) => (
                          <option key={school.value} value={school.value}>
                            {school.label}
                          </option>
                        ))}
                      </select>
                      <Icon
                        name="expand_more"
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none"
                      />
                    </div>
                  </div>

                  {/* Reason for Need */}
                  <div className="space-y-xs md:col-span-2">
                    <label className="font-label-lg text-label-lg text-on-surface-variant" htmlFor="reason">
                      Reason for Need
                    </label>
                    <textarea
                      id="reason"
                      rows={4}
                      required
                      placeholder="Tell us why you need this sponsorship and your career goals..."
                      value={formData.reason}
                      onChange={handleChange}
                      className="w-full p-4 rounded-lg border border-outline-variant focus:border-secondary-fixed focus:ring-2 focus:ring-secondary-fixed/20 bg-surface outline-none transition-all font-body-md text-body-md"
                    />
                    <p className="text-xs text-on-surface-variant/70 italic">
                      Maximum 500 words. Focus on your financial constraints and passion for learning.
                    </p>
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-start gap-3 p-4 rounded-lg bg-surface-container-low border border-outline-variant/30">
                  <input
                    id="terms"
                    type="checkbox"
                    required
                    checked={formData.terms}
                    onChange={handleChange}
                    className="mt-1 rounded border-outline-variant text-secondary focus:ring-secondary"
                  />
                  <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="terms">
                    I certify that the information provided is true. I understand that misrepresentation will lead
                    to immediate disqualification and potential blacklisting from future DERA programs.
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col md:flex-row gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-secondary-container text-on-secondary-container font-headline-sm text-label-lg py-4 px-lg rounded-lg shadow-sm hover:bg-secondary hover:text-on-secondary active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                  >
                    Submit Application
                    <Icon name="send" className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="md:w-auto px-lg py-4 border border-outline text-on-surface-variant rounded-lg font-label-lg text-label-lg hover:bg-surface-variant/50 transition-colors flex items-center justify-center gap-2"
                  >
                    Back
                  </button>
                </div>
              </form>
            </div>

            {/* Testimonial/Side Note Card */}
            <div className="mt-lg grid grid-cols-1 md:grid-cols-2 gap-gutter">
              <div className="bg-secondary/10 p-md rounded-xl flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    className="w-full h-full object-cover"
                    alt="Portrait of a smiling young African university student in a graduation gown"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvxHTN-DKgUe1vZS3a9crm6lOFiZyesZPs_4_j7njsUh0GXOFJJQofJJuId9Kqmeb4WBwNk-o6QSOrpwvV2P9iEe70rLcFnt0QK2gI7U89yB09-WY6R0mcZedYuVlYSay-CGh5z2O-P5yr1KXCXATy_XnKDGstqJLNO6UCXVk1l3ZXUgZFFF4zzpI9Tmf_HSYTaiI16m6oBCLLcMOJ6Hv1ogvdwhieWy1kQQiw11v2UajZC83bNcek"
                  />
                </div>
                <div>
                  <p className="font-body-md text-on-surface italic">
                    &quot;DERA covered my entrance fee when I had nothing. Today, I&apos;m a Year 2 Law student.&quot;
                  </p>
                  <p className="font-label-sm text-secondary font-bold">— Sarah O., Recipient</p>
                </div>
              </div>
              <div className="bg-surface-container-high p-md rounded-xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-secondary">
                  <Icon name="verified_user" filled />
                </div>
                <div>
                  <h4 className="font-label-lg text-label-lg text-on-surface">Secure &amp; Confidential</h4>
                  <p className="font-label-sm text-on-surface-variant">
                    Your personal story is safe with us and only shared with vetted sponsors.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Footer */}
      <footer className="bg-surface border-t border-outline-variant/10 py-lg px-margin-mobile md:px-margin-desktop mt-xl">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-md">
          <p className="font-label-sm text-label-sm text-on-surface-variant">© 2024 DERA Community. All rights reserved.</p>
          <div className="flex gap-gutter">
            <a className="text-label-sm font-label-sm text-on-surface-variant hover:text-secondary" href="#">
              Privacy Policy
            </a>
            <Link className="text-label-sm font-label-sm text-on-surface-variant hover:text-secondary" to="/help">
              Help Center
            </Link>
            <a className="text-label-sm font-label-sm text-on-surface-variant hover:text-secondary" href="#">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>

      {/* Success Modal */}
      {submitted && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-margin-mobile">
          <div className="absolute inset-0 bg-inverse-surface/60 backdrop-blur-sm" />
          <div
            className={`relative bg-surface rounded-xl p-lg max-w-[500px] w-full text-center shadow-2xl transition-all duration-300 ${
              modalVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
          >
            <div className="w-20 h-20 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center mx-auto mb-md">
              <Icon name="check_circle" className="text-[48px]" filled />
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-sm">Application Received!</h3>
            <p className="font-body-md text-on-surface-variant mb-lg">
              Your sponsorship request has been submitted successfully. We will review your profile and notify you
              via email within 3-5 business days.
            </p>
            <button
              onClick={handleReturnToDashboard}
              className="w-full bg-secondary text-on-secondary py-3 px-6 rounded-lg font-label-lg text-label-lg hover:shadow-lg transition-shadow"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      )}
    </PageLayout>
  )
}
