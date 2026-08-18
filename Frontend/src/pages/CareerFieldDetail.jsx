import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import CareerFieldResults from '../components/career/CareerFieldResults'
import PageLayout from '../components/layout/PageLayout'
import Icon from '../components/ui/Icon'
import { apiGet } from '../services/apiClient'

/**
 * A stable, linkable page for one career field — what "Back" from a career
 * or course detail page always lands on, so a young person can keep
 * browsing other careers and courses in the same field instead of being
 * dropped back at the quiz intro (whose result only ever lived in that
 * page's local, ephemeral state).
 */
export default function CareerFieldDetail() {
  const { careerPathId } = useParams()
  const [careerPath, setCareerPath] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    setLoading(true)
    setLoadError('')
    apiGet(`/career-paths/${careerPathId}/`)
      .then(setCareerPath)
      .catch(() => setLoadError("We couldn't load this career field. It may have been removed."))
      .finally(() => setLoading(false))
  }, [careerPathId])

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-xl">
        <Link
          to="/career-quiz"
          className="inline-flex items-center gap-2 text-secondary font-label-md text-label-md hover:underline mb-lg"
        >
          <Icon name="arrow_back" className="text-xl" />
          Back to Career Quiz
        </Link>

        {loading ? (
          <p className="text-body-lg text-on-surface-variant text-center py-20">Loading career field…</p>
        ) : loadError || !careerPath ? (
          <p className="text-body-lg text-on-surface-variant text-center py-20">
            {loadError || 'Career field not found.'}
          </p>
        ) : (
          <>
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-4 sm:p-lg shadow-sm mb-lg">
              <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface mb-4">
                {careerPath.title}
              </h1>
              {careerPath.description && (
                <p className="text-body-lg text-on-surface-variant leading-relaxed">{careerPath.description}</p>
              )}
            </div>

            <CareerFieldResults careerPath={careerPath} />
          </>
        )}
      </div>
    </PageLayout>
  )
}
