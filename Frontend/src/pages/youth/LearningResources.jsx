import DashboardLayout from '../../components/layout/DashboardLayout'
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader'
import ContentCard from '../../components/dashboard/ContentCard'

// TODO(backend): replace with a real fetch, e.g. GET /api/learning-resources/
const RESOURCES = [
  {
    icon: 'calculate',
    title: 'WASSCE Core Maths Prep',
    subtitle: 'Course · Self-paced',
    description: 'Video lessons and past-question walkthroughs for core mathematics.',
    tag: 'Popular',
  },
  {
    icon: 'menu_book',
    title: 'English Comprehension Bootcamp',
    subtitle: 'Course · 4 weeks',
    description: 'Build reading comprehension and essay-writing skills.',
    tag: 'New',
  },
  {
    icon: 'code',
    title: 'Intro to Coding with Python',
    subtitle: 'Course · Beginner',
    description: 'A gentle introduction to programming fundamentals.',
    tag: 'Popular',
  },
]

export default function LearningResources() {
  return (
    <DashboardLayout role="youth">
      <DashboardPageHeader
        title="Learning Resources"
        description="Free courses and study materials to help you get ahead."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {RESOURCES.map((item) => (
          <ContentCard key={item.title} {...item} actionLabel="Start Learning" />
        ))}
      </div>
    </DashboardLayout>
  )
}
