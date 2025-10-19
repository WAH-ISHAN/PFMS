// src/pages/AdminDashboard.jsx
import { useEffect, useState } from 'react';
import api from '../api/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);

  const load = async () => {
    const [s, u] = await Promise.all([api.get('/admin/stats'), api.get('/admin/users')]);
    setStats(s.data); setUsers(u.data);
  };

  useEffect(() => { load(); }, []);

  if (!stats) return <div className="text-gray-600">Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="text-2xl font-semibold mb-4">Admin Dashboard</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="card p-4">
            <div className="text-gray-500">Users</div>
            <div className="text-xl font-bold">{stats.users}</div>
          </div>
          <div className="card p-4">
            <div className="text-gray-500">Expenses Total</div>
            <div className="text-xl font-bold">${stats.expensesTotal}</div>
          </div>
          <div className="card p-4">
            <div className="text-gray-500">Budgets Total</div>
            <div className="text-xl font-bold">${stats.budgetsTotal}</div>
          </div>
          <div className="card p-4">
            <div className="text-gray-500">Savings Total</div>
            <div className="text-xl font-bold">${stats.savingsTotal}</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-2">Users</h3>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th className="th">ID</th>
                <th className="th">Name</th>
                <th className="th">Email</th>
                <th className="th">Role</th>
                <th className="th">Created</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.ID || u.id} className="hover:bg-gray-50">
                  <td className="td">{u.ID || u.id}</td>
                  <td className="td">{u.NAME || u.name}</td>
                  <td className="td">{u.EMAIL || u.email}</td>
                  <td className="td"><span className="badge">{u.ROLE || u.role}</span></td>
                  <td className="td">{(u.CREATED_AT || u.created_at || '').toString().slice(0,19).replace('T',' ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}