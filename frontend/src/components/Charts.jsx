// src/components/Charts.jsx
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend
} from 'chart.js';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Charts({ expenses = [], budgets = [] }) {
  const expAgg = expenses.reduce((acc, e) => {
    const cat = (e.CATEGORY || e.category) || 'Uncategorized';
    const amt = Number(e.AMOUNT || e.amount || 0);
    acc[cat] = (acc[cat] || 0) + amt;
    return acc;
  }, {});
  const budAgg = budgets.reduce((acc, b) => {
    const cat = (b.CATEGORY || b.category) || 'Uncategorized';
    const amt = Number(b.AMOUNT || b.amount || 0);
    acc[cat] = (acc[cat] || 0) + amt;
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="card h-80">
        <h3 className="text-lg font-semibold mb-2">Expenses by Category</h3>
        <Bar
          data={{
            labels: Object.keys(expAgg),
            datasets: [{ label: 'Amount', data: Object.values(expAgg), backgroundColor: '#4e79a7' }]
          }}
          options={{ responsive: true, maintainAspectRatio: false }}
        />
      </div>
      <div className="card h-80">
        <h3 className="text-lg font-semibold mb-2">Budget Allocation</h3>
        <Doughnut
          data={{
            labels: Object.keys(budAgg),
            datasets: [{ label: 'Amount', data: Object.values(budAgg), backgroundColor: ['#f28e2b', '#e15759', '#76b7b2', '#59a14f', '#edc948', '#b07aa1', '#ff9da7'] }]
          }}
          options={{ responsive: true, maintainAspectRatio: false }}
        />
      </div>
    </div>
  );
}