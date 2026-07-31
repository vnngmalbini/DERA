import { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader'
import Icon from '../../components/ui/Icon'

// TODO(backend): replace with a real fetch, e.g. GET /api/counselor/sessions/
const INITIAL_SESSIONS = [
  { id: 1, youth: 'Abena Sarfo', type: 'Academic Check-in', date: 'Jul 28, 2026', time: '10:00 AM', status: 'Upcoming' },
  { id: 2, youth: 'Kofi Osei', type: 'Home Visit Follow-up', date: 'Jul 29, 2026', time: '2:30 PM', status: 'Upcoming' },
  { id: 3, youth: 'Ekow Mensah', type: 'Mentorship Pairing', date: 'Jul 22, 2026', time: '11:00 AM', status: 'Completed' },
  { id: 4, youth: 'Ama Serwaa', type: 'Crisis Support', date: 'Jul 18, 2026', time: '9:00 AM', status: 'Completed' },
]

const STATUS_STYLES = {
  Upcoming: 'bg-secondary-container text-on-secondary-container',
  Completed: 'bg-surface-container-highest text-on-surface-variant',
}

export default function CounselingSessions() {
  const [sessions] = useState(INITIAL_SESSIONS)

  return (
    <DashboardLayout role="counselor">
      <DashboardPageHeader
        title="Counseling Sessions"
        description="Upcoming and past sessions with your assigned youth."
        action={
          <button className="bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded-full flex items-center gap-2 hover:shadow-lg active:scale-95 transition-all w-fit">
            <Icon name="add" />
            Schedule Session
          </button>
        }
      />

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low border-b border-outline-variant/40 text-on-surface-variant font-label-md text-label-md">
              <tr>
                <th className="px-6 py-4">Youth</th>
                <th className="px-6 py-4">Session Type</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40">
              {sessions.map((s) => (
                <tr key={s.id} className="hover:bg-surface-container transition-colors">
                  <td className="px-6 py-4 font-label-md text-label-md text-on-surface">{s.youth}</td>
                  <td className="px-6 py-4 text-on-surface-variant">{s.type}</td>
                  <td className="px-6 py-4 text-on-surface-variant">{s.date}</td>
                  <td className="px-6 py-4 text-on-surface-variant">{s.time}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full font-label-sm text-label-sm ${STATUS_STYLES[s.status]}`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
