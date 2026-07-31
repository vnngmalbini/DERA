import DashboardLayout from '../../components/layout/DashboardLayout'
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader'
import ContentCard from '../../components/dashboard/ContentCard'

// TODO(backend): replace with a real fetch, e.g. GET /api/donor/sponsored-projects/
const PROJECTS = [
  {
    icon: 'code',
    title: 'Rural Coding Bootcamp',
    subtitle: 'Volta Region · Active',
    description: '30 youth enrolled in a 12-week intensive coding program.',
    tag: 'Active',
  },
  {
    icon: 'science',
    title: 'Girls in STEM Fund',
    subtitle: 'Nationwide · Active',
    description: 'Scholarships and lab equipment for girls pursuing science subjects.',
    tag: 'Active',
  },
  {
    icon: 'agriculture',
    title: 'School Farm Initiative',
    subtitle: 'Ashanti Region · Completed',
    description: 'Funded a school farm project that boosted attendance by 20%.',
    tag: 'Completed',
  },
]

export default function SponsoredProjects() {
  return (
    <DashboardLayout role="donor">
      <DashboardPageHeader
        title="Sponsored Projects"
        description="Projects you're currently funding or have completed."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PROJECTS.map((item) => (
          <ContentCard key={item.title} {...item} actionLabel="View Project" />
        ))}
      </div>
    </DashboardLayout>
  )
}
