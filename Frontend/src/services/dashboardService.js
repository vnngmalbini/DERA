/**
 * Dashboard summary API integration point.
 *
 * Every role's summary is composed here from real endpoints and aggregated
 * on the client (same approach the admin summary always used) — none of it
 * is fabricated. Empty arrays/zero counts are the honest result when a
 * youth/counselor/donor genuinely has no activity yet.
 */

import { apiGet } from './apiClient'

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

function mergeActivity(...groups) {
  return groups
    .flat()
    .sort((a, b) => new Date(b.at) - new Date(a.at))
    .slice(0, 5)
    .map(({ at: _at, ...item }) => item)
}

async function fetchYouthSummary() {
  const [quizRes, formOrdersRes, scholarshipsRes] = await Promise.all([
    apiGet('/quiz-responses/'),
    apiGet('/form-orders/'),
    apiGet('/scholarships/'),
  ])
  const quizResponses = quizRes.results ?? quizRes
  const formOrders = formOrdersRes.results ?? formOrdersRes
  const scholarships = scholarshipsRes.results ?? scholarshipsRes

  const stats = [
    { label: 'Career Quizzes Taken', value: String(quizRes.count ?? quizResponses.length), icon: 'psychology', tone: 'primary' },
    { label: 'Applications Submitted', value: String(formOrdersRes.count ?? formOrders.length), icon: 'assignment', tone: 'secondary' },
    { label: 'Scholarships Available', value: String(scholarshipsRes.count ?? scholarships.length), icon: 'school', tone: 'tertiary' },
  ]

  const quickActions = [
    { label: 'Take Career Quiz', to: '/career-quiz', icon: 'psychology' },
    { label: 'Chat with AI Counsellor', to: '/ai-chat', icon: 'smart_toy' },
    { label: 'Browse Scholarships', to: '/scholarships', icon: 'school' },
  ]

  const quizActivity = quizResponses.map((q) => ({
    title: 'Career discovery quiz completed',
    detail: `${q.matches?.length ?? 0} career match${q.matches?.length === 1 ? '' : 'es'} generated`,
    time: timeAgo(q.submitted_at),
    icon: 'psychology',
    at: q.submitted_at,
  }))

  const orderActivity = formOrders.map((o) => ({
    title: 'Application form order',
    detail: `Status: ${o.status}`,
    time: timeAgo(o.created_at),
    icon: 'assignment_turned_in',
    at: o.created_at,
  }))

  return { stats, quickActions, activity: mergeActivity(quizActivity, orderActivity) }
}

async function fetchCounselorSummary() {
  const [roster, sessionsRes] = await Promise.all([
    apiGet('/counselor-roster/'),
    apiGet('/counseling-sessions/'),
  ])
  const sessions = sessionsRes.results ?? sessionsRes

  const atRiskCount = roster.filter((r) => ['High', 'Critical'].includes(r.risk_level)).length
  const upcomingSessions = sessions.filter((s) => s.status === 'upcoming').length

  const stats = [
    { label: 'Assigned Youth', value: String(roster.length), icon: 'groups', tone: 'primary' },
    { label: 'At-Risk Cases', value: String(atRiskCount), icon: 'warning', tone: 'error' },
    { label: 'Upcoming Sessions', value: String(upcomingSessions), icon: 'event_available', tone: 'tertiary' },
  ]

  const quickActions = [
    { label: 'View Assigned Youth', to: '/dashboard/counselor/youth', icon: 'groups' },
    { label: 'Schedule a Session', to: '/dashboard/counselor/sessions', icon: 'event_available' },
    { label: 'View Reports', to: '/dashboard/counselor/reports', icon: 'analytics' },
  ]

  const sessionActivity = sessions.map((s) => ({
    title: s.youth_name || 'Session',
    detail: `${s.session_type_display} — ${s.status_display}`,
    time: timeAgo(s.created_at),
    icon: 'event_available',
    at: s.created_at,
  }))

  const riskActivity = roster
    .filter((r) => r.assessed_at)
    .map((r) => ({
      title: r.full_name,
      detail: `Latest risk level: ${r.risk_level}`,
      time: timeAgo(r.assessed_at),
      icon: 'warning',
      at: r.assessed_at,
    }))

  return { stats, quickActions, activity: mergeActivity(sessionActivity, riskActivity), roster }
}

async function fetchDonorSummary() {
  const [donationsRes, sponsorshipsRes] = await Promise.all([
    apiGet('/donations/'),
    apiGet('/sponsorships/'),
  ])
  const donations = donationsRes.results ?? donationsRes
  const sponsorships = sponsorshipsRes.results ?? sponsorshipsRes

  const totalDonated = donations
    .filter((d) => d.status === 'success')
    .reduce((sum, d) => sum + Number(d.amount), 0)
  const supportedProjects = new Map()
  donations.forEach((d) => {
    if (d.project) supportedProjects.set(d.project.id, d.project)
  })

  const stats = [
    { label: 'Total Donated', value: `₵${totalDonated.toLocaleString()}`, icon: 'volunteer_activism', tone: 'primary' },
    { label: 'Students Sponsored', value: String(sponsorshipsRes.count ?? sponsorships.length), icon: 'groups', tone: 'secondary' },
    { label: 'Projects Supported', value: String(supportedProjects.size), icon: 'handshake', tone: 'tertiary' },
  ]

  const quickActions = [
    { label: 'Make a Donation', to: '/donate', icon: 'volunteer_activism' },
    { label: 'View Impact Reports', to: '/dashboard/donor/impact', icon: 'insights' },
    { label: 'Sponsored Projects', to: '/dashboard/donor/projects', icon: 'handshake' },
  ]

  const donationActivity = donations.map((d) => ({
    title: d.project?.title || 'Donation',
    detail: `₵${Number(d.amount).toLocaleString()} — ${d.status}`,
    time: timeAgo(d.created_at),
    icon: 'volunteer_activism',
    at: d.created_at,
  }))

  const sponsorshipActivity = sponsorships.map((s) => ({
    title: 'Sponsored a student application',
    detail: `₵${Number(s.amount).toLocaleString()} funded`,
    time: timeAgo(s.funded_at),
    icon: 'handshake',
    at: s.funded_at,
  }))

  const featuredProject = [...supportedProjects.values()][0] ?? null

  return { stats, quickActions, activity: mergeActivity(donationActivity, sponsorshipActivity), featuredProject }
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

  return { stats, quickActions, activity: mergeActivity(recentUsers, recentInstitutions, recentSponsorships) }
}

const FETCHERS = {
  youth: fetchYouthSummary,
  counselor: fetchCounselorSummary,
  donor: fetchDonorSummary,
  admin: fetchAdminSummary,
}

export async function fetchDashboardSummary(role) {
  const fetcher = FETCHERS[role]
  if (!fetcher) return { stats: [], quickActions: [], activity: [] }
  try {
    return await fetcher()
  } catch {
    return { stats: [], quickActions: [], activity: [] }
  }
}
