import { useEffect, useMemo, useState } from 'react'
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader'
import Button from '../../components/ui/Button'
import Icon from '../../components/ui/Icon'
import { apiGet } from '../../services/apiClient'
import { predictDropoutRisk } from '../../services/dropoutRiskService'

const LEVELS = [
  { value: 'BASIC', label: 'Basic School' },
  { value: 'JHS', label: 'JHS' },
  { value: 'SHS', label: 'SHS' },
  { value: 'TERTIARY', label: 'Tertiary' },
]

const COMMON = [
  ['age', 'Age', 'number'], ['class_level', 'Class or level', 'text'],
  ['attendance_rate', 'Attendance rate (%)', 'number'], ['average_score', 'Average academic score', 'number'],
  ['previous_academic_performance', 'Previous academic performance', 'number'],
]

const FIELD_GROUPS = {
  BASIC: [
    { title: 'Student profile', fields: COMMON },
    { title: 'Learning and support', fields: [['days_absent', 'Days absent', 'number'], ['assignment_completion', 'Homework or assignment completion (%)', 'number'], ['parent_guardian_support', 'Parent or guardian support', 'choice', ['High', 'Medium', 'Low', 'None']], ['school_engagement', 'School engagement', 'choice', ['High', 'Medium', 'Low']]] },
    { title: 'Barriers and wellbeing', fields: [['financial_difficulty', 'Financial difficulty', 'boolean'], ['distance_transport_difficulty', 'Distance or transport difficulty', 'boolean'], ['repeated_class', 'Repeated class', 'boolean'], ['disciplinary_incidents', 'Disciplinary incidents', 'number']] },
  ],
  JHS: [
    { title: 'Student profile', fields: COMMON },
    { title: 'Learning and support', fields: [['failed_subjects', 'Failed subjects', 'number'], ['days_absent', 'Days absent', 'number'], ['assignment_completion', 'Assignment completion (%)', 'number'], ['parent_guardian_support', 'Parent or guardian support', 'choice', ['High', 'Medium', 'Low', 'None']], ['school_engagement', 'School engagement', 'choice', ['High', 'Medium', 'Low']], ['study_hours', 'Study hours per week', 'number']] },
    { title: 'Barriers and plans', fields: [['repeated_class', 'Repeated class', 'boolean'], ['financial_difficulty', 'Financial difficulty', 'boolean'], ['fee_difficulty', 'Fee difficulty', 'boolean'], ['distance_transport_difficulty', 'Distance or transport difficulty', 'boolean'], ['disciplinary_incidents', 'Disciplinary incidents', 'number'], ['intention_to_continue_education', 'Intention to continue education', 'choice', ['Yes', 'Unsure', 'No']]] },
  ],
  SHS: [
    { title: 'Student profile', fields: [...COMMON.slice(0, 1), ['class_level', 'SHS level', 'text'], ['programme', 'Programme', 'text'], ...COMMON.slice(2)] },
    { title: 'Learning and support', fields: [['failed_subjects', 'Failed subjects', 'number'], ['assignment_completion', 'Assignment completion (%)', 'number'], ['parent_guardian_support', 'Parent or guardian support', 'choice', ['High', 'Medium', 'Low', 'None']], ['school_engagement', 'School engagement', 'choice', ['High', 'Medium', 'Low']], ['study_hours', 'Study hours per week', 'number'], ['internet_access', 'Internet access', 'boolean'], ['device_access', 'Device access', 'boolean']] },
    { title: 'Barriers and plans', fields: [['repeated_class', 'Repeated class', 'boolean'], ['financial_difficulty', 'Financial difficulty', 'boolean'], ['fee_difficulty', 'Fee difficulty', 'boolean'], ['accommodation_difficulty', 'Accommodation difficulty', 'boolean'], ['transport_difficulty', 'Transport difficulty', 'boolean'], ['disciplinary_incidents', 'Disciplinary incidents', 'number'], ['intention_to_continue_education', 'Intention to continue education', 'choice', ['Yes', 'Unsure', 'No']]] },
  ],
  TERTIARY: [
    { title: 'Student profile', fields: [...COMMON.slice(0, 1), ['class_level', 'Level', 'text'], ['programme', 'Programme', 'text'], ['cwa_cgpa', 'Current CWA or CGPA', 'number'], ['previous_semester_cwa_cgpa', 'Previous semester CWA or CGPA', 'number'], ['attendance_rate', 'Attendance rate (%)', 'number']] },
    { title: 'Academic progress', fields: [['failed_courses', 'Failed courses', 'number'], ['repeated_courses', 'Repeated courses', 'number'], ['assignment_completion', 'Assignment completion (%)', 'number'], ['academic_probation', 'Academic probation', 'boolean'], ['school_engagement', 'School engagement', 'choice', ['High', 'Medium', 'Low']], ['study_hours', 'Study hours per week', 'number']] },
    { title: 'Life and continuation plans', fields: [['fee_difficulty', 'Fee difficulty', 'boolean'], ['financial_difficulty', 'Financial difficulty', 'boolean'], ['accommodation_difficulty', 'Accommodation difficulty', 'boolean'], ['employment_status', 'Employment status', 'choice', ['Not employed', 'Part-time', 'Full-time']], ['working_hours_per_week', 'Working hours per week', 'number'], ['internet_access', 'Internet access', 'boolean'], ['device_access', 'Device access', 'boolean'], ['intention_to_continue_education', 'Intention to continue education', 'choice', ['Yes', 'Unsure', 'No']]] },
  ],
}

