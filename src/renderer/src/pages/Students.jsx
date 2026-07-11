import { useState, useEffect, useMemo } from 'react'
import { Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import Table from '../components/Table'
import Modal from '../components/Modal'
import { TableSkeleton } from '../components/Skeleton'
import { useToast } from '../components/Toast'
import { getStudents, createStudent, updateStudent, deleteStudent } from '../api/students'
import { getClasses } from '../api/classes'

const empty = { name: '', student_code: '', class_id: '', date_of_birth: '' }
const PAGE_SIZE = 10
const inputCls = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500'

export default function Students() {
  const { showToast } = useToast()
  const [students, setStudents] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(empty)
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  async function load() {
    setLoading(true)
    try {
      const [s, c] = await Promise.all([getStudents(), getClasses()])
      setStudents(s ?? [])
      setClasses(c ?? [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return q ? students.filter((s) => s.name.toLowerCase().includes(q) || s.student_code.toLowerCase().includes(q)) : students
  }, [students, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleSearch(v) { setSearch(v); setPage(1) }

  function openAdd() { setForm(empty); setEditId(null); setError(''); setModal('add') }
  function openEdit(row) {
    setForm({ name: row.name, student_code: row.student_code, class_id: row.class_id ?? '', date_of_birth: row.date_of_birth?.slice(0, 10) ?? '' })
    setEditId(row.id); setError(''); setModal('edit')
  }

  async function handleSubmit(e) {
    e.preventDefault(); setError('')
    try {
      if (modal === 'add') await createStudent(form)
      else await updateStudent(editId, form)
      setModal(null)
      showToast(modal === 'add' ? 'เพิ่มนักเรียนสำเร็จ' : 'แก้ไขสำเร็จ')
      load()
    } catch (err) {
      setError(err.response?.data?.error ?? 'เกิดข้อผิดพลาด')
    }
  }

  async function handleDelete(id) {
    if (!confirm('ลบนักเรียนนี้?')) return
    await deleteStudent(id)
    showToast('ลบนักเรียนสำเร็จ')
    load()
  }

  const classMap = Object.fromEntries(classes.map((c) => [c.id, c.name]))

  const columns = [
    { key: 'student_code', label: 'รหัส' },
    { key: 'name', label: 'ชื่อ' },
    { key: 'class_id', label: 'ชั้นเรียน', render: (r) => classMap[r.class_id] ?? '-' },
    { key: 'date_of_birth', label: 'วันเกิด', render: (r) => r.date_of_birth?.slice(0, 10) ?? '-' },
  ]

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex-1">นักเรียน</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="ค้นหาชื่อ / รหัส"
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48"
          />
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
          <Plus className="w-4 h-4" /> เพิ่มนักเรียน
        </button>
      </div>

      {loading ? <TableSkeleton rows={PAGE_SIZE} cols={4} /> : (
        <>
          <Table columns={columns} data={paginated} actions={(row) => (
            <div className="flex items-center justify-end gap-1">
              <button onClick={() => openEdit(row)} className="px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">แก้ไข</button>
              <button onClick={() => handleDelete(row.id)} className="px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors">ลบ</button>
            </div>
          )} />
          <Pagination page={page} total={filtered.length} totalPages={totalPages} onPage={setPage} />
        </>
      )}

      {modal && (
        <Modal title={modal === 'add' ? 'เพิ่มนักเรียน' : 'แก้ไขนักเรียน'} onClose={() => setModal(null)}>
          <form onSubmit={handleSubmit} className="space-y-3">
            <Field label="รหัสนักเรียน" value={form.student_code} onChange={(v) => setForm({ ...form, student_code: v })} required />
            <Field label="ชื่อ-นามสกุล" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ชั้นเรียน</label>
              <select value={form.class_id} onChange={(e) => setForm({ ...form, class_id: e.target.value })} className={inputCls}>
                <option value="">-- เลือกชั้นเรียน --</option>
                {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <Field label="วันเกิด" type="date" value={form.date_of_birth} onChange={(v) => setForm({ ...form, date_of_birth: v })} />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setModal(null)} className="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50">ยกเลิก</button>
              <button type="submit" className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">บันทึก</button>
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
      <input type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
    </div>
  )
}

function Pagination({ page, total, totalPages, onPage }) {
  if (total === 0) return null
  const from = (page - 1) * PAGE_SIZE + 1
  const to = Math.min(page * PAGE_SIZE, total)
  return (
    <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
      <span>แสดง {from}–{to} จาก {total} รายการ</span>
      <div className="flex gap-1">
        <button onClick={() => onPage(page - 1)} disabled={page === 1} className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={() => onPage(page + 1)} disabled={page === totalPages} className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
