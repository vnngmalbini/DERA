import DashboardLayout from '../../components/layout/DashboardLayout'
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader'
import Icon from '../../components/ui/Icon'

// TODO(backend): replace with a real fetch, e.g. GET /api/donor/donations/
const DONATIONS = [
  { id: 1, fund: 'Girls in STEM Fund', amount: '₵2,000', date: 'Jul 20, 2026', status: 'Completed' },
  { id: 2, fund: 'Rural Coding Bootcamp', amount: '₵5,000', date: 'Jun 14, 2026', status: 'Completed' },
  { id: 3, fund: 'General Scholarship Fund', amount: '₵1,500', date: 'May 02, 2026', status: 'Completed' },
  { id: 4, fund: 'Northern Region School Kits', amount: '₵3,000', date: 'Mar 18, 2026', status: 'Completed' },
]

const STATUS_STYLES = {
  Completed: 'bg-secondary-container text-on-secondary-container',
  Pending: 'bg-surface-container-highest text-on-surface-variant',
}

export default function Donations() {
  return (
    <DashboardLayout role="donor">
      <DashboardPageHeader
        title="Donations"
        description="Your giving history and a quick way to make a new donation."
        action={
          <button className="bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded-full flex items-center gap-2 hover:shadow-lg active:scale-95 transition-all w-fit">
            <Icon name="volunteer_activism" />
            Make a Donation
          </button>
        }
      />

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low border-b border-outline-variant/40 text-on-surface-variant font-label-md text-label-md">
              <tr>
                <th className="px-6 py-4">Fund</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40">
              {DONATIONS.map((d) => (
                <tr key={d.id} className="hover:bg-surface-container transition-colors">
                  <td className="px-6 py-4 font-label-md text-label-md text-on-surface">{d.fund}</td>
                  <td className="px-6 py-4 font-bold text-primary">{d.amount}</td>
                  <td className="px-6 py-4 text-on-surface-variant">{d.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full font-label-sm text-label-sm ${STATUS_STYLES[d.status]}`}>
                      {d.status}
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
