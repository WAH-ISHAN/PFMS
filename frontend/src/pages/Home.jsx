// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import api from '../api/api';
import Charts from '../components/Charts';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fmtCurrency } from '../utils/format';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [savings, setSavings] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) return;
    (async () => {
      const [e, b, s] = await Promise.all([api.get('/expenses'), api.get('/budgets'), api.get('/savings')]);
      setExpenses(e.data); setBudgets(b.data); setSavings(s.data);
    })();
  }, [isAuthenticated]);

  const totalExp = expenses.reduce((a, e) => a + Number(e.AMOUNT || e.amount || 0), 0);
  const totalBud = budgets.reduce((a, b) => a + Number(b.AMOUNT || b.amount || 0), 0);
  const totalSav = savings.reduce((a, s) => a + Number(s.CURRENT_AMOUNT || s.current_amount || 0), 0);

  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="text-2xl font-semibold">Welcome{isAuthenticated ? '' : '!'}</h2>
        {!isAuthenticated ? (
          <p className="text-gray-700 mt-2">
            Please <Link to="/login" className="text-blue-600 hover:underline">login</Link> or <Link to="/register" className="text-blue-600 hover:underline">register</Link> to start managing your finances.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
              <div className="card p-4">
                <div className="text-gray-500">Total Expenses</div>
                <div className="text-xl font-bold">{fmtCurrency(totalExp)}</div>
              </div>
              <div className="card p-4">
                <div className="text-gray-500">Total Budgets</div>
                <div className="text-xl font-bold">{fmtCurrency(totalBud)}</div>
              </div>
              <div className="card p-4">
                <div className="text-gray-500">Total Savings</div>
                <div className="text-xl font-bold">{fmtCurrency(totalSav)}</div>
              </div>
            </div>
            <div className="mt-4">
              <Charts expenses={expenses} budgets={budgets} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}