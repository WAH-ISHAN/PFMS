// src/pages/Budget.jsx
import { useEffect, useState } from 'react';
import api from '../api/api';
import BudgetTable from '../components/BudgetTable';

export default function Budget() {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState('General');
  const [amount, setAmount] = useState('');
  const [err, setErr] = useState('');

  const load = async () => {
    const { data } = await api.get('/budgets');
    setItems(data);
  };

  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      await api.post('/budgets', { category, amount: Number(amount) });
      setAmount('');
      await load();
    } catch {
      setErr('Failed to add budget');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this budget?')) return;
    await api.delete(`/budgets/${id}`);
    await load();
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-semibold mb-4">Budgets</h2>
      <form onSubmit={add} className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input className="input" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} required />
        <input type="number" step="0.01" className="input" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        <button className="btn">Add</button>
      </form>
      {err && <div className="error">{err}</div>}
      <div className="mt-4">
        <BudgetTable items={items} onDelete={remove} />
      </div>
    </div>
  );
}