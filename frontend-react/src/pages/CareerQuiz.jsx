import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import Icon from '../components/ui/Icon'
import { useAuth } from '../context/AuthContext'
import { apiPost } from '../services/apiClient'

const VISUAL_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAJTRSccTij9NnSqqQdezOej-cAcvWwZOWPZzbReEnDXzBHkwQaQecIQXeXtx99ev65LSXZCIqP8zJZXgUxvntf0ba94e2BLVQvFif3Bahk5QAg5eff4qiyGWxlsNUCBhPgrHj9KE9D-eXaugPYHUWZmHLs2gFHJHyBibhfbiZPVPGPlCGj47rUmhWP3oJct2dqv5pqcosaeWvmfWtEQvNBisnLOC2UFu4k9FvLMwyFntHnQvQXcYHj'

const QUESTIONS = [
  {
    category: 'Interests & Skills',
    question: 'Do you enjoy solving problems using logic and numbers, or expressing ideas creatively?',
    fact: 'Students who identify their natural strengths early are 2x more likely to stay in a career path long-term.',
    options: [
      { icon: 'calculate', title: 'Logic & Numbers', desc: 'I like working with data, patterns, and precise calculations.', trait: 'ANALYTICAL' },
      { icon: 'palette', title: 'Creative Expression', desc: 'I like designing, storytelling, and coming up with new ideas.', trait: 'CREATIVE' },
    ],
  },
  {
    category: 'Environment',
    question: 'Would you rather work outdoors close to nature, or indoors in an office setting?',
    fact: "Ghana's agri-tech sector is one of the fastest-growing employers of rural youth under 25.",
    options: [
      { icon: 'park', title: 'Outdoors in Nature', desc: 'I feel most productive out in the field, farm, or workshop.', trait: 'TECHNICAL' },
      { icon: 'business_center', title: 'Indoors in an Office', desc: 'I prefer a structured desk-based or studio environment.', trait: 'ANALYTICAL' },
    ],
  },
  {
    category: 'Interests & Skills',
    question: 'When you think about your future work, do you prefer working with people or working with things?',
    fact: '80% of successful business owners in your region started by combining community leadership with technical skills.',
    options: [
      { icon: 'groups', title: 'Working with People', desc: 'I enjoy teaching, helping others, and being part of a team effort.', trait: 'PEOPLE' },
      { icon: 'construction', title: 'Working with Things', desc: 'I prefer fixing tools, building structures, or managing technical equipment.', trait: 'TECHNICAL' },
    ],
  },
  {
    category: 'Community & Values',
    question: 'Do you feel more motivated by helping your local community, or by building something of your own?',
    fact: 'Community-driven mentorship programs have helped over 500 Ghanaian youth launch new ventures.',
    options: [
      { icon: 'diversity_3', title: 'Helping My Community', desc: 'I want my work to directly uplift people around me.', trait: 'PEOPLE' },
      { icon: 'rocket_launch', title: 'Building My Own Venture', desc: 'I want to create a business or project that is mine.', trait: 'CREATIVE' },
    ],
  },
  {
    category: 'Work Style',
    question: 'Do you prefer following clear step-by-step instructions, or figuring things out your own way?',
    fact: 'Employers across Ghana consistently rank adaptability as a top-3 hiring skill.',
    options: [
      { icon: 'checklist', title: 'Clear Instructions', desc: 'I do my best work when the steps are well defined.', trait: 'ANALYTICAL' },
      { icon: 'explore', title: 'My Own Way', desc: 'I like experimenting and finding my own approach.', trait: 'CREATIVE' },
    ],
  },
  {
    category: 'Environment',
    question: 'Would you rather work in a fast-paced, busy environment or a calm, steady one?',
    fact: 'Fast-growing sectors like logistics and ICT reward youth who thrive under pressure.',
    options: [
      { icon: 'bolt', title: 'Fast-Paced', desc: 'I enjoy variety, energy, and quick decision-making.', trait: 'CREATIVE' },
      { icon: 'spa', title: 'Calm & Steady', desc: 'I prefer predictable routines and careful planning.', trait: 'ANALYTICAL' },
    ],
  },
  {
    category: 'Skills & Strengths',
    question: 'Are you more confident speaking and persuading others, or analyzing data and details?',
    fact: 'Strong communicators are in high demand for community health and extension worker roles.',
    options: [
      { icon: 'campaign', title: 'Speaking & Persuading', desc: 'I like presenting ideas and convincing a crowd.', trait: 'PEOPLE' },
      { icon: 'query_stats', title: 'Analyzing Data', desc: 'I like digging into the details behind a decision.', trait: 'ANALYTICAL' },
    ],
  },
  {
    category: 'Future Goals',
    question: 'Is earning a strong income more important to you, or making a visible impact on your community?',
    fact: 'Many DERA scholars combine paid trade skills with volunteer community projects.',
    options: [
      { icon: 'payments', title: 'Strong Income', desc: 'Financial stability and growth matter most to me.', trait: 'TECHNICAL' },
      { icon: 'volunteer_activism', title: 'Community Impact', desc: "Seeing my community grow matters most to me.", trait: 'PEOPLE' },
    ],
  },
  {
    category: 'Learning Style',
    question: 'Do you learn best by doing hands-on practical work, or by studying theory and concepts?',
    fact: 'Vocational and technical institutes across Ghana report rising enrollment from rural districts.',
    options: [
      { icon: 'handyman', title: 'Hands-on Practice', desc: 'I understand things best by doing them myself.', trait: 'TECHNICAL' },
      { icon: 'menu_book', title: 'Studying Theory', desc: 'I like understanding the concepts behind the work.', trait: 'ANALYTICAL' },
    ],
  },
  {
    category: 'Work Style',
    question: 'When facing a challenge, do you prefer working as part of a team, or tackling it independently?',
    fact: "You're almost done! Your answers will help match you with local scholarship and career resources.",
    options: [
      { icon: 'groups_3', title: 'As Part of a Team', desc: 'I do my best thinking alongside other people.', trait: 'PEOPLE' },
      { icon: 'person', title: 'Independently', desc: 'I do my best thinking when working on my own.', trait: 'TECHNICAL' },
    ],
  },
]

