import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { isLoggedIn, getRole } from './api/auth'
import { ToastProvider } from './components/Toast'
import Layout from './components/Layout'
import Login from './pages/Login'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import Teachers from './pages/Teachers'
import Classes from './pages/Classes'
import Schedule from './pages/Schedule'
import Grades from './pages/Grades'
import Attendance from './pages/Attendance'
import Subjects from './pages/Subjects'

function PrivateRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />
}

function RoleRoute({ roles, children }) {
  const role = getRole()
  if (!roles.includes(role)) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500 text-lg font-medium">ไม่มีสิทธิ์เข้าถึง</p>
      </div>
    )
  }
  return children
}

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />

          <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/students"  element={<RoleRoute roles={['admin']}><Students /></RoleRoute>} />
            <Route path="/teachers"  element={<RoleRoute roles={['admin']}><Teachers /></RoleRoute>} />
            <Route path="/classes"   element={<RoleRoute roles={['admin']}><Classes /></RoleRoute>} />
            <Route path="/schedule"  element={<RoleRoute roles={['admin']}><Schedule /></RoleRoute>} />
            <Route path="/subjects"  element={<RoleRoute roles={['admin']}><Subjects /></RoleRoute>} />
            <Route path="/grades"    element={<RoleRoute roles={['admin', 'teacher']}><Grades /></RoleRoute>} />
            <Route path="/attendance" element={<RoleRoute roles={['admin', 'teacher']}><Attendance /></RoleRoute>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  )
}
