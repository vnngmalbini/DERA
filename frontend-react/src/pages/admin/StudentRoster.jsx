import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import Icon from '../../components/ui/Icon'

const STUDENTS = [
  {
    id: 1,
    name: 'Abena Sarfo',
    studentId: 'DERA-2024-042',
    grade: 'jhs2',
    risk: 'low',
    assessmentScore: '88%',
    assessmentSubject: 'Mathematics',
    attendance: 96,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCU_oYR4kerZGaXf8kMa8dnsvNL1QK4Jb-r-fDhZOCCUMv8xoxdkviiNshcvoNXd-4IPCM2IKlIpesDkjfZREVPUE2d4XuY0Wi2pXebhfdFkRdGD44dbrAAlvOgEyl7A0EwisFpZDHRY5F6-E42TVBU03MfJkDPQaabGANtPxgNKc-uIqTAQ_EM28SM63Bqa2rnVRIGdNAS8NSC6sK_bfACtv3NCyTJFMvXhIsAVcC2jqQNIwhzQz6x',
    alt: 'A close-up portrait of a young Ghanaian male student with a bright, curious expression, wearing a school uniform.',
  },
  {
    id: 2,
    name: 'Kofi Osei',
    studentId: 'DERA-2024-019',
    grade: 'jhs1',
    risk: 'high',
    assessmentScore: '42%',
    assessmentSubject: 'English Lit.',
    attendance: 65,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2QzDAlHGChHWFTgq0dRztv4qQFHcOSm_xepmvGBU_q86jc3EkXJekcIm7gLxKd12d_aSj5Y0-ewtsCId5gxkZMr2ib8iM7qXzhvkQqhWlcrmLfgb2Ql_bYfXBup9EMB5j5efzg8DR8omIck22WLvJoKao7pW-Wp91EG7U9fo0n46a0m5t7YX33r6f2Sd0GcPR4j79S9PLIiTgGM800v51qwvBlJPB_-m9I8YZuGpBzJuCAtJnMQAL',
    alt: 'A portrait of a focused Ghanaian female student studying in a modern classroom setting.',
  },
  {
    id: 3,
    name: 'Ekow Mensah',
    studentId: 'DERA-2024-055',
    grade: 'jhs3',
    risk: 'moderate',
    assessmentScore: '68%',
    assessmentSubject: 'Social Studies',
    attendance: 82,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcAAjrC8AkCfsG-Fffx726TiIL2-LgUtWdLzeTUP9vqa3Fj6Li6y_ctIE8HFf54dGeRfBU0bsCEDTg7ZFfbX8ZSTpwLDuIqHU0NwnPr8_HtcWIC22vVAIo_cF4jE962Z1SqpNVeCGSdDcyhYnDfR9TqECvCNeiClVZHiRzJ72dioRoqV4sQhN5ypVrLXLlm7rRDadWvG2lrk4_fYMXVnZog4xODqQ1bmduOt-DvOWXCSiy2VM0LbdS',
    alt: 'A portrait of a thoughtful young male student in a Ghanaian secondary school.',
  },
  {
    id: 4,
    name: 'Ama Serwaa',
    studentId: 'DERA-2024-011',
    grade: 'jhs2',
    risk: 'high',
    assessmentScore: '58%',
    assessmentSubject: 'Integrated Science',
    attendance: 68,
  },
  {
    id: 5,
    name: 'Kwesi Arthur',
    studentId: 'DERA-2024-027',
    grade: 'jhs1',
    risk: 'moderate',
    assessmentScore: '71%',
    assessmentSubject: 'Social Studies',
    attendance: 82,
  },
  {
    id: 6,
    name: 'Yaa Pono',
    studentId: 'DERA-2024-033',
    grade: 'jhs3',
    risk: 'low',
    assessmentScore: '91%',
    assessmentSubject: 'Mathematics',
    attendance: 98,
  },
  {
    id: 7,
    name: 'Kofi Kinaata',
    studentId: 'DERA-2024-008',
    grade: 'jhs2',
    risk: 'low',
    assessmentScore: '89%',
    assessmentSubject: 'English Lit.',
    attendance: 95,
  },
]

