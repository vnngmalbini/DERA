import DashboardLayout from '../../components/layout/DashboardLayout'
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader'
import ContentCard from '../../components/dashboard/ContentCard'

// TODO(backend): replace with a real fetch, e.g. GET /api/opportunities/?audience=youth
const OPPORTUNITIES = [
  {
    icon: 'work',
    title: 'MTN Digital Skills Internship',
    subtitle: 'Internship · Accra',
    description: '8-week paid internship for students in tech-related fields.',
    tag: 'New',
  },
  {
    icon: 'emoji_events',
    title: 'National Young Innovators Challenge',
    subtitle: 'Competition · Nationwide',
    description: 'Pitch a community solution for a chance at seed funding.',
    tag: 'Open',
  },
  {
    icon: 'volunteer_activism',
    title: 'Rural Youth Leadership Fellowship',
    subtitle: 'Fellowship · Northern Region',
    description: 'A 6-month leadership development program for JHS/SHS graduates.',
    tag: 'Closing Soon',
  },
]

export default function Opportunities() {
  return (
    <DashboardLayout role="youth">
      <DashboardPageHeader
        title="Opportunities"
        description="Internships, fellowships, and competitions curated for you."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {OPPORTUNITIES.map((item) => (
          <ContentCard key={item.title} {...item} actionLabel="View Opportunity" />
        ))}
      </div>
    </DashboardLayout>
  )
}
