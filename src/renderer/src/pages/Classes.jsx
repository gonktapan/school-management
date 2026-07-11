import { useState, useEffect } from 'react'
import Table from '../components/Table'
import Modal from '../components/Modal'
import { getClasses, createClass, updateClass, deleteClass } from '../api/classes'

const empty = { name: '', grade_level: '', academic_year: new Date().getFullYear() }

export default function Classes() {
  const [classes, setClasses] = useState([])
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(empty)
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')

  async function load() {
    const data = await getClasses()
    setClasses(data ?? [])
  }

  useEffect(() => { load() }, [])

  function openAdd() { setForm(empty); setEditId(null); setError(''); setModal('add') }
  function openEdit(row) {
    setForm({ name: row.name, grade_level: row.grade_level, academic_year: row.academic_year })
    setEditId(row.id)
    setError('')
    setModal('edit')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const payload = { ...form, grade_level: Number(form.grade_level), academic_year: Number(form.academic_year) }
      if (modal === 'add') await createClass(payload)
      else await updateClass(editId, payload)
      setModal(null)
      load()
    } catch (err) {
      setError(err.response?.data?.error ?? 'เกิดข้อผิดพลาด')
    }
  }

  async function handleDelete(id) {
    if (!confirm('ลบชั้นเรียนนี้?')) return
    await deleteClass(id)
    load()
  }

  const columns = [
    { key: 'name', label: 'ชื่อชั้นเรียน' },
    { key: 'grade_level', label: 'ระดับชั้น' },
    { key: 'academic_year', label: 'ปีการศึกษา' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">ชั้นเรียน</h1>
        <button onClick={openAdd} className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors">
          + เพิ่มชั้นเรียน
        </button>
      </div>
      <Table
        columns={columns}
        data={classes}
        actions={(row) => (
          <>
            <button onClick={() => openEdit(row)} className="text-blue-600 hover:underline text-sm mr-2">แก้ไข</button>
            <button onClick={() => handleDelete(row.id)} className="text-red-600 hover:underline text-sm">ลบ</button>
          </>
        )}
      />
      {modal && (
        <Modal title={modal === 'add' ? 'เพิ่มชั้นเรียน' : 'แก้ไขชั้นเรียน'} onClose={() => setModal(null)}>
          <form onSubmit={handleSubmit} className="space-y-3">
            <Field label="ชื่อชั้นเรียน" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
            <Field label="ระดับชั้น" type="number" value={form.grade_level} onChange={(v) => setForm({ ...form, grade_level: v })} required />
            <Field label="ปีการศึกษา" type="number" value={form.academic_year} onChange={(v) => setForm({ ...form, academic_year: v })} required />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setModal(null)} className="px-4 py-2 text-sm border rounded hover:bg-gray-50">ยกเลิก</button>
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
