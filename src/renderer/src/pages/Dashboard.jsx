import { useState, useEffect } from 'react'
import { GraduationCap, Users, School, TrendingUp } from 'lucide-react'
import { getStudents } from '../api/students'
import { getTeachers } from '../api/teachers'
import { getClasses } from '../api/classes'
import { getRole } from '../api/auth'

function StatCard({ icon: Icon, label, count, color, loading }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md shrink-0`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      <div>
        {loading ? (
          <div className="h-7 w-12 bg-gray-100 rounded animate-pulse mb-1" />
        ) : (
          <p className="text-3xl font-bold text-gray-800">{count}</p>
        )}
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const role = getRole()
  const [counts, setCounts] = useState({ students: 0, teachers: 0, classes: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        if (role === 'admin') {
          const [s, t, c] = await Promise.all([getStudents(), getTeachers(), getClasses()])
          setCounts({ students: (s ?? []).length, teachers: (t ?? []).length, classes: (c ?? []).length })
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [role])

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-6 h-6 text-indigo-600" />
        <h1 className="text-2xl font-bold text-gray-800">ภาพรวม</h1>
      </div>

      {role === 'admin' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard icon={GraduationCap} label="นักเรียนทั้งหมด" count={counts.students} color="from-blue-500 to-blue-600" loading={loading} />
          <StatCard icon={Users}         label="ครูทั้งหมด"       count={counts.teachers} color="from-violet-500 to-violet-600" loading={loading} />
          <StatCard icon={School}        label="ชั้นเรียนทั้งหมด" count={counts.classes}  color="from-emerald-500 to-emerald-600" loading={loading} />
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <p className="text-gray-500 text-sm">
          ยินดีต้อนรับเข้าสู่ระบบจัดการโรงเรียน — เลือกเมนูจากหน้าหลักเพื่อเริ่มใช้งาน
        </p>
      </div>
    </div>
  )
}
