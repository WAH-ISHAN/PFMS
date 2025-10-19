// src/pages/Expense.jsx
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

  const load = async () => {
    const { data } = await api.get('/expenses');
    setItems(data);
  };

  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      await api.post('/expenses', { category, amount: Number(amount), expense_date: date });
      setAmount('');
      await load();
    } catch {
      setErr('Failed to add expense');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this expense?')) return;
    await api.delete(`/expenses/${id}`);
    await load();
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-semibold mb-4">Expenses</h2>
      <form onSubmit={add} className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <input className="input" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} required />
        <input type="number" step="0.01" className="input" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} required />
        <button className="btn">Add</button>
      </form>
      {err && <div className="error">{err}</div>}
      <div className="mt-4">
        <ExpenseTable items={items} onDelete={remove} />
      </div>
    </div>
  );
}