import { useState, useEffect, useMemo } from 'react'
import { Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import Table from '../components/Table'
import Modal from '../components/Modal'
import { TableSkeleton } from '../components/Skeleton'
import { useToast } from '../components/Toast'
import { getTeachers, createTeacher, updateTeacher, deleteTeacher } from '../api/teachers'

const empty = { name: '', employee_code: '', email: '', password: '' }
const PAGE_SIZE = 10

export default function Teachers() {
  const { showToast } = useToast()
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(empty)
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  async function load() {
    setLoading(true)
    try { setTeachers((await getTeachers()) ?? []) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return q ? teachers.filter((t) => t.name.toLowerCase().includes(q) || t.employee_code.toLowerCase().includes(q)) : teachers
  }, [teachers, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleSearch(v) { setSearch(v); setPage(1) }
  function openAdd() { setForm(empty); setEditId(null); setError(''); setModal('add') }
  function openEdit(row) {
    setForm({ name: row.name, employee_code: row.employee_code, email: '', password: '' })
    setEditId(row.id); setError(''); setModal('edit')
  }

  async function handleSubmit(e) {
    e.preventDefault(); setError('')
    try {
      if (modal === 'add') await createTeacher(form)
      else await updateTeacher(editId, { name: form.name, employee_code: form.employee_code })
      setModal(null)
      showToast(modal === 'add' ? 'เพิ่มครูสำเร็จ' : 'แก้ไขสำเร็จ')
      load()
    } catch (err) {
      setError(err.response?.data?.error ?? 'เกิดข้อผิดพลาด')
    }
  }

  async function handleDelete(id) {
    if (!confirm('ลบครูนี้?')) return
    await deleteTeacher(id)
    showToast('ลบครูสำเร็จ')
    load()
  }

  const columns = [
    { key: 'employee_code', label: 'รหัสครู' },
    { key: 'name', label: 'ชื่อ-นามสกุล' },
  ]

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex-1">ครู</h1>
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
          <Plus className="w-4 h-4" /> เพิ่มครู
        </button>
      </div>

      {loading ? <TableSkeleton rows={PAGE_SIZE} cols={2} /> : (
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
        <Modal title={modal === 'add' ? 'เพิ่มครู' : 'แก้ไขครู'} onClose={() => setModal(null)}>
          <form onSubmit={handleSubmit} className="space-y-3">
            <Field label="รหัสครู" value={form.employee_code} onChange={(v) => setForm({ ...form, employee_code: v })} required />
            <Field label="ชื่อ-นามสกุล" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
            {modal === 'add' && (
              <>
                <Field label="อีเมล" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
                <Field label="รหัสผ่าน" type="password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} required />
              </>
            )}
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
