import DashboardLayout from '../../components/layout/DashboardLayout'
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader'
import ContentCard from '../../components/dashboard/ContentCard'

// TODO(backend): replace with a real fetch, e.g. GET /api/donor/impact-reports/
const REPORTS = [
  {
    icon: 'insights',
    title: 'Q2 2026 Impact Summary',
    subtitle: 'Published Jul 15, 2026',
    description: '18 students supported, 92% attendance rate across sponsored cohorts.',
    tag: 'New',
  },
  {
    icon: 'school',
    title: 'Girls in STEM Fund — Outcomes',
    subtitle: 'Published Apr 2, 2026',
    description: '12 girls completed the term with an average grade improvement of 14%.',
  },
  {
    icon: 'handshake',
    title: 'Rural Coding Bootcamp Report',
    subtitle: 'Published Jan 30, 2026',
    description: '30 graduates, 6 placed in paid internships.',
  },
]

export default function ImpactReports() {
  return (
    <DashboardLayout role="donor">
      <DashboardPageHeader
        title="Impact Reports"
        description="See the measurable outcomes of your giving."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {REPORTS.map((item) => (
          <ContentCard key={item.title} {...item} actionLabel="Read Report" />
        ))}
      </div>
    </DashboardLayout>
  )
}
