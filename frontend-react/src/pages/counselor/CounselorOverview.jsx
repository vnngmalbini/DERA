import { useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Icon from '../../components/ui/Icon'
import { useAuth } from '../../context/AuthContext'

const ALERTS = [
  {
    id: 101,
    name: 'Kojo Antwi',
    note: 'Missed 3 consecutive days',
    actionLabel: 'Take Action',
    borderClass: 'border-error',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcpAhOFzQbtHLJ8G-CRW5nPBbE5pW3qIPGbctQh-dGaKZfPlDecNE2CE38dFTTcYcgvjrGQmwPVhC6nHVownZ81SaqFtVy2btjigj5NWSO9KSjzhCJyYKuRa4HzHT-mfHNYv5bmDpbdHfEMFWjsf3x_CyvuOa_GihpEKldEnxxznwt5XqIJBGzerZrWTaH0A7DvC9kNFw2N9VxcYMfGgsmEKE1lHNhBYVH0viPSEl1k_oRGYgSH12u',
    alt: 'Close up portrait of a young Ghanaian male student with a pensive expression, wearing a bright yellow school uniform.',
  },
  {
    id: 102,
    name: 'Abena Mansa',
    note: 'Sudden drop in Math scores',
    actionLabel: 'Review Progress',
    borderClass: 'border-error',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVcSecatl0Ban3NbcDpiw30XDx3iA96DEooS9SylLIliwA4ggiqkiLHckmWxluLIKcm-kzt1CgW5jzctxz1eAfuUVxI7nF1mJDTTMkp71KHyzqmKmmbHleiTtR4zr5_UVhjZN57utuk0ut9oMIaP8VaUl0txhIhYtbXqCBpj6eyvkq-Ij1KC6skswUr_PN6axyAAjMtzoIYBqtDmrzy4mhhPliIPp2Y6N6SAQGXySrujOmxgqBIfmg',
    alt: 'Portrait of a young Ghanaian girl with braided hair, looking down with a serious expression, wearing a checkered school uniform.',
  },
  {
    id: 103,
    name: 'Ekow Mensah',
    note: 'Successful intervention check-in',
    actionLabel: 'View History',
    borderClass: 'border-surface-tint',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCC5T2vv5L2f9-snsO3PfqudoHG_TvYERJSNwvF77_DYNzkB_i12lCmbwBQjE484Y3GLB4PNhJVIn1jGUMPI8KpFG5kWyxgOGiZUObGdVfpkjQI-wS74YME0YNCQmsi1ImMO8_mtaT0BkwaDf8tmoz8RCaTbgEeTTpP8b3rSA007DZhMItY7J0XFXq_PRdcxaswhSp0vYJ__Fxm9MHXKm0eLJoWf06oDx-h24ulMSjNgbDhXQhdi52X',
    alt: 'Portrait of a focused Ghanaian schoolboy in a blue shirt, holding a pencil, sitting in a sun-drenched rural schoolroom.',
  },
]

const ROSTER_PREVIEW = [
  { id: 201, name: 'Ama Serwaa', status: 'Critical', attendance: '68%', lastActive: '2h ago' },
  { id: 202, name: 'Kwesi Arthur', status: 'Warning', attendance: '82%', lastActive: '5h ago' },
  { id: 203, name: 'Yaa Pono', status: 'On Track', attendance: '98%', lastActive: 'Just now' },
  { id: 204, name: 'Kofi Kinaata', status: 'On Track', attendance: '95%', lastActive: '1d ago' },
]

const STATUS_STYLES = {
  Critical: 'bg-error-container text-on-error-container',
  Warning: 'bg-surface-variant text-on-surface-variant',
  'On Track': 'bg-secondary-container text-on-secondary-container',
}

function StatusBadge({ status }) {
  return (
    <span className={`${STATUS_STYLES[status]} px-3 py-1 rounded-full text-xs font-bold uppercase`}>{status}</span>
  )
}

export default function CounselorOverview() {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const firstName = (user?.fullName || 'there').split(' ')[0]

  const filteredRoster = ROSTER_PREVIEW.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <DashboardLayout role="counselor">
      <section className="mb-xl">
        <h2 className="font-headline-lg text-headline-lg text-primary mb-2">Akwaaba, {firstName}</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Here is a summary of student performance and alerts for today.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-xl">
        <div className="bg-surface-container p-md rounded-xl border border-outline-variant/10 shadow-sm flex flex-col justify-between transition-shadow hover:shadow-md">
          <div>
            <Icon name="warning" className="text-error text-3xl mb-md block" />
            <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
              At Risk Students
            </h3>
          </div>
          <div className="flex items-end gap-3 mt-md">
            <span className="text-5xl font-bold text-on-surface">12</span>
            <span className="text-error font-bold mb-1 font-label-md text-label-md">+2 this week</span>
          </div>
        </div>

        <div className="bg-primary-container text-on-primary-container p-md rounded-xl shadow-sm flex flex-col justify-between transition-shadow hover:shadow-md">
          <div>
            <Icon name="calendar_month" className="text-3xl mb-md block" />
            <h3 className="font-label-md text-label-md uppercase tracking-wider opacity-90">Attendance Rate</h3>
          </div>
          <div className="mt-md">
            <span className="text-5xl font-bold">94.2%</span>
            <div className="w-full bg-on-primary-container/20 h-2 rounded-full mt-3 overflow-hidden">
              <div className="bg-on-primary-container h-full rounded-full" style={{ width: '94.2%' }} />
            </div>
          </div>
        </div>

        <div className="bg-surface-container-high p-md rounded-xl border border-outline-variant/10 shadow-sm flex flex-col justify-between transition-shadow hover:shadow-md">
          <div>
            <Icon name="history_edu" className="text-tertiary text-3xl mb-md block" />
            <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
              Recent Interventions
            </h3>
          </div>
          <div className="flex items-end gap-3 mt-md">
            <span className="text-5xl font-bold text-on-surface">45</span>
            <span className="text-primary font-bold mb-1 font-label-md text-label-md">↑ 12%</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-4 flex flex-col gap-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Priority Alerts</h3>
            <span className="bg-error text-on-error text-xs font-bold px-2 py-1 rounded-full">3 NEW</span>
          </div>

          {ALERTS.map((alert) => (
            <div
              key={alert.id}
              className={`bg-white p-4 rounded-xl border-l-4 ${alert.borderClass} shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <img className="w-full h-full object-cover" alt={alert.alt} src={alert.img} />
                </div>
                <div>
                  <h4 className="font-bold text-on-surface">{alert.name}</h4>
                  <p className="text-sm text-on-surface-variant">{alert.note}</p>
                  <Link
                    to={`/dashboard/counselor/youth/${alert.id}`}
                    className="mt-3 text-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all w-fit"
                  >
                    {alert.actionLabel}
                    <Icon name="chevron_right" className="text-sm" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="lg:col-span-8">
          <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/20 overflow-hidden h-full flex flex-col">
            <div className="p-md border-b border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-4">
              <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Student Roster</h3>
              <div className="relative w-full md:w-72">
                <Icon
                  name="search"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-full text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="Search students..."
                  type="text"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-lowest border-b border-outline-variant/10 text-on-surface-variant font-label-md text-label-md">
                  <tr>
                    <th className="px-6 py-4">Student Name</th>
                    <th className="px-6 py-4">Current Status</th>
                    <th className="px-6 py-4">Attendance</th>
                    <th className="px-6 py-4">Last Active</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {filteredRoster.map((s) => (
                    <tr key={s.id} className="hover:bg-surface-variant/10 transition-colors">
                      <td className="px-6 py-4 font-bold text-on-surface">{s.name}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={s.status} />
                      </td>
                      <td className="px-6 py-4 text-on-surface-variant">{s.attendance}</td>
                      <td className="px-6 py-4 text-on-surface-variant">{s.lastActive}</td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/dashboard/counselor/youth/${s.id}`}
                          aria-label={`View ${s.name}`}
                          className="inline-flex text-on-surface-variant hover:text-primary transition-colors"
                        >
                          <Icon name="chevron_right" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {filteredRoster.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-on-surface-variant">
                        No students match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-surface-container-lowest flex justify-center border-t border-outline-variant/10 mt-auto">
              <Link
                to="/dashboard/counselor/youth"
                className="text-primary font-bold hover:underline flex items-center gap-2"
              >
                View Full Roster
                <Icon name="arrow_forward" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}
