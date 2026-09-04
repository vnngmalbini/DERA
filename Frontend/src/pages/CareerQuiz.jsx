import { useEffect, useMemo, useRef, useState } from 'react'
import CareerFieldResults from '../components/career/CareerFieldResults'
import PageLayout from '../components/layout/PageLayout'
import Icon from '../components/ui/Icon'
import { useAuth } from '../context/AuthContext'
import { apiGet, apiPost } from '../services/apiClient'
import {
  computeTopTrait,
  getQuizTrack,
  JHS_PROGRAMME_RESULTS,
  JHS_QUESTIONS,
  PRIMARY_GUIDANCE,
  PRIMARY_QUESTIONS,
  SHS_TERTIARY_QUESTIONS,
  SHS_TERTIARY_RESULTS,
  TOP_SHS_INSTITUTIONS,
} from '../data/careerQuizContent'

export default function CareerQuiz() {
  const { user } = useAuth()
  const [started, setStarted] = useState(false)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const submittedRef = useRef(false)
  const cardRef = useRef(null)

  // Which quiz to show is driven entirely by the young person's registered
  // educational level — Primary and JHS get their own age-appropriate
  // question banks; everyone else (SHS, SHS graduate, Tertiary, and any
  // visitor without a known level) keeps the original quiz unchanged.
  const track = getQuizTrack(user?.educationLevel)
  const QUESTIONS =
    track === 'PRIMARY' ? PRIMARY_QUESTIONS : track === 'JHS' ? JHS_QUESTIONS : SHS_TERTIARY_QUESTIONS

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

  const topTrait = useMemo(() => computeTopTrait(answers, QUESTIONS), [answers, QUESTIONS])

  const resultCopy =
    track === 'PRIMARY'
      ? PRIMARY_GUIDANCE[topTrait]
      : track === 'JHS'
        ? JHS_PROGRAMME_RESULTS[topTrait]
        : SHS_TERTIARY_RESULTS[topTrait]

  // Backend recommendation for whichever trait the client-side quiz landed
  // on — fetched only once results show, and only for the SHS/Tertiary
  // track (real tertiary institutions via CareerPath). JHS shows the fixed
  // top-performing-SHS list below (no fetch needed); Primary shows guidance
  // only — no institution data exists for that level yet, and this app
  // never shows unverified/guessed data.
  const [careerPath, setCareerPath] = useState(null)
  const [recLoading, setRecLoading] = useState(false)

  useEffect(() => {
    if (!isComplete || track !== 'SHS_TERTIARY') {
      setCareerPath(null)
      return
    }

    setRecLoading(true)
    apiGet(`/career-paths/?trait=${topTrait}`)
      .then((data) => setCareerPath((data.results ?? data)[0] ?? null))
      .catch(() => setCareerPath(null))
      .finally(() => setRecLoading(false))
  }, [isComplete, track, topTrait])

  const selectOption = (optIndex) => {
    setAnswers((prev) => ({ ...prev, [step]: optIndex }))
  }

  const goNext = () => {
    if (!hasAnswered) return
    setStep((s) => Math.min(s + 1, total))
  }

  const goPrev = () => setStep((s) => Math.max(s - 1, 0))

  // Lets a young person answer the whole quiz from the keyboard: Enter
  // advances to the next question (or reveals results on the last one),
  // same as clicking the Next/See Results button.
  useEffect(() => {
    if (!started || isComplete || !hasAnswered) return
    const onKeyDown = (e) => {
      if (e.key !== 'Enter') return
      e.preventDefault()
      setStep((s) => Math.min(s + 1, total))
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [started, isComplete, hasAnswered, total])

  const retake = () => {
    setStep(0)
    setAnswers({})
  }

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-xl">
        <section className="py-md text-center">
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-background mb-3">Career Discovery Quiz</h2>
          <p className="text-body-lg text-on-surface-variant max-w-lg mx-auto">
            Every Young Person Belongs Here. Find the path that matches your unique strengths and local
            community needs.
          </p>
        </section>

        {!started ? (
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-4 sm:p-lg shadow-sm mb-md text-center py-12 sm:py-20">
            <div className="w-24 h-24 mx-auto bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center mb-6">
              <Icon name="explore" className="text-5xl" filled />
            </div>
            <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-4">Let's find out where you fit</h3>
            <p className="text-body-lg text-on-surface-variant max-w-lg mx-auto mb-10">
              {total} quick questions about how you actually think and act. It's not what you think you're
              supposed to say. Takes about 3 minutes. There's no wrong answer here.
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
            <div ref={cardRef} className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-4 sm:p-lg shadow-sm mb-md scroll-mt-6">
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
                      className={`group relative flex items-center gap-3 sm:gap-4 p-4 sm:p-lg rounded-xl border-2 transition-all text-left ${
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
                  className="flex-1 h-14 px-2 rounded-full border-2 border-primary text-primary font-label-lg text-base sm:text-lg font-semibold flex items-center justify-center gap-1 sm:gap-2 hover:bg-primary/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                >
                  <Icon name="arrow_back" className="text-xl sm:text-2xl" />
                  <span className="sm:hidden">Back</span>
                  <span className="hidden sm:inline">Previous</span>
                </button>
                <button
                  onClick={goNext}
                  disabled={!hasAnswered}
                  className="flex-1 h-14 px-2 rounded-full bg-primary text-on-primary font-label-lg text-base sm:text-lg font-semibold flex items-center justify-center gap-1 sm:gap-2 shadow-lg active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                  <span className="sm:hidden">{step === total - 1 ? 'Results' : 'Next'}</span>
                  <span className="hidden sm:inline">{step === total - 1 ? 'See Results' : 'Next Question'}</span>
                  <Icon name="arrow_forward" className="text-xl sm:text-2xl" />
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
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-4 sm:p-lg shadow-sm mb-md text-center py-12 sm:py-20">
            <div className="w-24 h-24 mx-auto bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center mb-6">
              <Icon name={resultCopy.icon} className="text-5xl" filled />
            </div>
            <span className="inline-block bg-secondary-container text-on-secondary-container font-label-md text-label-md px-4 py-1.5 rounded-full mb-5">
              Your Result
            </span>
            <h3 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface mb-4">{resultCopy.title}</h3>
            <p className="text-body-lg text-on-surface-variant max-w-lg mx-auto mb-10">{resultCopy.desc}</p>

            <div>
              <button
                onClick={retake}
                className="h-14 px-8 rounded-full border-2 border-primary text-primary font-label-lg text-lg font-semibold inline-flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors"
              >
                <Icon name="refresh" className="text-2xl" />
                Retake Quiz
              </button>
            </div>

            {recLoading ? (
              <p className="mt-xl text-body-lg text-on-surface-variant">
                Finding institutions for this path…
              </p>
            ) : track === 'PRIMARY' ? (
              <div className="mt-xl text-left max-w-2xl mx-auto bg-surface-container rounded-xl p-lg">
                <h4 className="font-headline-sm text-headline-sm text-lg text-on-surface mb-4 flex items-center gap-2">
                  <Icon name="lightbulb" className="text-primary text-2xl" />
                  Subjects to focus on
                </h4>
                <ul className="space-y-3">
                  {resultCopy.focusAreas.map((area) => (
                    <li key={area} className="flex items-start gap-3">
                      <Icon name="check_circle" className="text-primary text-2xl mt-0.5" />
                      <span className="text-body-lg text-on-surface">{area}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-body-md text-on-surface-variant mt-5">
                  Talk to your current school or your district education office about progressing to JHS.
                </p>
              </div>
            ) : track === 'JHS' ? (
              <div className="mt-xl text-left grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-surface-container rounded-xl p-lg">
                  <h4 className="font-headline-sm text-headline-sm text-lg text-on-surface mb-4 flex items-center gap-2">
                    <Icon name="account_balance" className="text-primary text-2xl" />
                    Top 10 SHS to Consider
                  </h4>
                  <p className="text-body-md text-on-surface-variant mb-4">
                    Ghana's most consistently top-performing senior high schools — from across the country,
                    not just your own region.
                  </p>
                  <ul className="space-y-3">
                    {TOP_SHS_INSTITUTIONS.map((inst) => (
                      <li key={inst.name} className="flex items-start gap-3">
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
                </div>

                <div className="bg-surface-container rounded-xl p-lg">
                  <h4 className="font-headline-sm text-headline-sm text-lg text-on-surface mb-4 flex items-center gap-2">
                    <Icon name="menu_book" className="text-primary text-2xl" />
                    Recommended SHS Programme
                  </h4>
                  <ul className="space-y-3">
                    {resultCopy.suggestedProgrammes.map((programme) => (
                      <li key={programme} className="flex items-start gap-3">
                        <Icon name="check_circle" className="text-primary text-2xl mt-0.5" />
                        <span className="text-body-lg text-on-surface">{programme}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : careerPath ? (
              <div className="mt-xl">
                <CareerFieldResults careerPath={careerPath} />
              </div>
            ) : null}
          </div>
        )}
      </div>
    </PageLayout>
  )
}
