import { fmtCurrency } from '../utils/format';

export default function SavingTable({ items = [], onDelete }) {
  const formatDate = (d) => {
    if (!d) return '';
    try { return new Date(d).toLocaleString(); }
    catch { return (d || '').toString().slice(0, 19).replace('T', ' '); }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 dark:bg-gray-800/70">
          <tr>
            <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300">Goal</th>
            <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300">Target</th>
            <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300">Current</th>
            <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300">Progress</th>
            <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300">Created</th>
            <th className="px-3 py-2"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {items.length === 0 ? (
            <tr>
              <td className="px-3 py-3 text-gray-600 dark:text-gray-300" colSpan={6}>No savings goals yet.</td>
            </tr>
          ) : (
            items.map((s) => {
              const target = Number(s.TARGET_AMOUNT ?? s.target_amount ?? 0);
              const current = Number(s.CURRENT_AMOUNT ?? s.current_amount ?? 0);
              const pct = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
              return (
                <tr key={s.ID || s.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                  <td className="px-3 py-2 text-gray-900 dark:text-gray-100">{s.GOAL_NAME || s.goal_name}</td>
                  <td className="px-3 py-2 text-gray-900 dark:text-gray-100">{fmtCurrency(target)}</td>
                  <td className="px-3 py-2 text-gray-900 dark:text-gray-100">{fmtCurrency(current)}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
                        <div className="h-full bg-indigo-600" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-12 text-right text-gray-700 dark:text-gray-300">{pct}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{formatDate(s.CREATED_AT || s.created_at)}</td>
                  <td className="px-3 py-2 text-right">
                    <button
                      className="inline-flex items-center justify-center rounded-md bg-red-600 text-white px-3 py-1.5 text-xs font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                      onClick={() => onDelete?.(s.ID || s.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}