import { Inbox } from 'lucide-react'

export default function Table({ columns, data, actions }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-100">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 md:px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
              {actions && (
                <th className="px-4 md:px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  จัดการ
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <Inbox className="w-8 h-8" />
                    <span className="text-sm">ไม่มีข้อมูล</span>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr key={row.id ?? i} className="hover:bg-indigo-50/40 transition-colors duration-100">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 md:px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 md:px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {actions(row)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
