/**
 * Dashboard summary API integration point.
 *
 * Placeholder — swap the body below for a real request once the backend
 * endpoint exists. Suggested shape:
 *
 *   export async function fetchDashboardSummary(role) {
 *     const res = await fetch(`/api/dashboard/${role}/summary/`, {
 *       credentials: 'include',
 *     })
 *     if (!res.ok) throw new Error('Failed to load dashboard summary')
 *     return res.json()
 *   }
 *
 * Until then, each role gets a small set of mock stats/widgets so the
 * dashboard UI has something real to render.
 */

const MOCK_SUMMARIES = {
  youth: {
    stats: [
      { label: 'Saved Scholarships', value: '6', icon: 'school', tone: 'primary' },
      { label: 'Applications In Progress', value: '2', icon: 'assignment', tone: 'secondary' },
      { label: 'Mentor Sessions', value: '3', icon: 'diversity_3', tone: 'tertiary' },
    ],
    quickActions: [
      { label: 'Browse Scholarships', to: '/scholarships', icon: 'school' },
      { label: 'Take Career Quiz', to: '/career-quiz', icon: 'psychology' },
      { label: 'Message a Mentor', to: '/dashboard/youth/messages', icon: 'chat_bubble' },
    ],
    activity: [
      { title: 'MTN Foundation Scholarship', detail: 'Application under review', time: '2d ago', icon: 'assignment_turned_in' },
      { title: 'Career Quiz completed', detail: 'Recommended path: Agri-Tech', time: '5d ago', icon: 'psychology' },
      { title: 'New mentorship match', detail: 'Paired with Ama K. (Software Engineer)', time: '1w ago', icon: 'diversity_3' },
    ],
  },
  counselor: {
    stats: [
      { label: 'Assigned Youth', value: '42', icon: 'groups', tone: 'primary' },
      { label: 'At-Risk Cases', value: '12', icon: 'warning', tone: 'error' },
      { label: 'Sessions This Week', value: '9', icon: 'event_available', tone: 'tertiary' },
    ],
    quickActions: [
      { label: 'View Assigned Youth', to: '/dashboard/counselor/youth', icon: 'groups' },
      { label: 'Log a Session', to: '/dashboard/counselor/sessions', icon: 'event_available' },
      { label: 'View Reports', to: '/dashboard/counselor/reports', icon: 'analytics' },
    ],
    activity: [
      { title: 'Kojo Antwi', detail: 'Missed 3 consecutive days', time: '2h ago', icon: 'warning' },
      { title: 'Abena Mansa', detail: 'Sudden drop in Math scores', time: '5h ago', icon: 'trending_down' },
      { title: 'Ekow Mensah', detail: 'Successful intervention check-in', time: '1d ago', icon: 'check_circle' },
    ],
  },
  donor: {
    stats: [
      { label: 'Total Donated', value: '₵24,500', icon: 'volunteer_activism', tone: 'primary' },
      { label: 'Students Sponsored', value: '18', icon: 'groups', tone: 'secondary' },
      { label: 'Active Projects', value: '3', icon: 'handshake', tone: 'tertiary' },
    ],
    quickActions: [
      { label: 'Make a Donation', to: '/dashboard/donor/donations', icon: 'volunteer_activism' },
      { label: 'View Impact Reports', to: '/dashboard/donor/impact', icon: 'insights' },
      { label: 'Sponsored Projects', to: '/dashboard/donor/projects', icon: 'handshake' },
    ],
    activity: [
      { title: 'Donation received', detail: '₵2,000 to Girls in STEM Fund', time: '3d ago', icon: 'volunteer_activism' },
      { title: 'Impact report published', detail: 'Q2 2026 outcomes now available', time: '1w ago', icon: 'insights' },
      { title: 'New sponsored project', detail: 'Rural Coding Bootcamp — Volta Region', time: '2w ago', icon: 'handshake' },
    ],
  },
  admin: {
    stats: [
      { label: 'Total Users', value: '3,842', icon: 'group', tone: 'primary' },
      { label: 'Institutions', value: '56', icon: 'account_balance', tone: 'secondary' },
      { label: 'Pending Reviews', value: '14', icon: 'pending_actions', tone: 'error' },
    ],
    quickActions: [
      { label: 'Manage Users', to: '/dashboard/admin/users', icon: 'manage_accounts' },
      { label: 'Manage Institutions', to: '/dashboard/admin/institutions', icon: 'account_balance' },
      { label: 'View Reports', to: '/dashboard/admin/reports', icon: 'analytics' },
    ],
    activity: [
      { title: 'New institution request', detail: 'Tamale Girls SHS awaiting approval', time: '1h ago', icon: 'account_balance' },
      { title: 'Flagged content', detail: 'A forum post was reported', time: '6h ago', icon: 'flag' },
      { title: 'Donation milestone', detail: 'Platform passed ₵500,000 total donated', time: '2d ago', icon: 'celebration' },
    ],
  },
}

export async function fetchDashboardSummary(role) {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return MOCK_SUMMARIES[role] ?? { stats: [], quickActions: [], activity: [] }
}
