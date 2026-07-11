import { useState, useEffect } from 'react'
import Table from '../components/Table'
import Modal from '../components/Modal'
import { getStudents } from '../api/students'
import { getGradesByStudent, createGrade, deleteGrade } from '../api/grades'
import client from '../api/client'

const empty = { subject_id: '', score: '', term: '', academic_year: new Date().getFullYear() }

export default function Grades() {
  const [students, setStudents] = useState([])
  const [subjects, setSubjects] = useState([])
  const [selectedStudent, setSelectedStudent] = useState('')
  const [grades, setGrades] = useState([])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(empty)
  const [error, setError] = useState('')

  useEffect(() => {
    getStudents().then((d) => setStudents(d ?? []))
    client.get('/subjects').then((r) => setSubjects(r.data.data ?? []))
  }, [])

  useEffect(() => {
    if (!selectedStudent) { setGrades([]); return }
    getGradesByStudent(selectedStudent).then((d) => setGrades(d ?? []))
  }, [selectedStudent])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await createGrade({
        student_id: selectedStudent,
        subject_id: form.subject_id,
        score: Number(form.score),
        term: form.term,
        academic_year: Number(form.academic_year),
      })
      setModal(false)
      getGradesByStudent(selectedStudent).then((d) => setGrades(d ?? []))
    } catch (err) {
      setError(err.response?.data?.error ?? 'เกิดข้อผิดพลาด')
    }
  }

  async function handleDelete(id) {
    if (!confirm('ลบเกรดนี้?')) return
    await deleteGrade(id)
    getGradesByStudent(selectedStudent).then((d) => setGrades(d ?? []))
  }

  const subjectMap = Object.fromEntries(subjects.map((s) => [s.id, s.name]))

  const columns = [
    { key: 'subject_id', label: 'วิชา', render: (r) => subjectMap[r.subject_id] ?? r.subject_id },
    { key: 'score', label: 'คะแนน' },
    { key: 'term', label: 'ภาคเรียน' },
    { key: 'academic_year', label: 'ปีการศึกษา' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">เกรด</h1>
        {selectedStudent && (
          <button
            onClick={() => { setForm(empty); setError(''); setModal(true) }}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            + เพิ่มเกรด
          </button>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">เลือกนักเรียน</label>
        <select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- เลือกนักเรียน --</option>
          {students.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.student_code})</option>)}
        </select>
      </div>

      {selectedStudent && (
        <Table
          columns={columns}
          data={grades}
          actions={(row) => (
            <button onClick={() => handleDelete(row.id)} className="text-red-600 hover:underline text-sm">ลบ</button>
          )}
        />
      )}

      {modal && (
        <Modal title="เพิ่มเกรด" onClose={() => setModal(false)}>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">วิชา</label>
              <select
                required
                value={form.subject_id}
                onChange={(e) => setForm({ ...form, subject_id: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- เลือกวิชา --</option>
                {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <Field label="คะแนน (0-100)" type="number" value={form.score} onChange={(v) => setForm({ ...form, score: v })} required />
            <Field label="ภาคเรียน" value={form.term} onChange={(v) => setForm({ ...form, term: v })} required />
            <Field label="ปีการศึกษา" type="number" value={form.academic_year} onChange={(v) => setForm({ ...form, academic_year: v })} required />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setModal(false)} className="px-4 py-2 text-sm border rounded hover:bg-gray-50">ยกเลิก</button>
              <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">บันทึก</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', required }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}
