import DashboardLayout from '../../components/layout/DashboardLayout'
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader'
import ContentCard from '../../components/dashboard/ContentCard'

// TODO(backend): replace with a real fetch, e.g. GET /api/mentorship/matches/
const MENTORS = [
  {
    icon: 'engineering',
    title: 'Ama Kusi',
    subtitle: 'Software Engineer, Accra',
    description: 'Matched on your Career Quiz results — Agri-Tech & Software track.',
    tag: 'Matched',
  },
  {
    icon: 'agriculture',
    title: 'Kwabena Owusu',
    subtitle: 'Agribusiness Founder, Kumasi',
    description: 'Runs a farming cooperative; open to mentoring on entrepreneurship.',
    tag: 'Suggested',
  },
  {
    icon: 'health_and_safety',
    title: 'Dr. Efua Boateng',
    subtitle: 'Public Health Officer, Takoradi',
    description: 'Mentors students interested in health sciences and community work.',
    tag: 'Suggested',
  },
]

export default function Mentorship() {
  return (
    <DashboardLayout role="youth">
      <DashboardPageHeader
        title="Mentorship"
        description="Connect with mentors matched to your interests and career goals."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MENTORS.map((mentor) => (
          <ContentCard key={mentor.title} {...mentor} actionLabel="Message Mentor" />
        ))}
      </div>
    </DashboardLayout>
  )
}
