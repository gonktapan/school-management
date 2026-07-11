import { useNavigate } from 'react-router-dom'
import {
  GraduationCap,
  Users,
  School,
  CalendarDays,
  BarChart3,
  ClipboardCheck,
  BookOpen,
  LayoutDashboard,
  LogOut,
} from 'lucide-react'
import { getRole, logout } from '../api/auth'

const sharedMenus = [
  { to: '/dashboard',  label: 'ภาพรวม',       icon: LayoutDashboard, color: 'from-slate-500 to-slate-600' },
]

const adminMenus = [
  { to: '/students',   label: 'นักเรียน',      icon: GraduationCap,  color: 'from-blue-500 to-blue-600' },
  { to: '/teachers',   label: 'ครู',            icon: Users,          color: 'from-violet-500 to-violet-600' },
  { to: '/classes',    label: 'ชั้นเรียน',      icon: School,         color: 'from-emerald-500 to-emerald-600' },
  { to: '/schedule',   label: 'ตารางเรียน',     icon: CalendarDays,   color: 'from-amber-500 to-amber-600' },
  { to: '/subjects',   label: 'วิชาเรียน',      icon: BookOpen,       color: 'from-purple-500 to-purple-600' },
  { to: '/grades',     label: 'เกรด',           icon: BarChart3,      color: 'from-rose-500 to-rose-600' },
  { to: '/attendance', label: 'การเข้าเรียน',   icon: ClipboardCheck, color: 'from-teal-500 to-teal-600' },
]

const teacherMenus = [
  { to: '/grades',     label: 'เกรด',           icon: BarChart3,      color: 'from-rose-500 to-rose-600' },
  { to: '/attendance', label: 'การเข้าเรียน',   icon: ClipboardCheck, color: 'from-teal-500 to-teal-600' },
]

export default function Home() {
  const navigate = useNavigate()
  const role = getRole()
  const menus = [...sharedMenus, ...(role === 'admin' ? adminMenus : teacherMenus)]

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 to-purple-800">
      <div className="px-6 pt-10 pb-6">
        <p className="text-indigo-300 text-sm mb-1">
          {role === 'admin' ? 'ผู้ดูแลระบบ' : 'ครู'}
        </p>
        <h1 className="text-white text-2xl font-bold">School Management</h1>
      </div>

      <div className="bg-slate-50 min-h-screen rounded-t-3xl px-5 pt-8 pb-24">
        <h2 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-4">เมนูหลัก</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {menus.map(({ to, label, icon: Icon, color }) => (
            <button
              key={to}
              onClick={() => navigate(to)}
              className="bg-white rounded-2xl p-5 flex flex-col items-center gap-3 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-150"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-700">{label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={handleLogout}
          className="mt-8 w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-gray-200 bg-white text-gray-500 text-sm font-medium hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all duration-150"
        >
          <LogOut className="w-4 h-4" />
          ออกจากระบบ
        </button>
      </div>
    </div>
  )
}
