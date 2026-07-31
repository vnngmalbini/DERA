// Pairs each role's dashboard paths with their page component, for
// App.jsx to turn into <Route> entries. Kept separate from dashboardNav.js
// (which DashboardLayout reads) to avoid a layout <-> pages import cycle.
import YouthOverview from '../pages/youth/YouthOverview'
import Mentorship from '../pages/youth/Mentorship'
import Opportunities from '../pages/youth/Opportunities'
import LearningResources from '../pages/youth/LearningResources'

import CounselorOverview from '../pages/counselor/CounselorOverview'
import AssignedYouth from '../pages/counselor/AssignedYouth'
import YouthDetails from '../pages/counselor/YouthDetails'
import CounselingSessions from '../pages/counselor/CounselingSessions'
import CounselorReports from '../pages/counselor/CounselorReports'

import DonorOverview from '../pages/donor/DonorOverview'
import Donations from '../pages/donor/Donations'
import ImpactReports from '../pages/donor/ImpactReports'
import SponsoredProjects from '../pages/donor/SponsoredProjects'

import AdminOverview from '../pages/admin/AdminOverview'
import UserManagement from '../pages/admin/UserManagement'
import InstitutionManagement from '../pages/admin/InstitutionManagement'
import AdminReports from '../pages/admin/AdminReports'
import AdminDonations from '../pages/admin/AdminDonations'
import AdminOpportunities from '../pages/admin/AdminOpportunities'
import ContentManagement from '../pages/admin/ContentManagement'

import DashboardMessages from '../pages/dashboard/DashboardMessages'
import DashboardProfile from '../pages/dashboard/DashboardProfile'
import DashboardSettings from '../pages/dashboard/DashboardSettings'

export const DASHBOARD_PAGES = {
  youth: {
    '/dashboard/youth': YouthOverview,
    '/dashboard/youth/mentorship': Mentorship,
    '/dashboard/youth/opportunities': Opportunities,
    '/dashboard/youth/learning': LearningResources,
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
    '/dashboard/admin/opportunities': AdminOpportunities,
    '/dashboard/admin/content': ContentManagement,
    '/dashboard/admin/settings': DashboardSettings,
  },
}
