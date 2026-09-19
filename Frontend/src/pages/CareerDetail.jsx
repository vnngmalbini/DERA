import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import { apiGet } from '../services/apiClient'

export default function CareerDetail() {
  const { careerId } = useParams()
  const [career, setCareer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    setLoading(true)
    setLoadError('')
    apiGet(`/careers/${careerId}/`)
      .then(setCareer)
      .catch(() => setLoadError("We couldn't load this career. It may have been removed."))
      .finally(() => setLoading(false))
  }, [careerId])

  return (
    <>
      <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-xl">
        <Link
          to={career ? `/career-fields/${career.career_path.id}` : '/career-quiz'}
          className="inline-flex items-center gap-2 text-secondary font-label-md text-label-md hover:underline mb-lg"
        >
          <Icon name="arrow_back" className="text-xl" />
          Back to {career ? career.career_path.title : 'careers'}
        </Link>

        {loading ? (
          <p className="text-body-lg text-on-surface-variant text-center py-20">Loading career…</p>
        ) : loadError || !career ? (
          <p className="text-body-lg text-on-surface-variant text-center py-20">{loadError || 'Career not found.'}</p>
        ) : (
          <>
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-4 sm:p-lg shadow-sm mb-lg">
              <span className="inline-block bg-secondary-container text-on-secondary-container font-label-md text-label-md px-4 py-1.5 rounded-full mb-4">
                {career.career_path.title}
              </span>
              <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface mb-4">
                {career.title}
              </h1>
              {career.summary && (
                <p className="text-body-lg text-on-surface-variant leading-relaxed mb-4">{career.summary}</p>
              )}
              {career.typical_earnings && (
                <p className="text-body-md text-on-surface-variant">
                  <span className="font-label-md text-on-surface">Typical earnings: </span>
                  {career.typical_earnings}
                </p>
              )}
            </div>

            {career.day_to_day && (
              <div className="bg-surface-container rounded-xl p-lg mb-lg">
                <h2 className="font-headline-sm text-headline-sm text-lg text-on-surface mb-3 flex items-center gap-2">
                  <Icon name="today" className="text-primary text-2xl" />
                  What a typical day looks like
                </h2>
                <p className="text-body-lg text-on-surface-variant leading-relaxed">{career.day_to_day}</p>
              </div>
            )}

            <div className="bg-surface-container rounded-xl p-lg mb-lg">
              <h2 className="font-headline-sm text-headline-sm text-lg text-on-surface mb-4 flex items-center gap-2">
                <Icon name="menu_book" className="text-primary text-2xl" />
                Courses that lead here
              </h2>
              {career.courses.length === 0 ? (
                <p className="text-body-md text-on-surface-variant">
                  We're still linking courses to this career — check back soon, or explore the{' '}
                  <Link to={`/career-fields/${career.career_path.id}`} className="text-secondary hover:underline">
                    field's full course list
                  </Link>
                  .
                </p>
              ) : (
                <ul className="space-y-3">
                  {career.courses.map((course) => (
                    <li
                      key={course.id}
                      className="flex items-start justify-between gap-3 bg-surface-container-lowest rounded-lg p-4"
                    >
                      <div className="flex items-start gap-3">
                        <Icon name="school" className="text-primary text-2xl mt-0.5" />
                        <div>
                          <p className="font-label-lg text-on-surface">{course.title}</p>
                          <p className="text-body-md text-on-surface-variant">
                            {course.institution.name}
                            {course.institution.region && ` — ${course.institution.region}`}
                            {course.duration && ` · ${course.duration}`}
                          </p>
                        </div>
                      </div>
                      <Link
                        to={`/courses/${course.id}`}
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
    </>
  )
}
