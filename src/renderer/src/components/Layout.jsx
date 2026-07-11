import { Outlet, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import ErrorBoundary from './ErrorBoundary'

export default function Layout() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <header className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100 shadow-sm">
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-semibold text-gray-800 text-sm">School Management</span>
      </header>

      <main className="flex-1 overflow-auto p-4 md:p-8">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
    </div>
  )
}
