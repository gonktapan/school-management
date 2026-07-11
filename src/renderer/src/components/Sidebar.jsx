import { NavLink, useNavigate } from 'react-router-dom'
import {
  GraduationCap,
  Users,
  School,
  CalendarDays,
  BarChart3,
  ClipboardCheck,
  LogOut,
  LayoutDashboard,
  X,
} from 'lucide-react'
import { getRole, logout } from '../api/auth'

const adminLinks = [
  { to: '/students',   label: 'นักเรียน',    icon: GraduationCap },
  { to: '/teachers',   label: 'ครู',          icon: Users },
  { to: '/classes',    label: 'ชั้นเรียน',    icon: School },
  { to: '/schedule',   label: 'ตารางเรียน',   icon: CalendarDays },
  { to: '/grades',     label: 'เกรด',         icon: BarChart3 },
  { to: '/attendance', label: 'การเข้าเรียน', icon: ClipboardCheck },
]

const teacherLinks = [
  { to: '/grades',     label: 'เกรด',         icon: BarChart3 },
  { to: '/attendance', label: 'การเข้าเรียน', icon: ClipboardCheck },
]

export default function Sidebar({ onClose }) {
  const navigate = useNavigate()
  const role = getRole()
  const links = role === 'admin' ? adminLinks : teacherLinks

  function handleLogout() {
    logout()
    navigate('/login')
  }

  function handleNavClick() {
    onClose?.()
  }

  return (
    <aside className="h-full w-60 flex flex-col bg-gradient-to-b from-indigo-700 to-indigo-900 shadow-xl">
      {/* Logo + close button (mobile) */}
      <div className="px-5 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">School</p>
            <p className="text-indigo-300 text-xs">Management</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-indigo-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Role badge */}
      <div className="px-4 mb-3">
        <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/10 text-indigo-200 text-xs font-medium">
          {role === 'admin' ? 'ผู้ดูแลระบบ' : 'ครู'}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto scrollbar-thin">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={handleNavClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'text-indigo-200 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-indigo-200 hover:bg-white/10 hover:text-white transition-all duration-150"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          ออกจากระบบ
        </button>
      </div>
    </aside>
  )
}