function inputClasses() {
  return 'w-full rounded-lg border border-outline-variant bg-surface px-3 py-3 text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
}

function RiskResult({ result, onReset }) {
  const tone = result.risk_level === 'HIGH' ? 'text-error bg-error-container' : result.risk_level === 'MEDIUM' ? 'text-tertiary bg-tertiary-container' : 'text-secondary bg-secondary-container'
  return <section className="space-y-6">
    <div className="flex items-start justify-between gap-4">
      <div><p className="text-sm font-bold uppercase tracking-widest text-primary">Assessment complete</p><h2 className="font-headline-lg text-headline-lg text-on-surface">Dropout Risk Assessment</h2></div>
      <Button variant="outline" icon="restart_alt" onClick={onReset}>New assessment</Button>
    </div>
    <div className="grid gap-5 md:grid-cols-2">
      <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm"><p className="text-sm text-on-surface-variant">Risk score</p><p className="mt-2 text-5xl font-bold text-on-surface">{Math.round(Number(result.risk_probability) * 100)}%</p><div className="mt-4 h-3 overflow-hidden rounded-full bg-surface-container"><div className="h-full bg-primary" style={{ width: `${Number(result.risk_probability) * 100}%` }} /></div></div>
      <div className={`rounded-2xl p-6 ${tone}`}><p className="text-sm font-bold uppercase tracking-widest">Risk level</p><p className="mt-3 text-3xl font-bold">{result.risk_level} RISK</p><p className="mt-3 text-sm">The student is currently showing indicators associated with elevated dropout risk.</p></div>
    </div>
    <div className="grid gap-5 md:grid-cols-2">
      <div className="rounded-2xl bg-surface-container-low p-6"><h3 className="font-headline-md text-headline-md font-bold text-on-surface">Key risk factors</h3><ul className="mt-4 space-y-3">{result.risk_factors.map((factor) => <li key={factor} className="flex gap-2 text-on-surface-variant"><Icon name="warning" className="text-error" />{factor}</li>)}</ul></div>
      <div className="rounded-2xl bg-surface-container-low p-6"><h3 className="font-headline-md text-headline-md font-bold text-on-surface">Recommended support</h3><ul className="mt-4 space-y-3">{result.recommendations.map((item) => <li key={item} className="flex gap-2 text-on-surface-variant"><Icon name="check_circle" className="text-primary" />{item}</li>)}</ul></div>
    </div>
    <p className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4 text-sm text-on-surface-variant">{result.disclaimer}</p>
  </section>
}

