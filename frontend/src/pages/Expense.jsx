import { useEffect, useState } from 'react';
import api from '../api/api';
import { todayISO } from '../utils/format';
import ExpenseTable from '../components/ExpenseTable';

export default function Expense() {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState('General');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(todayISO());
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/expenses');
      setItems(data);
    } catch {
      setErr('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    setErr('');
    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt <= 0) {
      setErr('Please enter a valid amount');
      return;
    }
    if (!date) {
      setErr('Please select a valid date');
      return;
    }
    try {
      setAdding(true);
      await api.post('/expenses', { category: category.trim(), amount: amt, expense_date: date });
      setAmount('');
      await load();
    } catch {
      setErr('Failed to add expense');
    } finally {
      setAdding(false);
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this expense?')) return;
    try {
      await api.delete(`/expenses/${id}`);
      await load();
    } catch {
      setErr('Failed to delete expense');
    }
  };

  return (
    <div className="px-4 md:px-6">
      <div className="rounded-2xl border border-gray-200/60 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 backdrop-blur shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Expenses</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">Add a new expense and track your spending.</p>
          </div>
        </div>

        <form onSubmit={add} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Category</label>
            <div className="relative mt-1">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 7h16M4 12h10M4 17h6" />
                </svg>
              </span>
              <input
                className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-gray-100"
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Amount</label>
            <div className="relative mt-1">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 3v18m-6-9h12" />
                </svg>
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                inputMode="decimal"
                className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-gray-100"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Date</label>
            <div className="relative mt-1">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7h8m-9 4h10m-12 4h14" />
                </svg>
              </span>
              <input
                type="date"
                className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-gray-100"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="md:col-span-1 flex items-end">
            <button
              className="inline-flex items-center justify-center w-full rounded-lg bg-indigo-600 text-white font-medium py-2.5 px-4 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition"
              disabled={adding}
            >
              {adding ? (
                <>
                  <svg className="mr-2 h-5 w-5 animate-spin text-white/90" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Adding...
                </>
              ) : (
                'Add'
              )}
            </button>
          </div>
        </form>

        {err && (
          <div className="mt-3 rounded-md border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm" role="alert" aria-live="polite">
            {err}
          </div>
        )}

        <div className="mt-6">
          {loading ? (
            <div className="space-y-2 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ) : (
            <ExpenseTable items={items} onDelete={remove} />
          )}
        </div>
      </div>
    </div>
  );
}