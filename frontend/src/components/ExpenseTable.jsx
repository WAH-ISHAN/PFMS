import { fmtCurrency } from '../utils/format';

export default function ExpenseTable({ items = [], onDelete }) {
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
            <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300">Category</th>
            <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300">Amount</th>
            <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300">Date</th>
            <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300">Created</th>
            <th className="px-3 py-2"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {items.length === 0 ? (
            <tr>
              <td className="px-3 py-3 text-gray-600 dark:text-gray-300" colSpan={5}>No expenses yet.</td>
            </tr>
          ) : (
            items.map((e) => {
              const amt = Number(e.AMOUNT ?? e.amount ?? 0);
              const date = e.EXPENSE_DATE || e.expense_date || '';
              return (
                <tr key={e.ID || e.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                  <td className="px-3 py-2 text-gray-900 dark:text-gray-100">{e.CATEGORY || e.category}</td>
                  <td className="px-3 py-2 text-gray-900 dark:text-gray-100">{fmtCurrency(amt)}</td>
                  <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{date.toString().slice(0, 10)}</td>
                  <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{formatDate(e.CREATED_AT || e.created_at)}</td>
                  <td className="px-3 py-2 text-right">
                    <button
                      className="inline-flex items-center justify-center rounded-md bg-red-600 text-white px-3 py-1.5 text-xs font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                      onClick={() => onDelete?.(e.ID || e.id)}
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