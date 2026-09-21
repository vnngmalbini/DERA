// Pairs each role's dashboard paths with their page component, for
// App.jsx to turn into <Route> entries. Kept separate from dashboardNav.js
// (which DashboardLayout reads) to avoid a layout <-> pages import cycle.
//
// Every page is lazy — a youth account never needs the admin bundle (and
// vice versa), so each is its own chunk fetched only on navigation.
import { lazy } from 'react'

const YouthOverview = lazy(() => import('../pages/youth/YouthOverview'))
const TeenMotherDashboard = lazy(() => import('../pages/youth/TeenMotherDashboard'))
const DropoutReentryDashboard = lazy(() => import('../pages/youth/DropoutReentryDashboard'))
const Mentorship = lazy(() => import('../pages/youth/Mentorship'))
const Opportunities = lazy(() => import('../pages/youth/Opportunities'))
const LearningResources = lazy(() => import('../pages/youth/LearningResources'))
const ReadingTracker = lazy(() => import('../pages/youth/ReadingTracker'))
const SelfDevelopmentLibrary = lazy(() => import('../pages/youth/SelfDevelopmentLibrary'))
const TeenMotherSupport = lazy(() => import('../pages/youth/TeenMotherSupport'))
const DropoutReentry = lazy(() => import('../pages/youth/DropoutReentry'))

const CounselorOverview = lazy(() => import('../pages/counselor/CounselorOverview'))
const AssignedYouth = lazy(() => import('../pages/counselor/AssignedYouth'))
const YouthDetails = lazy(() => import('../pages/counselor/YouthDetails'))
const CounselingSessions = lazy(() => import('../pages/counselor/CounselingSessions'))
const CounselorReports = lazy(() => import('../pages/counselor/CounselorReports'))
const DropoutRiskAssessment = lazy(() => import('../pages/counselor/DropoutRiskAssessment'))

const DonorOverview = lazy(() => import('../pages/donor/DonorOverview'))
const Donations = lazy(() => import('../pages/donor/Donations'))
const ImpactReports = lazy(() => import('../pages/donor/ImpactReports'))
const SponsoredProjects = lazy(() => import('../pages/donor/SponsoredProjects'))

const AdminOverview = lazy(() => import('../pages/admin/AdminOverview'))
const UserManagement = lazy(() => import('../pages/admin/UserManagement'))
const InstitutionManagement = lazy(() => import('../pages/admin/InstitutionManagement'))
const AdminReports = lazy(() => import('../pages/admin/AdminReports'))
const AdminDonations = lazy(() => import('../pages/admin/AdminDonations'))
const AdminScholarships = lazy(() => import('../pages/admin/AdminScholarships'))
const AdminOpportunities = lazy(() => import('../pages/admin/AdminOpportunities'))
const AdminMentors = lazy(() => import('../pages/admin/AdminMentors'))
const AdminLearningResources = lazy(() => import('../pages/admin/AdminLearningResources'))
const ContentManagement = lazy(() => import('../pages/admin/ContentManagement'))

const DashboardMessages = lazy(() => import('../pages/dashboard/DashboardMessages'))
const DashboardProfile = lazy(() => import('../pages/dashboard/DashboardProfile'))
const DashboardSettings = lazy(() => import('../pages/dashboard/DashboardSettings'))

export const DASHBOARD_PAGES = {
  youth: {
    '/dashboard/youth': YouthOverview,
    '/dashboard/youth/teen-mother': TeenMotherDashboard,
    '/dashboard/youth/dropout-re-entry': DropoutReentryDashboard,
    '/dashboard/youth/dropout-re-entry-support': DropoutReentry,
    '/dashboard/youth/mentorship': Mentorship,
    '/dashboard/youth/teen-mother-support': TeenMotherSupport,
    '/dashboard/youth/opportunities': Opportunities,
    '/dashboard/youth/learning': LearningResources,
    '/dashboard/youth/reading-tracker': ReadingTracker,
    '/dashboard/youth/self-development-library': SelfDevelopmentLibrary,
    '/dashboard/youth/messages': DashboardMessages,
    '/dashboard/youth/profile': DashboardProfile,
    '/dashboard/youth/settings': DashboardSettings,
  },
  counselor: {
    '/dashboard/counselor': CounselorOverview,
    '/dashboard/counselor/youth': AssignedYouth,
    '/dashboard/counselor/youth/:youthId': YouthDetails,
    '/dashboard/counselor/sessions': CounselingSessions,
    '/dashboard/counselor/reports': CounselorReports,
    '/dashboard/counselor/dropout-risk': DropoutRiskAssessment,
    '/dashboard/counselor/messages': DashboardMessages,
    '/dashboard/counselor/profile': DashboardProfile,
    '/dashboard/counselor/settings': DashboardSettings,
  },
  donor: {
    '/dashboard/donor': DonorOverview,
    '/dashboard/donor/donations': Donations,
    '/dashboard/donor/impact': ImpactReports,
    '/dashboard/donor/projects': SponsoredProjects,
    '/dashboard/donor/messages': DashboardMessages,
    '/dashboard/donor/profile': DashboardProfile,
    '/dashboard/donor/settings': DashboardSettings,
  },
  admin: {
    '/dashboard/admin': AdminOverview,
    '/dashboard/admin/users': UserManagement,
    '/dashboard/admin/institutions': InstitutionManagement,
    '/dashboard/admin/reports': AdminReports,
    '/dashboard/admin/donations': AdminDonations,
    '/dashboard/admin/scholarships': AdminScholarships,
    '/dashboard/admin/opportunities': AdminOpportunities,
    '/dashboard/admin/mentors': AdminMentors,
    '/dashboard/admin/learning-resources': AdminLearningResources,
    '/dashboard/admin/content': ContentManagement,
    '/dashboard/admin/settings': DashboardSettings,
  },
}
