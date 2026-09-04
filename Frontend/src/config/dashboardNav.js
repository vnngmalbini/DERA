// Pure data — no component imports here. DashboardLayout (sidebar/header)
// reads this directly; dashboardRoutes.jsx pairs these paths with page
// components for App.jsx. Keeping the two separate avoids a circular
// import between the layout and the pages that render it.
export const DASHBOARD_META = {
  youth: {
    label: 'Youth',
    basePath: '/dashboard/youth',
    navItems: [
      { key: 'overview', label: 'Overview', to: '/dashboard/youth', icon: 'dashboard', end: true },
      { key: 'career-quiz', label: 'Career Discovery Quiz', to: '/career-quiz', icon: 'psychology' },
      { key: 'scholarships', label: 'Scholarships', to: '/scholarships', icon: 'school' },
      { key: 'ai-counsellor', label: 'AI Career Counsellor', to: '/ai-chat', icon: 'smart_toy' },
      { key: 'growth-librarian', label: 'Growth Librarian', to: '/growth-librarian', icon: 'auto_stories' },
      {
        key: 'reading-tracker',
        label: 'Reading Tracker',
        to: '/dashboard/youth/reading-tracker',
        icon: 'menu_book',
      },
      {
        key: 'self-development-library',
        label: 'Self Development Library',
        to: '/dashboard/youth/self-development-library',
        icon: 'public',
      },
      { key: 'mentorship', label: 'Mentorship', to: '/dashboard/youth/mentorship', icon: 'diversity_3' },
      { key: 'opportunities', label: 'Opportunities', to: '/dashboard/youth/opportunities', icon: 'explore' },
      { key: 'learning', label: 'Learning Resources', to: '/dashboard/youth/learning', icon: 'auto_stories' },
      { key: 'messages', label: 'Messages', to: '/dashboard/youth/messages', icon: 'chat_bubble' },
      { key: 'real-stories', label: 'Real Stories', to: '/stories', icon: 'auto_stories' },
      { key: 'forms-marketplace', label: 'Forms Marketplace', to: '/forms', icon: 'assignment' },
      { key: 'help-centre', label: 'Help Centre', to: '/help', icon: 'support_agent' },
      { key: 'profile', label: 'Profile', to: '/dashboard/youth/profile', icon: 'person' },
      { key: 'settings', label: 'Settings', to: '/dashboard/youth/settings', icon: 'settings' },
    ],
  },
  counselor: {
    label: 'Counselor',
    basePath: '/dashboard/counselor',
    navItems: [
      { key: 'overview', label: 'Overview', to: '/dashboard/counselor', icon: 'dashboard', end: true },
      { key: 'youth', label: 'Assigned Youth', to: '/dashboard/counselor/youth', icon: 'groups' },
      { key: 'sessions', label: 'Counseling Sessions', to: '/dashboard/counselor/sessions', icon: 'event_available' },
      { key: 'reports', label: 'Reports', to: '/dashboard/counselor/reports', icon: 'analytics' },
      { key: 'messages', label: 'Messages', to: '/dashboard/counselor/messages', icon: 'chat_bubble' },
      { key: 'forms-marketplace', label: 'Forms Marketplace', to: '/forms', icon: 'assignment' },
      { key: 'profile', label: 'Profile', to: '/dashboard/counselor/profile', icon: 'person' },
      { key: 'settings', label: 'Settings', to: '/dashboard/counselor/settings', icon: 'settings' },
    ],
  },
  donor: {
    label: 'Donor',
    basePath: '/dashboard/donor',
    navItems: [
      { key: 'overview', label: 'Overview', to: '/dashboard/donor', icon: 'dashboard', end: true },
      { key: 'donations', label: 'Donations', to: '/dashboard/donor/donations', icon: 'volunteer_activism' },
      { key: 'impact', label: 'Impact Reports', to: '/dashboard/donor/impact', icon: 'insights' },
      { key: 'projects', label: 'Sponsored Projects', to: '/dashboard/donor/projects', icon: 'handshake' },
      { key: 'messages', label: 'Messages', to: '/dashboard/donor/messages', icon: 'chat_bubble' },
      { key: 'forms-marketplace', label: 'Forms Marketplace', to: '/forms', icon: 'assignment' },
      { key: 'profile', label: 'Profile', to: '/dashboard/donor/profile', icon: 'person' },
      { key: 'settings', label: 'Settings', to: '/dashboard/donor/settings', icon: 'settings' },
    ],
  },
  admin: {
    label: 'Admin',
    basePath: '/dashboard/admin',
    navItems: [
      { key: 'overview', label: 'Overview', to: '/dashboard/admin', icon: 'dashboard', end: true },
      { key: 'users', label: 'User Management', to: '/dashboard/admin/users', icon: 'manage_accounts' },
      {
        key: 'institutions',
        label: 'Institution Management',
        to: '/dashboard/admin/institutions',
        icon: 'account_balance',
      },
      { key: 'reports', label: 'Reports & Analytics', to: '/dashboard/admin/reports', icon: 'analytics' },
      { key: 'donations', label: 'Donations', to: '/dashboard/admin/donations', icon: 'volunteer_activism' },
      { key: 'scholarships', label: 'Scholarships', to: '/dashboard/admin/scholarships', icon: 'school' },
      { key: 'opportunities', label: 'Opportunities', to: '/dashboard/admin/opportunities', icon: 'explore' },
      { key: 'mentors', label: 'Mentors', to: '/dashboard/admin/mentors', icon: 'diversity_3' },
      {
        key: 'learning-resources',
        label: 'Learning Resources',
        to: '/dashboard/admin/learning-resources',
        icon: 'auto_stories',
      },
      { key: 'forms-marketplace', label: 'Forms Marketplace', to: '/forms', icon: 'assignment' },
      { key: 'content', label: 'Content Management', to: '/dashboard/admin/content', icon: 'edit_note' },
      { key: 'settings', label: 'Settings', to: '/dashboard/admin/settings', icon: 'settings' },
    ],
  },
}

