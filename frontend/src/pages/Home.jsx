import { useEffect, useState } from 'react';
import api from '../api/api';
import Charts from '../components/Charts';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fmtCurrency } from '../utils/format';
import Expense from './Expense';
import Budget from './Budget';
import Saving from './Saving';
import BlogPosts from './BlogPosts';
import Contact from './Contact';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [savings, setSavings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!isAuthenticated) return;
    (async () => {
      try {
        setLoading(true);
        setErr('');
        const [e, b, s] = await Promise.all([
          api.get('/expenses'),
          api.get('/budgets'),
          api.get('/savings'),
        ]);
        setExpenses(e.data);
        setBudgets(b.data);
        setSavings(s.data);
      } catch {
        setErr('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    })();
  }, [isAuthenticated]);

  const totalExp = expenses.reduce((a, e) => a + Number(e.AMOUNT || e.amount || 0), 0);
  const totalBud = budgets.reduce((a, b) => a + Number(b.AMOUNT || b.amount || 0), 0);
  const totalSav = savings.reduce((a, s) => a + Number(s.CURRENT_AMOUNT || s.current_amount || 0), 0);

  return (
    <div className="space-y-6 px-4 md:px-6">
      <div className="rounded-2xl border border-gray-200/60 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 backdrop-blur shadow-xl p-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Welcome{isAuthenticated ? '' : '!'}
        </h2>

        {!isAuthenticated ? (
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            Please{' '}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-700">login</Link> or{' '}
            <Link to="/register" className="text-indigo-600 hover:text-indigo-700">register</Link>{' '}
            to start managing your finances.
          </p>
        ) : (
          <>
            {err && (
              <div className="mt-3 rounded-md border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm" role="alert" aria-live="polite">
                {err}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {loading ? (
                <>
                  <div className="h-24 bg-gray-200 dark:bg-gray-800/60 border border-gray-200/60 dark:border-gray-700 rounded-xl animate-pulse" />
                  <div className="h-24 bg-gray-200 dark:bg-gray-800/60 border border-gray-200/60 dark:border-gray-700 rounded-xl animate-pulse" />
                  <div className="h-24 bg-gray-200 dark:bg-gray-800/60 border border-gray-200/60 dark:border-gray-700 rounded-xl animate-pulse" />
                </>
              ) : (
                <>
                  <div className="rounded-xl border border-gray-200/60 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 p-4 flex items-center justify-between">
                    <div>
                      <div className="text-gray-500 dark:text-gray-400">Total Expenses</div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">{fmtCurrency(totalExp)}</div>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                      </svg>
                    </div>
                  </div>
                  <div className="rounded-xl border border-gray-200/60 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 p-4 flex items-center justify-between">
                    <div>
                      <div className="text-gray-500 dark:text-gray-400">Total Budgets</div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">{fmtCurrency(totalBud)}</div>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M4 12h16M4 16h10M4 8h8" />
                      </svg>
                    </div>
                  </div>
                  <div className="rounded-xl border border-gray-200/60 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 p-4 flex items-center justify-between">
                    <div>
                      <div className="text-gray-500 dark:text-gray-400">Total Savings</div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">{fmtCurrency(totalSav)}</div>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m-6-6h12" />
                      </svg>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="mt-6 rounded-xl border border-gray-200/60 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 p-4">
              {loading ? (
                <div className="space-y-2 animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ) : (
                <Charts expenses={expenses} budgets={budgets} />
              )}
            </div>
          </>
        )}
      </div>
      <Expense />
      <Budget />
      <Saving />
      <BlogPosts />
      <Contact />
      
    </div>
   
  );
}