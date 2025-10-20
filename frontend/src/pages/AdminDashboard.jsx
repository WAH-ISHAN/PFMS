import { useEffect, useState } from 'react';
import api from '../api/api';
import { fmtCurrency } from '../utils/format';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setErr('');
      const [s, u] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
      ]);
      setStats(s.data);
      setUsers(u.data);
    } catch {
      setErr('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const num = (n) => Number(n || 0).toLocaleString();
  const money = (n) => fmtCurrency(Number(n || 0));
  const formatDate = (d) => {
    if (!d) return '';
    try { return new Date(d).toLocaleString(); }
    catch { return (d || '').toString().slice(0,19).replace('T',' '); }
  };

  return (
    <div className="space-y-6 px-4 md:px-6">
      <div className="rounded-2xl border border-gray-200/60 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 backdrop-blur shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Admin Dashboard</h2>
          <button
            onClick={load}
            disabled={loading}
            className="inline-flex items-center rounded-lg bg-indigo-600 text-white font-medium py-2 px-3 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {loading ? (
              <>
                <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                </svg>
                Refreshing...
              </>
            ) : (
              <>
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M4 4v6h6M20 20v-6h-6M20 4l-6 6M4 20l6-6"/>
                </svg>
                Refresh
              </>
            )}
          </button>
        </div>

        {err && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm" role="alert" aria-live="polite">
            {err}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            <>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800/60 border border-gray-200/60 dark:border-gray-700 rounded-xl animate-pulse" />
              ))}
            </>
          ) : (
            <>
              <StatCard
                title="Users"
                value={num(stats?.users)}
                color="indigo"
                icon={
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 12a4 4 0 100-8 4 4 0 000 8zM6 20a6 6 0 1112 0v1H6v-1z" />
                  </svg>
                }
              />
              <StatCard
                title="Expenses Total"
                value={money(stats?.expensesTotal)}
                color="rose"
                icon={
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                  </svg>
                }
              />
              <StatCard
                title="Budgets Total"
                value={money(stats?.budgetsTotal)}
                color="emerald"
                icon={
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M4 12h16M4 16h10M4 8h8" />
                  </svg>
                }
              />
              <StatCard
                title="Savings Total"
                value={money(stats?.savingsTotal)}
                color="sky"
                icon={
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m-6-6h12" />
                  </svg>
                }
              />
            </>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200/60 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 backdrop-blur shadow-xl p-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Users</h3>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="space-y-2 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/70">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300">ID</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300">Name</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300">Email</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300">Role</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {users.map((u) => {
                  const id = u.ID || u.id;
                  const name = u.NAME || u.name;
                  const email = u.EMAIL || u.email;
                  const role = u.ROLE || u.role;
                  const created = u.CREATED_AT || u.created_at;
                  return (
                    <tr key={id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                      <td className="px-3 py-2 text-gray-900 dark:text-gray-100">{id}</td>
                      <td className="px-3 py-2 text-gray-900 dark:text-gray-100">{name}</td>
                      <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{email}</td>
                      <td className="px-3 py-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200">
                          {role}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{formatDate(created)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color = 'indigo', icon }) {
  const colorMap = {
    indigo: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    sky: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
    gray: 'bg-gray-500/10 text-gray-700 dark:text-gray-300',
  };
  return (
    <div className="rounded-xl border border-gray-200/60 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 p-4 flex items-center justify-between">
      <div>
        <div className="text-gray-500 dark:text-gray-400">{title}</div>
        <div className="text-xl font-bold text-gray-900 dark:text-white">{value}</div>
      </div>
      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${colorMap[color]}`}>{icon}</div>
    </div>
  );
}