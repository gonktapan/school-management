import { useState, useEffect } from 'react'
import { Plus, Trash2, BookOpen } from 'lucide-react'
import Table from '../components/Table'
import Modal from '../components/Modal'
import { TableSkeleton } from '../components/Skeleton'
import { useToast } from '../components/Toast'
import { getSubjects, createSubject, deleteSubject } from '../api/subjects'

const empty = { name: '', code: '' }
const inputCls = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500'

export default function Subjects() {
  const { showToast } = useToast()
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    try {
      setSubjects((await getSubjects()) ?? [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleCreate(e) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      await createSubject(form)
      setShowModal(false)
      setForm(empty)
      showToast('เพิ่มวิชาสำเร็จ')
      load()
    } catch (err) {
      setError(err.response?.data?.error ?? 'เกิดข้อผิดพลาด')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('ลบวิชานี้?')) return
    try {
      await deleteSubject(id)
      showToast('ลบวิชาสำเร็จ')
      load()
    } catch {
      showToast('ลบไม่สำเร็จ', 'error')
    }
  }

  const columns = [
    { key: 'code', label: 'รหัสวิชา' },
    { key: 'name', label: 'ชื่อวิชา' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-800">วิชาเรียน</h1>
        </div>
        <button
          onClick={() => { setForm(empty); setError(''); setShowModal(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> เพิ่มวิชา
        </button>
      </div>

      {loading ? (
        <TableSkeleton rows={5} cols={2} />
      ) : (
        <Table
          columns={columns}
          data={subjects}
          actions={(row) => (
            <button
              onClick={() => handleDelete(row.id)}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        />
      )}

      {showModal && (
        <Modal title="เพิ่มวิชา" onClose={() => { setShowModal(false); setError('') }}>
          <form onSubmit={handleCreate} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">รหัสวิชา</label>
              <input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className={inputCls} placeholder="เช่น MATH" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อวิชา</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="เช่น คณิตศาสตร์" />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={saving} className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors">
              {saving ? 'กำลังบันทึก...' : 'บันทึก'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  )
}
