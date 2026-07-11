import { useState, useEffect } from 'react'
import { getClasses } from '../api/classes'
import { getStudents } from '../api/students'
import { getAttendance, saveAttendance } from '../api/attendance'

const STATUS = ['present', 'absent', 'late']
const STATUS_LABEL = { present: 'มา', absent: 'ขาด', late: 'สาย' }
const STATUS_COLOR = {
  present: 'bg-green-100 text-green-700 border-green-300',
  absent: 'bg-red-100 text-red-700 border-red-300',
  late: 'bg-yellow-100 text-yellow-700 border-yellow-300',
}

export default function Attendance() {
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [students, setStudents] = useState([])
  const [records, setRecords] = useState({}) // studentId -> status
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    getClasses().then((d) => setClasses(d ?? []))
  }, [])

  useEffect(() => {
    if (!selectedClass) { setStudents([]); setRecords({}); return }
    // Load students in this class + existing attendance
    Promise.all([
      getStudents(),
      getAttendance(selectedClass, date).catch(() => []),
    ]).then(([allStudents, existing]) => {
      const inClass = (allStudents ?? []).filter((s) => s.class_id === selectedClass)
      setStudents(inClass)
      const init = {}
      inClass.forEach((s) => { init[s.id] = 'present' })
      ;(existing ?? []).forEach((r) => { init[r.student_id] = r.status })
      setRecords(init)
    })
  }, [selectedClass, date])

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    try {
      const recordsArr = Object.entries(records).map(([student_id, status]) => ({
        student_id,
        class_id: selectedClass,
        date,
        status,
      }))
      await saveAttendance(recordsArr)
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">การเข้าเรียน</h1>

      <div className="flex gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ชั้นเรียน</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- เลือกชั้นเรียน --</option>
            {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">วันที่</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {selectedClass && students.length > 0 && (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">นักเรียน</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">สถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm text-gray-700">
                      {s.name} <span className="text-gray-400">({s.student_code})</span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex gap-2">
                        {STATUS.map((st) => (
                          <button
                            key={st}
                            onClick={() => setRecords({ ...records, [s.id]: st })}
                            className={`px-3 py-1 text-xs font-medium rounded border transition-colors ${
                              records[s.id] === st
                                ? STATUS_COLOR[st]
                                : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {STATUS_LABEL[st]}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {saving ? 'กำลังบันทึก...' : 'บันทึก'}
            </button>
            {saved && <span className="text-green-600 text-sm font-medium">บันทึกสำเร็จ</span>}
          </div>
        </>
      )}

      {selectedClass && students.length === 0 && (
        <p className="text-gray-400">ไม่มีนักเรียนในชั้นเรียนนี้</p>
      )}
    </div>
  )
}
