import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import Icon from '../components/ui/Icon'
import { useAuth } from '../context/AuthContext'
import { apiGet, apiPost } from '../services/apiClient'
import { formatDeadline, isClosed } from '../utils/scholarships'

const QUESTIONS = [
  {
    category: 'Activities You Enjoy',
    question: 'Which activity do you enjoy the most?',
    options: [
      { icon: 'query_stats', title: 'Solving puzzles, coding, or analyzing problems', trait: 'TECH' },
      { icon: 'groups', title: 'Helping and supporting people', trait: 'PEOPLE' },
      { icon: 'palette', title: 'Designing, writing, or creating content', trait: 'CREATIVE' },
      { icon: 'trending_up', title: 'Leading teams or organizing projects', trait: 'BUSINESS' },
      { icon: 'handyman', title: 'Building, repairing, or working with tools', trait: 'PRACTICAL' },
    ],
  },
  {
    category: 'School Subjects',
    question: 'Which school subjects do you enjoy the most?',
    options: [
      { icon: 'query_stats', title: 'Mathematics, Computer Science, or Physics', trait: 'TECH' },
      { icon: 'groups', title: 'Biology, Health Science, or Psychology', trait: 'PEOPLE' },
      { icon: 'palette', title: 'Literature, Art, or Music', trait: 'CREATIVE' },
      { icon: 'trending_up', title: 'Business, Economics, or Accounting', trait: 'BUSINESS' },
      { icon: 'handyman', title: 'Technical Drawing, Engineering, or Agriculture', trait: 'PRACTICAL' },
    ],
  },
  {
    category: 'What Makes You Happy',
    question: 'What kind of work would make you happiest?',
    options: [
      { icon: 'query_stats', title: 'Solving technical or scientific problems', trait: 'TECH' },
      { icon: 'groups', title: "Helping people improve their lives", trait: 'PEOPLE' },
      { icon: 'palette', title: 'Creating new ideas, designs, or stories', trait: 'CREATIVE' },
      { icon: 'trending_up', title: 'Managing people or running a business', trait: 'BUSINESS' },
      { icon: 'handyman', title: 'Designing, building, or fixing things', trait: 'PRACTICAL' },
    ],
  },
  {
    category: 'Problem-Solving Style',
    question: 'How do you usually solve problems?',
    options: [
      { icon: 'query_stats', title: 'Analyze the situation carefully and find a logical solution', trait: 'TECH' },
      { icon: 'groups', title: 'Talk to people and work together to find a solution', trait: 'PEOPLE' },
      { icon: 'palette', title: 'Think creatively and try new ideas', trait: 'CREATIVE' },
      { icon: 'trending_up', title: 'Take charge and make decisions quickly', trait: 'BUSINESS' },
      { icon: 'handyman', title: 'Learn by doing and experimenting', trait: 'PRACTICAL' },
    ],
  },
  {
    category: 'Your Personality',
    question: 'Which of these best describes your personality?',
    options: [
      { icon: 'query_stats', title: 'Curious and analytical', trait: 'TECH' },
      { icon: 'groups', title: 'Caring and compassionate', trait: 'PEOPLE' },
      { icon: 'palette', title: 'Creative and imaginative', trait: 'CREATIVE' },
      { icon: 'trending_up', title: 'Confident and ambitious', trait: 'BUSINESS' },
      { icon: 'handyman', title: 'Practical and hands-on', trait: 'PRACTICAL' },
    ],
  },
  {
    category: 'Work Environment',
    question: 'What type of work environment do you prefer?',
    options: [
      { icon: 'query_stats', title: 'Technology company or office', trait: 'TECH' },
      { icon: 'groups', title: 'Hospital, school, or community organization', trait: 'PEOPLE' },
      { icon: 'palette', title: 'Creative studio or media company', trait: 'CREATIVE' },
      { icon: 'trending_up', title: 'Corporate office or business environment', trait: 'BUSINESS' },
      { icon: 'handyman', title: 'Workshop, laboratory, construction site, or outdoors', trait: 'PRACTICAL' },
    ],
  },
  {
    category: 'What Fulfills You',
    question: 'Which achievement would make you feel most fulfilled?',
    options: [
      { icon: 'query_stats', title: 'Creating technology that solves real-world problems', trait: 'TECH' },
      { icon: 'groups', title: "Improving someone's life through healthcare, teaching, or counselling", trait: 'PEOPLE' },
      { icon: 'palette', title: 'Producing creative work that inspires others', trait: 'CREATIVE' },
      { icon: 'trending_up', title: 'Building a successful business or leading an organization', trait: 'BUSINESS' },
      { icon: 'handyman', title: 'Designing or constructing something useful', trait: 'PRACTICAL' },
    ],
  },
  {
    category: 'Your Strengths',
    question: 'Which skill do people compliment you on the most?',
    options: [
      { icon: 'query_stats', title: 'Logical thinking and problem-solving', trait: 'TECH' },
      { icon: 'groups', title: 'Kindness and communication', trait: 'PEOPLE' },
      { icon: 'palette', title: 'Creativity and imagination', trait: 'CREATIVE' },
      { icon: 'trending_up', title: 'Leadership and decision-making', trait: 'BUSINESS' },
      { icon: 'handyman', title: 'Practical or technical abilities', trait: 'PRACTICAL' },
    ],
  },
  {
    category: 'What Motivates You',
    question: 'What motivates you most in a career?',
    options: [
      { icon: 'query_stats', title: 'Innovation and solving complex challenges', trait: 'TECH' },
      { icon: 'groups', title: "Making a positive impact on people's lives", trait: 'PEOPLE' },
      { icon: 'palette', title: 'Expressing creativity and originality', trait: 'CREATIVE' },
      { icon: 'trending_up', title: 'Financial success and leadership opportunities', trait: 'BUSINESS' },
      { icon: 'handyman', title: 'Building practical solutions that improve everyday life', trait: 'PRACTICAL' },
    ],
  },
  {
    category: 'Career Field',
    question: 'If you could choose one career field today, which would you explore first?',
    options: [
      { icon: 'query_stats', title: 'Technology & Computing', trait: 'TECH' },
      { icon: 'groups', title: 'Healthcare, Education & Social Services', trait: 'PEOPLE' },
      { icon: 'palette', title: 'Arts, Media & Design', trait: 'CREATIVE' },
      { icon: 'trending_up', title: 'Business, Finance & Entrepreneurship', trait: 'BUSINESS' },
      { icon: 'handyman', title: 'Engineering, Construction & Agriculture', trait: 'PRACTICAL' },
    ],
  },
]