const PATHWAY_META = {
  teen_mother_program: {
    label: 'Teen Mother',
    basePath: '/dashboard/youth/teen-mother',
    navItems: [
      { key: 'overview', label: 'My Support Plan', to: '/dashboard/youth/teen-mother', icon: 'dashboard', end: true },
      { key: 'support', label: 'Support Services', to: '/dashboard/youth/teen-mother-support', icon: 'pregnant_woman' },
      { key: 'learning', label: 'Flexible Learning', to: '/dashboard/youth/learning', icon: 'school' },
      { key: 'opportunities', label: 'Opportunities', to: '/dashboard/youth/opportunities', icon: 'explore' },
      { key: 'mentorship', label: 'Mentorship', to: '/dashboard/youth/mentorship', icon: 'diversity_3' },
      { key: 'messages', label: 'Messages', to: '/dashboard/youth/messages', icon: 'chat_bubble' },
      { key: 'real-stories', label: 'Real Stories', to: '/stories', icon: 'auto_stories' },
      { key: 'help-centre', label: 'Help Centre', to: '/help', icon: 'support_agent' },
      { key: 'profile', label: 'Profile', to: '/dashboard/youth/profile', icon: 'person' },
      { key: 'settings', label: 'Settings', to: '/dashboard/youth/settings', icon: 'settings' },
    ],
  },
  dropout_re_entry: {
    label: 'Dropout Re-entry',
    basePath: '/dashboard/youth/dropout-re-entry',
    navItems: [
      { key: 'overview', label: 'My Re-entry Plan', to: '/dashboard/youth/dropout-re-entry', icon: 'dashboard', end: true },
      { key: 'learning', label: 'Learning Options', to: '/dashboard/youth/learning', icon: 'school' },
      { key: 'support', label: 'Re-entry Support', to: '/dashboard/youth/dropout-re-entry-support', icon: 'support_agent' },
      { key: 'opportunities', label: 'Opportunities', to: '/dashboard/youth/opportunities', icon: 'explore' },
      { key: 'mentorship', label: 'Mentorship', to: '/dashboard/youth/mentorship', icon: 'diversity_3' },
      { key: 'messages', label: 'Messages', to: '/dashboard/youth/messages', icon: 'chat_bubble' },
      { key: 'real-stories', label: 'Real Stories', to: '/stories', icon: 'auto_stories' },
      { key: 'help-centre', label: 'Help Centre', to: '/help', icon: 'support_agent' },
      { key: 'profile', label: 'Profile', to: '/dashboard/youth/profile', icon: 'person' },
      { key: 'settings', label: 'Settings', to: '/dashboard/youth/settings', icon: 'settings' },
    ],
  },
}

export function getDashboardMeta(role, educationLevel) {
  if (role === 'youth' && PATHWAY_META[educationLevel]) return PATHWAY_META[educationLevel]
  return DASHBOARD_META[role] ?? null
}

export function getDashboardMetaForUser(user) {
  return getDashboardMeta(user?.role, user?.educationLevel || user?.youth_profile?.education_level)
}
