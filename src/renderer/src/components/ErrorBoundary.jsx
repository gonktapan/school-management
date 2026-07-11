import { Component } from 'react'
import { RefreshCw } from 'lucide-react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full py-24 text-gray-500">
          <RefreshCw className="w-10 h-10 mb-4 text-gray-300" />
          <p className="text-base font-medium text-gray-700 mb-1">เกิดข้อผิดพลาด</p>
          <p className="text-sm text-gray-400 mb-6">กรุณาลองใหม่อีกครั้ง</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            ลองใหม่
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
