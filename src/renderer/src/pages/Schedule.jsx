import { useState, useEffect } from 'react'
import { Plus, Trash2, CalendarDays } from 'lucide-react'
import { getClasses } from '../api/classes'
import { getTeachers } from '../api/teachers'
import { getSubjects } from '../api/subjects'
import { getScheduleByClass, createSchedule, deleteSchedule } from '../api/schedule'
import Modal from '../components/Modal'

const DAYS = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์']
const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8]

const empty = { teacher_id: '', subject_id: '', day_of_week: '1', period: '1' }

export default function Schedule() {
  const [classes, setClasses]       = useState([])
  const [teachers, setTeachers]     = useState([])
  const [subjects, setSubjects]     = useState([])
  const [selectedClass, setSelectedClass] = useState('')
  const [schedules, setSchedules]   = useState([])
  const [showModal, setShowModal]   = useState(false)
  const [form, setForm]             = useState(empty)
  const [saving, setSaving]         = useState(false)
  const [error, setError]           = useState('')

  useEffect(() => {
    getClasses().then((d) => setClasses(d ?? []))
    getTeachers().then((d) => setTeachers(d ?? []))
    getSubjects().then((d) => setSubjects(d ?? []))
  }, [])

  useEffect(() => {
    if (!selectedClass) { setSchedules([]); return }
    getScheduleByClass(selectedClass).then((d) => setSchedules(d ?? []))
  }, [selectedClass])

  function reload() {
    if (selectedClass) getScheduleByClass(selectedClass).then((d) => setSchedules(d ?? []))
  }

  async function handleCreate(e) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      await createSchedule({
        class_id:    selectedClass,
        teacher_id:  form.teacher_id,
        subject_id:  form.subject_id,
        day_of_week: parseInt(form.day_of_week),
        period:      parseInt(form.period),
      })
      setShowModal(false)
      setForm(empty)
      reload()
    } catch (err) {
      setError(err.response?.data?.error ?? 'เกิดข้อผิดพลาด')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    await deleteSchedule(id)
    reload()
  }

  const grid = {}
  schedules.forEach((s) => { grid[`${s.day_of_week}-${s.period}`] = s })

  const inputCls = 'w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500'

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex-1">ตารางเรียน</h1>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">-- เลือกชั้นเรียน --</option>
          {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        {selectedClass && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> เพิ่มคาบเรียน
          </button>
        )}
      </div>

      {selectedClass && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-100 px-4 py-3 font-semibold text-gray-500 w-16 text-center">คาบ</th>
                {DAYS.map((d) => (
                  <th key={d} className="border border-gray-100 px-4 py-3 font-semibold text-gray-500 text-center min-w-[110px]">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERIODS.map((period) => (
                <tr key={period}>
                  <td className="border border-gray-100 px-4 py-3 text-center font-semibold text-gray-400 bg-gray-50">{period}</td>
                  {DAYS.map((_, dayIdx) => {
                    const entry = grid[`${dayIdx + 1}-${period}`]
                    return (
                      <td key={dayIdx} className="border border-gray-100 px-3 py-2 text-center">
                        {entry ? (
                          <div className="group relative">
                            <div className="bg-indigo-50 rounded-lg px-2 py-1.5">
                              <div className="font-medium text-indigo-800 text-xs">{entry.subject_name ?? entry.subject_id}</div>
                              <div className="text-indigo-400 text-xs mt-0.5">{entry.teacher_name ?? ''}</div>
                            </div>
                            <button
                              onClick={() => handleDelete(entry.id)}
                              className="absolute -top-1 -right-1 hidden group-hover:flex w-5 h-5 bg-red-500 text-white rounded-full items-center justify-center"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-200">—</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!selectedClass && (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <CalendarDays className="w-10 h-10 mb-3 text-gray-300" />
          <p className="text-sm">เลือกชั้นเรียนเพื่อดูตารางเรียน</p>
        </div>
      )}

      {showModal && (
        <Modal title="เพิ่มคาบเรียน" onClose={() => { setShowModal(false); setError('') }}>
          <form onSubmit={handleCreate} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ครูผู้สอน</label>
              <select required value={form.teacher_id} onChange={(e) => setForm({ ...form, teacher_id: e.target.value })} className={inputCls}>
                <option value="">-- เลือกครู --</option>
                {teachers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">วิชา</label>
              <select required value={form.subject_id} onChange={(e) => setForm({ ...form, subject_id: e.target.value })} className={inputCls}>
                <option value="">-- เลือกวิชา --</option>
                {subjects.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">วัน</label>
                <select value={form.day_of_week} onChange={(e) => setForm({ ...form, day_of_week: e.target.value })} className={inputCls}>
                  {DAYS.map((d, i) => <option key={i + 1} value={i + 1}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">คาบ</label>
                <select value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} className={inputCls}>
                  {PERIODS.map((p) => <option key={p} value={p}>คาบ {p}</option>)}
                </select>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors mt-1"
            >
              {saving ? 'กำลังบันทึก...' : 'บันทึก'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  )
}
