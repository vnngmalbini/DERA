import { Link } from 'react-router-dom'
import Icon from '../ui/Icon'

/**
 * The careers/courses/institutions lists for one CareerPath field. Shared
 * between the quiz results screen and the standalone field page
 * (/career-fields/:careerPathId) so a young person always lands somewhere
 * that lets them keep exploring other careers and courses in the field,
 * not just the one they clicked into.
 */
export default function CareerFieldResults({ careerPath }) {
  return (
    <div className="text-left max-w-3xl mx-auto space-y-6">
      <div className="bg-surface-container rounded-xl p-lg">
        <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
          <h4 className="font-headline-sm text-headline-sm text-lg text-on-surface flex items-center gap-2">
            <Icon name="work" className="text-primary text-2xl" />
            Careers to consider
          </h4>
          <span className="bg-primary text-on-primary font-label-md text-label-md px-3 py-1 rounded-full">
            {careerPath.career_count} {careerPath.career_count === 1 ? 'career' : 'careers'} in this field
          </span>
        </div>
        {careerPath.qualification_required && (
          <p className="text-body-md text-on-surface-variant mb-4">
            Typically requires: {careerPath.qualification_required}
          </p>
        )}
        {careerPath.careers.length === 0 ? (
          <p className="text-body-md text-on-surface-variant">
            We're still curating specific careers for this path — check back soon.
          </p>
        ) : (
          <ul className="space-y-3">
            {careerPath.careers.map((career) => (
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
                  className="flex-shrink-0 text-secondary font-label-md text-label-md hover:underline whitespace-nowrap"
                >
                  Read more
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-surface-container rounded-xl p-lg">
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <h4 className="font-headline-sm text-headline-sm text-lg text-on-surface flex items-center gap-2">
            <Icon name="menu_book" className="text-primary text-2xl" />
            Courses you can study to get there
          </h4>
          <span className="bg-secondary-container text-on-secondary-container font-label-md text-label-md px-3 py-1 rounded-full">
            {careerPath.course_count} {careerPath.course_count === 1 ? 'course' : 'courses'} available
          </span>
        </div>
        {careerPath.courses.length === 0 ? (
          <p className="text-body-md text-on-surface-variant">
            We're still curating courses for this path — check back soon.
          </p>
        ) : (
          <ul className="space-y-3">
            {careerPath.courses.map((course) => (
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
                  className="flex-shrink-0 text-secondary font-label-md text-label-md hover:underline whitespace-nowrap"
                >
                  Read more
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-surface-container rounded-xl p-lg">
        <h4 className="font-headline-sm text-headline-sm text-lg text-on-surface mb-4 flex items-center gap-2">
          <Icon name="account_balance" className="text-primary text-2xl" />
          Institutions to consider
        </h4>
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
                  {inst.region && <span className="text-on-surface-variant"> — {inst.region}</span>}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="text-center text-body-md text-on-surface-variant">
        Still have questions about a career or course?{' '}
        <Link to="/help" className="text-secondary font-label-md hover:underline">
          Talk to Auntie DERA at the Help Centre
        </Link>
        .
      </p>
    </div>
  )
}
