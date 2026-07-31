/**
 * Dashboard summary API integration point.
 *
 * The admin summary is computed from real data (users, institutions, help
 * requests, sponsorships) since an admin views the platform, not their own
 * activity. Youth/counselor/donor summaries are still mocked below — no
 * backend endpoint exists yet for a personal dashboard-summary aggregate
 * for those roles.
 */

import { apiGet } from './apiClient'

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
}

function timeAgo(dateString) {
  const diffMs = Date.now() - new Date(dateString).getTime()
  const minutes = Math.floor(diffMs / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  const weeks = Math.floor(days / 7)
  return `${weeks}w ago`
}

function displayName(user) {
  const profile = user.youth_profile || user.counselor_profile || user.donor_profile
  return profile?.full_name || user.email
}

async function fetchAdminSummary() {
  const [usersRes, institutionsRes, helpRequestsRes, sponsorshipsRes] = await Promise.all([
    apiGet('/users/'),
    apiGet('/institutions/'),
    apiGet('/help-requests/'),
    apiGet('/sponsorships/'),
  ])

  const users = usersRes.results ?? usersRes
  const institutions = institutionsRes.results ?? institutionsRes
  const sponsorships = sponsorshipsRes.results ?? sponsorshipsRes

  const stats = [
    { label: 'Total Users', value: String(usersRes.count ?? users.length), icon: 'group', tone: 'primary' },
    { label: 'Institutions', value: String(institutionsRes.count ?? institutions.length), icon: 'account_balance', tone: 'secondary' },
    { label: 'Help Requests', value: String(helpRequestsRes.count ?? (helpRequestsRes.results ?? helpRequestsRes).length), icon: 'support_agent', tone: 'tertiary' },
  ]

  const quickActions = [
    { label: 'Manage Users', to: '/dashboard/admin/users', icon: 'manage_accounts' },
    { label: 'Manage Institutions', to: '/dashboard/admin/institutions', icon: 'account_balance' },
    { label: 'View Reports', to: '/dashboard/admin/reports', icon: 'analytics' },
  ]

  const recentUsers = [...users]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 3)
    .map((u) => ({
      title: displayName(u),
      detail: `New ${u.role} account`,
      time: timeAgo(u.created_at),
      icon: 'person_add',
      at: u.created_at,
    }))

  const recentInstitutions = [...institutions]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 3)
    .map((i) => ({
      title: i.name,
      detail: 'New institution added',
      time: timeAgo(i.created_at),
      icon: 'account_balance',
      at: i.created_at,
    }))

  const recentSponsorships = [...sponsorships]
    .sort((a, b) => new Date(b.funded_at) - new Date(a.funded_at))
    .slice(0, 3)
    .map((s) => ({
      title: s.donor_detail?.full_name || 'A donor',
      detail: `Donated ₵${Number(s.amount).toLocaleString()}`,
      time: timeAgo(s.funded_at),
      icon: 'volunteer_activism',
      at: s.funded_at,
    }))

  const activity = [...recentUsers, ...recentInstitutions, ...recentSponsorships]
    .sort((a, b) => new Date(b.at) - new Date(a.at))
    .slice(0, 5)
    .map(({ at: _at, ...item }) => item)

  return { stats, quickActions, activity }
}

export async function fetchDashboardSummary(role) {
  if (role === 'admin') {
    try {
      return await fetchAdminSummary()
    } catch {
      return { stats: [], quickActions: [], activity: [] }
    }
  }
  await new Promise((resolve) => setTimeout(resolve, 500))
  return MOCK_SUMMARIES[role] ?? { stats: [], quickActions: [], activity: [] }
}