const RESULTS = {
  TECH: {
    title: 'Technology & Computing Careers',
    icon: 'query_stats',
    desc: 'You enjoy logical thinking and solving complex problems. Consider software engineering, data science, cybersecurity, or AI-related roles.',
  },
  PEOPLE: {
    title: 'Healthcare, Education & Social Services',
    icon: 'groups',
    desc: "You're driven to support and uplift others. Consider healthcare, teaching, counselling, or community and social work roles.",
  },
  CREATIVE: {
    title: 'Arts, Media & Design Careers',
    icon: 'palette',
    desc: 'You think imaginatively and enjoy creating. Consider design, media production, writing, or the arts.',
  },
  BUSINESS: {
    title: 'Business, Finance & Entrepreneurship',
    icon: 'trending_up',
    desc: "You're motivated by leading, organizing, and building. Consider entrepreneurship, business management, finance, or marketing roles.",
  },
  PRACTICAL: {
    title: 'Engineering, Construction & Agriculture',
    icon: 'handyman',
    desc: 'You like hands-on, practical work building and fixing real things. Consider engineering, construction trades, or agricultural careers.',
  },
}

export default function CareerQuiz() {
  const { user } = useAuth()
  const [started, setStarted] = useState(false)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const submittedRef = useRef(false)
  const cardRef = useRef(null)

  const total = QUESTIONS.length
  const isComplete = step >= total
  const current = !isComplete ? QUESTIONS[step] : null
  const progress = Math.round((Math.min(step + (isComplete ? 0 : 1), total) / total) * 100)
  const hasAnswered = answers[step] !== undefined

  // Fire-and-forget audit record only — the question bank, scoring, and
  // displayed result are entirely client-side (the backend deliberately
  // stores no answer payload or matching algorithm yet), so this never
  // blocks or affects what the user sees.
  useEffect(() => {
    if (isComplete && user?.role === 'youth' && !submittedRef.current) {
      submittedRef.current = true
      apiPost('/quiz-responses/', {}).catch(() => {})
    }
    if (!isComplete) submittedRef.current = false
  }, [isComplete, user])

  // Beginners lose their place if the page stays scrolled down after
  // tapping Next on mobile, so bring the next question into view every step.
  useEffect(() => {
    if (started) cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [step, started])

  const topTrait = useMemo(() => {
    const tally = {}
    Object.entries(answers).forEach(([qIndex, optIndex]) => {
      const trait = QUESTIONS[qIndex]?.options[optIndex]?.trait
      if (trait) tally[trait] = (tally[trait] || 0) + 1
    })
    const entries = Object.entries(tally)
    if (entries.length === 0) return 'PEOPLE'
    return entries.sort((a, b) => b[1] - a[1])[0][0]
  }, [answers])

  // Backend recommendations (real institutions + scholarships) for whichever
  // trait the client-side quiz landed on — fetched only once results show.
  const [careerPath, setCareerPath] = useState(null)
  const [recLoading, setRecLoading] = useState(false)

  useEffect(() => {
    if (!isComplete) {
      setCareerPath(null)
      return
    }
    setRecLoading(true)
    apiGet(`/career-paths/?trait=${topTrait}`)
      .then((data) => setCareerPath((data.results ?? data)[0] ?? null))
      .catch(() => setCareerPath(null))
      .finally(() => setRecLoading(false))
  }, [isComplete, topTrait])

  const selectOption = (optIndex) => {
    setAnswers((prev) => ({ ...prev, [step]: optIndex }))
  }

  const goNext = () => {
    if (!hasAnswered) return
    setStep((s) => Math.min(s + 1, total))
  }

  const goPrev = () => setStep((s) => Math.max(s - 1, 0))

  const retake = () => {
    setStep(0)
    setAnswers({})
  }

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop py-xl">
        <section className="py-md text-center">
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-background mb-3">Career Discovery Quiz</h2>
          <p className="text-body-lg text-on-surface-variant max-w-lg mx-auto">
            Every Young Person Belongs Here. Find the path that matches your unique strengths and local
            community needs.
          </p>
        </section>

        {!started ? (
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-lg shadow-sm mb-md text-center py-20">
            <div className="w-24 h-24 mx-auto bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center mb-6">
              <Icon name="explore" className="text-5xl" filled />
            </div>
            <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-4">Let's find out where you fit</h3>
            <p className="text-body-lg text-on-surface-variant max-w-lg mx-auto mb-10">
              10 quick questions about how you actually think and act. It's not what you think you're supposed to
              say. Takes about 3 minutes. There's no wrong answer here.
            </p>
            <button
              onClick={() => setStarted(true)}
              className="h-14 px-10 rounded-full bg-primary text-on-primary font-label-lg text-lg font-semibold inline-flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
            >
              Start
              <Icon name="arrow_forward" className="text-2xl" />
            </button>
          </div>
        ) : !isComplete ? (
          <>
            {/* Progress Tracking */}
            <div className="mb-xl space-y-3">
              <div className="flex justify-between items-end">
                <span className="font-label-lg text-lg font-semibold text-primary">
                  Question {step + 1} of {total}
                </span>
                <span className="font-label-md text-label-md text-on-surface-variant">
                  {progress}% Complete
                </span>
              </div>
              <div className="w-full h-4 bg-outline-variant/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-tertiary rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question Section */}
            <div ref={cardRef} className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-lg shadow-sm mb-md scroll-mt-6">
              <span className="inline-block bg-secondary-container text-on-secondary-container font-label-md text-label-md px-4 py-1.5 rounded-full mb-5">
                {current.category}
              </span>
              <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-7">{current.question}</h3>
              <div className="grid grid-cols-1 gap-4">
                {current.options.map((option, i) => {
                  const selected = answers[step] === i
                  return (
                    <button
                      key={option.title}
                      onClick={() => selectOption(i)}
                      className={`group relative flex items-center gap-4 p-lg rounded-xl border-2 transition-all text-left ${
                        selected
                          ? 'border-primary bg-primary/5'
                          : 'border-outline-variant/30 hover:border-primary hover:bg-primary/5'
                      }`}
                    >
                      {selected && (
                        <span className="absolute top-3 right-3 w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center">
                          <Icon name="check" className="text-lg" />
                        </span>
                      )}
                      <div className="w-14 h-14 flex-shrink-0 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center">
                        <Icon name={option.icon} className="text-2xl" />
                      </div>
                      <div className="flex-1 pr-4">
                        <p className="font-body-lg text-body-lg text-on-surface">{option.title}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-xl">
              <div className="flex justify-between items-center gap-4">
                <button
                  onClick={goPrev}
                  disabled={step === 0}
                  className="flex-1 h-14 rounded-full border-2 border-primary text-primary font-label-lg text-lg font-semibold flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                >
                  <Icon name="arrow_back" className="text-2xl" />
                  Previous
                </button>
                <button
                  onClick={goNext}
                  disabled={!hasAnswered}
                  className="flex-1 h-14 rounded-full bg-primary text-on-primary font-label-lg text-lg font-semibold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                  {step === total - 1 ? 'See Results' : 'Next Question'}
                  <Icon name="arrow_forward" className="text-2xl" />
                </button>
              </div>
              {!hasAnswered && (
                <p className="text-center text-label-md font-label-md text-on-surface-variant mt-4">
                  Choose an option to continue
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-lg shadow-sm mb-md text-center py-20">
            <div className="w-24 h-24 mx-auto bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center mb-6">
              <Icon name={RESULTS[topTrait].icon} className="text-5xl" filled />
            </div>
            <span className="inline-block bg-secondary-container text-on-secondary-container font-label-md text-label-md px-4 py-1.5 rounded-full mb-5">
              Your Result
            </span>
            <h3 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface mb-4">{RESULTS[topTrait].title}</h3>
            <p className="text-body-lg text-on-surface-variant max-w-lg mx-auto mb-10">{RESULTS[topTrait].desc}</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={retake}
                className="h-14 px-8 rounded-full border-2 border-primary text-primary font-label-lg text-lg font-semibold flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors"
              >
                <Icon name="refresh" className="text-2xl" />
                Retake Quiz
              </button>
              <Link
                to="/scholarships"
                className="h-14 px-8 rounded-full bg-primary text-on-primary font-label-lg text-lg font-semibold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
              >
                Explore Scholarships
                <Icon name="arrow_forward" className="text-2xl" />
              </Link>
            </div>

            {recLoading ? (
              <p className="mt-xl text-body-lg text-on-surface-variant">
                Finding institutions and scholarships for this path…
              </p>
            ) : careerPath ? (
              <div className="mt-xl text-left grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-surface-container rounded-xl p-lg">
                  <h4 className="font-headline-sm text-headline-sm text-lg text-on-surface mb-2 flex items-center gap-2">
                    <Icon name="account_balance" className="text-primary text-2xl" />
                    Institutions to consider
                  </h4>
                  {careerPath.qualification_required && (
                    <p className="text-body-md text-on-surface-variant mb-4">
                      Typically requires: {careerPath.qualification_required}
                    </p>
                  )}
                  {careerPath.institutions.length === 0 ? (
                    <p className="text-body-md text-on-surface-variant">
                      We're still curating institutions for this path — check back soon.
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {careerPath.institutions.map((inst) => (
                        <li key={inst.id} className="flex items-start gap-3">
                          <Icon name="school" className="text-primary text-2xl mt-0.5" />
                          <span className="text-body-lg text-on-surface">
                            {inst.name}
                            {inst.region && (
                              <span className="text-on-surface-variant"> — {inst.region}</span>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="bg-surface-container rounded-xl p-lg">
                  <h4 className="font-headline-sm text-headline-sm text-lg text-on-surface mb-4 flex items-center gap-2">
                    <Icon name="volunteer_activism" className="text-primary text-2xl" />
                    Scholarships for this path
                  </h4>
                  {careerPath.scholarships.length === 0 ? (
                    <p className="text-body-md text-on-surface-variant">
                      No field-specific scholarships matched yet —{' '}
                      <Link to="/scholarships" className="text-primary underline">
                        browse all open scholarships
                      </Link>
                      .
                    </p>
                  ) : (
                    <ul className="space-y-4">
                      {careerPath.scholarships.map((s) => {
                        const closed = isClosed(s.deadline)
                        return (
                          <li key={s.id}>
                            <p className="text-body-lg text-on-surface font-medium">{s.title}</p>
                            <p className={`text-body-md ${closed ? 'text-error' : 'text-on-surface-variant'}`}>
                              {closed ? 'Closed' : `Deadline: ${formatDeadline(s.deadline)}`}
                            </p>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </PageLayout>
  )
}
