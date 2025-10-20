import { useEffect, useMemo, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend
} from 'chart.js';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Charts({ expenses = [], budgets = [] }) {
  // Theme-aware colors (updates when 'dark' class changes)
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  useEffect(() => {
    const obs = new MutationObserver(() => setIsDark(document.documentElement.classList.contains('dark')));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  const expAgg = useMemo(() => {
    return expenses.reduce((acc, e) => {
      const cat = (e.CATEGORY || e.category) || 'Uncategorized';
      const amt = Number(e.AMOUNT || e.amount || 0);
      acc[cat] = (acc[cat] || 0) + amt;
      return acc;
    }, {});
  }, [expenses]);

  const budAgg = useMemo(() => {
    return budgets.reduce((acc, b) => {
      const cat = (b.CATEGORY || b.category) || 'Uncategorized';
      const amt = Number(b.AMOUNT || b.amount || 0);
      acc[cat] = (acc[cat] || 0) + amt;
      return acc;
    }, {});
  }, [budgets]);

  const tickColor = isDark ? '#d1d5db' : '#374151';
  const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';

  const barOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: tickColor } },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: tickColor } },
      y: { grid: { color: gridColor }, ticks: { color: tickColor } },
    },
  }), [tickColor, gridColor]);

  const doughnutOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: tickColor } },
    },
  }), [tickColor]);

  const palette = ['#6366F1', '#F59E0B', '#EF4444', '#10B981', '#06B6D4', '#8B5CF6', '#F97316', '#84CC16', '#EC4899', '#22D3EE'];
  const doughnutColors = (len) => Array.from({ length: len }, (_, i) => palette[i % palette.length] + 'B3'); // add alpha

  const expLabels = Object.keys(expAgg);
  const expData = Object.values(expAgg);

  const budLabels = Object.keys(budAgg);
  const budData = Object.values(budAgg);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="rounded-xl border border-gray-200/60 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 p-4 h-80">
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Expenses by Category</h3>
        {expLabels.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">No expense data</div>
        ) : (
          <Bar
            data={{
              labels: expLabels,
              datasets: [{ label: 'Amount', data: expData, backgroundColor: '#6366F1' }],
            }}
            options={barOptions}
          />
        )}
      </div>
      <div className="rounded-xl border border-gray-200/60 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 p-4 h-80">
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Budget Allocation</h3>
        {budLabels.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">No budget data</div>
        ) : (
          <Doughnut
            data={{
              labels: budLabels,
              datasets: [{
                label: 'Amount',
                data: budData,
                backgroundColor: doughnutColors(budLabels.length),
                borderWidth: 0,
              }],
            }}
            options={doughnutOptions}
          />
        )}
      </div>
    </div>
  );
}