const RESULTS = {
  PEOPLE: {
    title: 'Community & People-Focused Careers',
    icon: 'groups',
    desc: 'You thrive working with others. Consider teaching, healthcare, social work, or community leadership roles.',
  },
  TECHNICAL: {
    title: 'Technical & Hands-On Careers',
    icon: 'construction',
    desc: 'You have a knack for tools and systems. Consider engineering, agri-tech, trades, or ICT support roles.',
  },
  CREATIVE: {
    title: 'Creative & Entrepreneurial Careers',
    icon: 'palette',
    desc: 'You like building and expressing new ideas. Consider design, media, or launching your own venture.',
  },
  ANALYTICAL: {
    title: 'Analytical & Research-Focused Careers',
    icon: 'query_stats',
    desc: 'You enjoy structure and detail. Consider finance, data science, medicine, or research fields.',
  },
}

export default function CareerQuiz() {
  const { user } = useAuth()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const submittedRef = useRef(false)

  const total = QUESTIONS.length
  const isComplete = step >= total
  const current = !isComplete ? QUESTIONS[step] : null
  const progress = Math.round((Math.min(step + (isComplete ? 0 : 1), total) / total) * 100)

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

  const selectOption = (optIndex) => {
    setAnswers((prev) => ({ ...prev, [step]: optIndex }))
  }

  const goNext = () => {
    if (answers[step] === undefined) return
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
          <h2 className="font-headline-md text-headline-md text-on-background mb-2">Career Discovery Quiz</h2>
          <p className="text-body-md text-on-surface-variant max-w-md mx-auto">
            Every Young Person Belongs Here. Find the path that matches your unique strengths and local
            community needs.
          </p>
        </section>

        {!isComplete ? (
          <>
            {/* Progress Tracking */}
            <div className="mb-lg space-y-3">
              <div className="flex justify-between items-end">
                <span className="font-label-md text-label-md text-primary">
                  Step {step + 1} of {total}
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  {progress}% Complete
                </span>
              </div>
              <div className="w-full h-3 bg-outline-variant/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-tertiary rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question Section */}
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-md shadow-sm mb-md">
              <span className="inline-block bg-secondary-container text-on-secondary-container font-label-sm text-label-sm px-3 py-1 rounded-full mb-4">
                {current.category}
              </span>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-6">{current.question}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {current.options.map((option, i) => {
                  const selected = answers[step] === i
                  return (
                    <button
                      key={option.title}
                      onClick={() => selectOption(i)}
                      className={`group flex items-start gap-4 p-md rounded-xl border-2 transition-all text-left ${
                        selected
                          ? 'border-primary bg-primary/5'
                          : 'border-outline-variant/30 hover:border-primary hover:bg-primary/5'
                      }`}
                    >
                      <div className="w-12 h-12 flex-shrink-0 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center">
                        <Icon name={option.icon} />
                      </div>
                      <div className="flex-1">
                        <p className="font-label-md text-label-md text-on-surface mb-1">{option.title}</p>
                        <p className="text-body-md text-on-surface-variant text-sm">{option.desc}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Contextual Visual (Asymmetric Layout) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-7">
                <div className="relative overflow-hidden rounded-xl h-64 shadow-md">
                  <img
                    className="w-full h-full object-cover"
                    alt="A professional photo of a young Ghanaian woman leading a community discussion outdoors under a large Baobab tree."
                    src={VISUAL_IMAGE}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="font-label-md text-label-md">Local Inspiration</p>
                    <p className="font-headline-md text-headline-md-mobile">Ama finds joy in mentoring</p>
                  </div>
                </div>
              </div>
              <div className="md:col-span-5 bg-tertiary text-on-tertiary-container p-6 rounded-xl">
                <Icon name="lightbulb" className="mb-2" filled />
                <p className="font-label-md text-label-md mb-2">Did you know?</p>
                <p className="text-sm">{current.fact}</p>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-xl gap-4">
              <button
                onClick={goPrev}
                disabled={step === 0}
                className="flex-1 h-12 rounded-full border-2 border-primary text-primary font-label-md flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              >
                <Icon name="arrow_back" />
                Previous
              </button>
              <button
                onClick={goNext}
                disabled={answers[step] === undefined}
                className="flex-1 h-12 rounded-full bg-primary text-on-primary font-label-md flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                {step === total - 1 ? 'See Results' : 'Next Question'}
                <Icon name="arrow_forward" />
              </button>
            </div>
          </>
        ) : (
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-md shadow-sm mb-md text-center py-xl">
            <div className="w-16 h-16 mx-auto bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center mb-4">
              <Icon name={RESULTS[topTrait].icon} className="text-4xl" filled />
            </div>
            <span className="inline-block bg-secondary-container text-on-secondary-container font-label-sm text-label-sm px-3 py-1 rounded-full mb-4">
              Your Result
            </span>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-3">{RESULTS[topTrait].title}</h3>
            <p className="text-body-md text-on-surface-variant max-w-md mx-auto mb-8">{RESULTS[topTrait].desc}</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={retake}
                className="h-12 px-8 rounded-full border-2 border-primary text-primary font-label-md flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors"
              >
                <Icon name="refresh" />
                Retake Quiz
              </button>
              <Link
                to="/scholarships"
                className="h-12 px-8 rounded-full bg-primary text-on-primary font-label-md flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
              >
                Explore Scholarships
                <Icon name="arrow_forward" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  )
}
