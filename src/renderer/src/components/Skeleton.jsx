export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50/80 border-b border-gray-100">
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="px-6 py-3.5">
                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r}>
              {Array.from({ length: cols }).map((_, c) => (
                <td key={c} className="px-6 py-4">
                  <div className={`h-3 bg-gray-100 rounded animate-pulse ${c === 0 ? 'w-16' : 'w-32'}`} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
