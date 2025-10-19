// src/pages/Saving.jsx
import { useEffect, useState } from 'react';
import api from '../api/api';
import SavingTable from '../components/SavingTable';

export default function Saving() {
  const [items, setItems] = useState([]);
  const [goal, setGoal] = useState('Emergency Fund');
  const [target, setTarget] = useState('');
  const [current, setCurrent] = useState('');
  const [err, setErr] = useState('');

  const load = async () => {
    const { data } = await api.get('/savings');
    setItems(data);
  };

  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      await api.post('/savings', {
        goal_name: goal,
        target_amount: Number(target),
        current_amount: Number(current || 0)
      });
      setTarget(''); setCurrent('');
      await load();
    } catch {
      setErr('Failed to add goal');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this goal?')) return;
    await api.delete(`/savings/${id}`);
    await load();
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-semibold mb-4">Savings</h2>
      <form onSubmit={add} className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <input className="input" placeholder="Goal name" value={goal} onChange={(e) => setGoal(e.target.value)} required />
        <input type="number" step="0.01" className="input" placeholder="Target amount" value={target} onChange={(e) => setTarget(e.target.value)} required />
        <input type="number" step="0.01" className="input" placeholder="Current amount" value={current} onChange={(e) => setCurrent(e.target.value)} />
        <button className="btn">Add</button>
      </form>
      {err && <div className="error">{err}</div>}
      <div className="mt-4">
        <SavingTable items={items} onDelete={remove} />
      </div>
    </div>
  );
}