export default function DropoutRiskAssessment() {
  const [roster, setRoster] = useState([])
  const [level, setLevel] = useState('')
  const [youthId, setYouthId] = useState('')
  const [step, setStep] = useState(0)
  const [values, setValues] = useState({})
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const groups = useMemo(() => FIELD_GROUPS[level] || [], [level])

  useEffect(() => { apiGet('/counselor-roster/').then(setRoster).catch(() => setError('Could not load assigned students.')) }, [])

  const update = (name, value) => setValues((current) => ({ ...current, [name]: value }))
  const chooseLevel = (value) => { setLevel(value); setValues({}); setStep(1); setError('') }
  const submit = async (event) => {
    event.preventDefault()
    if (!youthId) return setError('Select the student being assessed.')
    setLoading(true); setError('')
    try { setResult(await predictDropoutRisk({ youthId, educationLevel: level, data: values })) }
    catch (err) { setError(err.message || 'The assessment could not be generated.') }
    finally { setLoading(false) }
  }
  const reset = () => { setResult(null); setLevel(''); setValues({}); setStep(0); setError('') }

  return <>
    <DashboardPageHeader title="Dropout Risk Assessment" description="Use level-specific early-warning indicators to plan timely student support." />
    {result ? <RiskResult result={result} onReset={reset} /> : <form onSubmit={submit} className="space-y-6">
      <div className="flex items-center gap-2 text-sm font-bold text-on-surface-variant"><span className="rounded-full bg-primary px-3 py-1 text-on-primary">Step {step + 1} of 4</span><span>{step === 0 ? 'Choose educational level' : 'Complete the student profile'}</span></div>
      {error && <p className="rounded-lg bg-error-container p-3 text-error">{error}</p>}
      {step === 0 && <section className="grid gap-4 sm:grid-cols-2">{LEVELS.map((item) => <button type="button" key={item.value} onClick={() => chooseLevel(item.value)} className="rounded-2xl border-2 border-outline-variant bg-surface-container-lowest p-6 text-left transition hover:border-primary hover:shadow-md"><span className="text-2xl font-bold text-on-surface">{item.label}</span><span className="mt-2 block text-sm text-on-surface-variant">Tailored early-warning questions</span></button>)}</section>}
      {step > 0 && <>
        <section className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm"><label className="block font-bold text-on-surface" htmlFor="student">Student being assessed</label><select id="student" value={youthId} onChange={(event) => setYouthId(event.target.value)} className={`${inputClasses()} mt-2`}><option value="">Select an assigned student</option>{roster.map((student) => <option key={student.id} value={student.id}>{student.full_name}</option>)}</select></section>
        <section className="grid gap-6 rounded-2xl bg-surface-container-lowest p-5 shadow-sm md:grid-cols-2">{groups[step - 1]?.fields.map(([name, label, type, options]) => <label key={name} className="space-y-2 text-sm font-bold text-on-surface">{label}<span className="text-error"> *</span>{type === 'boolean' ? <select value={values[name] ?? ''} onChange={(event) => update(name, event.target.value === 'true')} className={inputClasses()}><option value="">Select yes or no</option><option value="true">Yes</option><option value="false">No</option></select> : type === 'choice' ? <select value={values[name] || ''} onChange={(event) => update(name, event.target.value)} className={inputClasses()}><option value="">Select an option</option>{options.map((option) => <option key={option}>{option}</option>)}</select> : <input required value={values[name] ?? ''} onChange={(event) => update(name, event.target.value)} type={type} className={inputClasses()} />}</label>)}</section>
        <div className="flex justify-between gap-3">{step > 1 ? <Button type="button" variant="outline" icon="arrow_back" iconPosition="left" onClick={() => setStep(step - 1)}>Back</Button> : <Button type="button" variant="outline" icon="arrow_back" iconPosition="left" onClick={() => setStep(0)}>Change level</Button>}{step < 3 ? <Button type="button" icon="arrow_forward" onClick={() => setStep(step + 1)}>Continue</Button> : <Button type="submit" icon={loading ? 'progress_activity' : 'assessment'} disabled={loading}>{loading ? 'Generating...' : 'Generate assessment'}</Button>}</div>
      </>}
    </form>}
  </>
}