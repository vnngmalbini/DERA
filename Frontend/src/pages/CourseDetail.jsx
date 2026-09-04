import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import Icon from '../components/ui/Icon'
import { apiGet } from '../services/apiClient'

const LEVEL_LABELS = {
  certificate: 'Certificate',
  diploma: 'Diploma',
  hnd: 'HND',
  bachelors: "Bachelor's Degree",
  masters: "Master's Degree",
}

export default function CourseDetail() {
  const { courseId } = useParams()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    setLoading(true)
    setLoadError('')
    apiGet(`/courses/${courseId}/`)
      .then(setCourse)
      .catch(() => setLoadError("We couldn't load this course. It may have been removed."))
      .finally(() => setLoading(false))
  }, [courseId])

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-xl">
        <Link
          to={course ? `/career-fields/${course.career_path.id}` : '/career-quiz'}
          className="inline-flex items-center gap-2 text-secondary font-label-md text-label-md hover:underline mb-lg"
        >
          <Icon name="arrow_back" className="text-xl" />
          Back to {course ? course.career_path.title : 'courses'}
        </Link>

        {loading ? (
          <p className="text-body-lg text-on-surface-variant text-center py-20">Loading course…</p>
        ) : loadError || !course ? (
          <p className="text-body-lg text-on-surface-variant text-center py-20">{loadError || 'Course not found.'}</p>
        ) : (
          <>
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-4 sm:p-lg shadow-sm mb-lg">
              <div className="flex items-center gap-2 flex-wrap mb-4">
                <span className="inline-block bg-secondary-container text-on-secondary-container font-label-md text-label-md px-4 py-1.5 rounded-full">
                  {course.career_path.title}
                </span>
                <span className="inline-block bg-primary/10 text-primary font-label-md text-label-md px-4 py-1.5 rounded-full">
                  {LEVEL_LABELS[course.level] || course.level}
                </span>
              </div>
              <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface mb-3">
                {course.title}
              </h1>
              <p className="text-body-lg text-on-surface-variant flex items-center gap-2 mb-4">
                <Icon name="account_balance" className="text-primary text-xl" />
                {course.institution.name}
                {course.institution.region && ` — ${course.institution.region}`}
                {course.duration && ` · ${course.duration}`}
              </p>
              {course.description && (
                <p className="text-body-lg text-on-surface-variant leading-relaxed">{course.description}</p>
              )}
            </div>

            {course.entry_requirements && (
              <div className="bg-surface-container rounded-xl p-lg mb-lg">
                <h2 className="font-headline-sm text-headline-sm text-lg text-on-surface mb-3 flex items-center gap-2">
                  <Icon name="checklist" className="text-primary text-2xl" />
                  Entry requirements
                </h2>
                <p className="text-body-lg text-on-surface-variant leading-relaxed">{course.entry_requirements}</p>
                {course.institution.application_url && (
                  <a
                    href={course.institution.application_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 mt-4 text-secondary font-label-md text-label-md hover:underline"
                  >
                    Visit {course.institution.name}'s admissions page
                    <Icon name="open_in_new" className="text-lg" />
                  </a>
                )}
              </div>
            )}

            <div className="bg-surface-container rounded-xl p-lg mb-lg">
              <h2 className="font-headline-sm text-headline-sm text-lg text-on-surface mb-4 flex items-center gap-2">
                <Icon name="work" className="text-primary text-2xl" />
                Careers this course leads to
              </h2>
              {course.careers.length === 0 ? (
                <p className="text-body-md text-on-surface-variant">
                  We're still linking careers to this course — check back soon, or explore the{' '}
                  <Link to={`/career-fields/${course.career_path.id}`} className="text-secondary hover:underline">
                    field's full career list
                  </Link>
                  .
                </p>
              ) : (
                <ul className="space-y-3">
                  {course.careers.map((career) => (
                    <li
                      key={career.id}
                      className="flex items-start justify-between gap-3 bg-surface-container-lowest rounded-lg p-4"
                    >
                      <div>
                        <p className="font-label-lg text-on-surface">{career.title}</p>
                        {career.summary && (
                          <p className="text-body-md text-on-surface-variant mt-1">{career.summary}</p>
                        )}
                      </div>
                      <Link
                        to={`/careers/${career.id}`}
                        className="read-more-link flex-shrink-0"
                      >
                        Read more <Icon name="arrow_forward" className="text-base" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <p className="text-center text-body-md text-on-surface-variant">
              Want to talk it through with someone?{' '}
              <Link to="/help" className="text-secondary font-label-md hover:underline">
                Chat with Auntie DERA at the Help Centre
              </Link>
              .
            </p>
          </>
        )}
      </div>
    </PageLayout>
  )
}
