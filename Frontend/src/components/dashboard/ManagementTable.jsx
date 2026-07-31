import { useMemo, useState } from 'react'
import Icon from '../ui/Icon'

const STATUS_STYLES = {
  Active: 'bg-secondary-container text-on-secondary-container',
  Pending: 'bg-surface-container-highest text-on-surface-variant',
  Suspended: 'bg-error-container text-on-error-container',
  Published: 'bg-secondary-container text-on-secondary-container',
  Draft: 'bg-surface-container-highest text-on-surface-variant',
  Open: 'bg-secondary-container text-on-secondary-container',
  Closed: 'bg-surface-container-highest text-on-surface-variant',
}

/**
 * Generic searchable table for the admin management pages (users,
 * institutions, opportunities, content). Row actions are presented but
 * disabled — this is a frontend shell; wire them up to real mutations
 * once the backend endpoints exist.
 */
export default function ManagementTable({ columns, rows, searchPlaceholder = 'Search...', searchKeys = [] }) {
  const [search, setSearch] = useState('')

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return rows
    return rows.filter((row) => searchKeys.some((key) => String(row[key] ?? '').toLowerCase().includes(query)))
  }, [rows, search, searchKeys])

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 shadow-sm overflow-hidden">
      {searchKeys.length > 0 && (
        <div className="p-md border-b border-outline-variant/40">
          <div className="relative max-w-sm">
            <Icon
              name="search"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-full text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-surface-container-low border-b border-outline-variant/40 text-on-surface-variant font-label-md text-label-md">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-6 py-4">
                  {col.label}
                </th>
              ))}
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/40">
            {filteredRows.map((row) => (
              <tr key={row.id} className="hover:bg-surface-container transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4">
                    {col.key === 'status' ? (
                      <span
                        className={`px-3 py-1 rounded-full font-label-sm text-label-sm ${
                          STATUS_STYLES[row.status] ?? 'bg-surface-container-highest text-on-surface-variant'
                        }`}
                      >
                        {row.status}
                      </span>
                    ) : (
                      <span
                        className={col.key === columns[0].key ? 'font-label-md text-label-md text-on-surface' : 'text-on-surface-variant'}
                      >
                        {row[col.key]}
                      </span>
                    )}
                  </td>
                ))}
                <td className="px-6 py-4 text-right">
                  <button
                    disabled
                    title="Connects to live data once the backend is wired up"
                    className="inline-flex items-center gap-1 text-primary opacity-50 cursor-not-allowed font-label-md text-label-md"
                  >
                    Manage
                    <Icon name="chevron_right" className="text-[18px]" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredRows.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-10 text-center text-on-surface-variant">
                  No results match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