const RISK_STYLES = {
  low: { badge: 'bg-secondary-container text-on-secondary-container', dot: 'bg-primary', label: 'Low Risk' },
  high: { badge: 'bg-error-container text-on-error-container', dot: 'bg-error', label: 'High Risk' },
  moderate: {
    badge: 'bg-surface-container-highest text-on-surface-variant',
    dot: 'bg-outline',
    label: 'Moderate Risk',
  },
}

const SCORE_CLASS = {
  low: 'text-primary',
  moderate: 'text-on-surface',
  high: 'text-error',
}

const BAR_CLASS = {
  low: 'bg-primary',
  moderate: 'bg-primary-container',
  high: 'bg-error',
}

function RiskBadge({ risk }) {
  const style = RISK_STYLES[risk]
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-label-sm text-label-sm ${style.badge}`}
    >
      <span className={`w-2 h-2 rounded-full ${style.dot}`} />
      {style.label}
    </span>
  )
}

function Avatar({ name, img, alt }) {
  if (img) {
    return (
      <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center overflow-hidden flex-shrink-0">
        <img className="w-full h-full object-cover" src={img} alt={alt} />
      </div>
    )
  }
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
  return (
    <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center flex-shrink-0 text-on-primary-container font-label-md text-label-md">
      {initials}
    </div>
  )
}

export default function StudentRoster() {
  const [search, setSearch] = useState('')
  const [riskFilter, setRiskFilter] = useState('')
  const [gradeFilter, setGradeFilter] = useState('')

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase()
    return STUDENTS.filter((s) => {
      const matchesSearch =
        !query || s.name.toLowerCase().includes(query) || s.studentId.toLowerCase().includes(query)
      const matchesRisk = !riskFilter || s.risk === riskFilter
      const matchesGrade = !gradeFilter || s.grade === gradeFilter
      return matchesSearch && matchesRisk && matchesGrade
    })
  }, [search, riskFilter, gradeFilter])

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-xl">
        <div>
          <nav className="flex items-center gap-2 text-on-surface-variant mb-2">
            <span className="font-label-sm text-label-sm">Classroom</span>
            <Icon name="chevron_right" className="text-sm" />
            <span className="font-label-sm text-label-sm text-primary font-bold">Student Roster</span>
          </nav>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">Student Roster</h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            Monitor academic performance, attendance, and risk factors for the 2024 academic year. Growth begins with
            observation.
          </p>
        </div>
        <button className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md px-6 py-3 rounded-full flex items-center gap-2 transition-all active:scale-95 shadow-sm w-fit">
          <Icon name="person_add" />
          Enroll New Student
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-lg">
        <div className="md:col-span-5 relative group">
          <Icon
            name="search"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors group-focus-within:text-primary"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-outline-variant rounded-xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-body-md"
            placeholder="Search students by name or ID..."
            type="text"
          />
        </div>
        <div className="md:col-span-3">
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="w-full bg-white border border-outline-variant rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-body-md appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%23727a69%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-[right_1rem_center] bg-no-repeat"
          >
            <option value="">Risk Level: All</option>
            <option value="high">High Risk</option>
            <option value="moderate">Moderate Risk</option>
            <option value="low">Stable / Low Risk</option>
          </select>
        </div>
        <div className="md:col-span-3">
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="w-full bg-white border border-outline-variant rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-body-md appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%23727a69%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-[right_1rem_center] bg-no-repeat"
          >
            <option value="">Grade Level: All</option>
            <option value="jhs1">JHS 1</option>
            <option value="jhs2">JHS 2</option>
            <option value="jhs3">JHS 3</option>
          </select>
        </div>
        <div className="md:col-span-1 flex items-center justify-center">
          <button
            title="More filters"
            className="w-full h-full bg-surface-container-high rounded-xl flex items-center justify-center hover:bg-surface-variant transition-colors group"
          >
            <Icon name="tune" className="text-on-surface-variant group-hover:text-primary" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden border border-outline-variant shadow-sm mb-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-6 py-5 font-label-md text-label-md text-on-surface-variant">Student Name</th>
                <th className="px-6 py-5 font-label-md text-label-md text-on-surface-variant">Risk Level</th>
                <th className="px-6 py-5 font-label-md text-label-md text-on-surface-variant text-center">
                  Last Assessment
                </th>
                <th className="px-6 py-5 font-label-md text-label-md text-on-surface-variant text-center">
                  Attendance
                </th>
                <th className="px-6 py-5 font-label-md text-label-md text-on-surface-variant text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-surface-bright transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <Avatar name={s.name} img={s.img} alt={s.alt} />
                      <div>
                        <p className="font-label-md text-label-md text-on-surface">{s.name}</p>
                        <p className="text-xs text-on-surface-variant">ID: {s.studentId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <RiskBadge risk={s.risk} />
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col items-center">
                      <span className={`font-label-md text-label-md font-bold ${SCORE_CLASS[s.risk]}`}>
                        {s.assessmentScore}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-on-surface-variant">
                        {s.assessmentSubject}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col items-center">
                      <span className="font-label-md text-label-md text-on-surface">{s.attendance}%</span>
                      <div className="w-20 h-1 bg-surface-container-high rounded-full mt-1 overflow-hidden">
                        <div className={`h-full ${BAR_CLASS[s.risk]}`} style={{ width: `${s.attendance}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <Link
                      to={`/admin/students/${s.id}`}
                      className="inline-block text-primary hover:bg-primary-container hover:text-on-primary-container px-4 py-2 rounded-lg font-label-md text-label-md transition-all active:scale-95"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-on-surface-variant">
                    No students match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 flex items-center justify-between border-t border-outline-variant bg-surface-container-low">
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            Showing 1 to {filteredStudents.length} of 42 students
          </span>
          <div className="flex gap-2">
            <button disabled className="p-2 rounded-lg border border-outline-variant opacity-50 cursor-not-allowed">
              <Icon name="chevron_left" />
            </button>
            <button disabled className="p-2 rounded-lg border border-outline-variant opacity-50 cursor-not-allowed">
              <Icon name="chevron_right" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white/70 backdrop-blur-md border border-outline/10 p-6 rounded-3xl relative overflow-hidden">
          <span className="text-primary mb-4 p-3 bg-secondary-container rounded-2xl inline-block">
            <Icon name="analytics" />
          </span>
          <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Class Health</h3>
          <p className="font-body-md text-body-md text-on-surface-variant mb-4">
            Current aggregate performance is 74%, a 3% increase since last month.
          </p>
          <div className="flex items-center gap-2 text-primary font-bold">
            <Icon name="trending_up" />
            <span>On Track for Goals</span>
          </div>
        </div>

        <div className="bg-primary text-on-primary p-6 rounded-3xl relative overflow-hidden shadow-xl">
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary-container/20 rounded-full blur-3xl" />
          <div className="relative z-10">
            <span className="text-primary-fixed mb-4 p-3 bg-on-primary/10 rounded-2xl inline-block">
              <Icon name="priority_high" />
            </span>
            <h3 className="font-headline-md text-headline-md mb-2">High Risk Alert</h3>
            <p className="text-primary-fixed/90 font-body-md text-body-md mb-4">
              4 students have attendance below 70% this week. Immediate intervention recommended.
            </p>
            <button className="bg-white text-primary px-4 py-2 rounded-full font-label-md text-label-md hover:bg-primary-container transition-colors">
              Generate Alerts
            </button>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-md border border-outline/10 p-6 rounded-3xl flex flex-col justify-between">
          <div>
            <h3 className="font-label-md text-label-md text-on-surface-variant mb-4 uppercase tracking-widest">
              Upcoming Assessments
            </h3>
            <div className="flex items-center gap-4">
              <div className="bg-tertiary-container text-on-tertiary-container text-xs font-bold w-12 h-12 rounded-xl flex flex-col items-center justify-center">
                <span>24</span>
                <span className="uppercase">Oct</span>
              </div>
              <div>
                <p className="font-label-md text-label-md text-on-surface">End Term Exam</p>
                <p className="text-xs text-on-surface-variant">General Science</p>
              </div>
            </div>
          </div>
          <button className="mt-6 border border-outline text-on-surface px-4 py-2 rounded-full font-label-md text-label-md hover:bg-surface-container-high transition-colors text-center">
            View Calendar
          </button>
        </div>
      </div>
    </AdminLayout>
  )
}
