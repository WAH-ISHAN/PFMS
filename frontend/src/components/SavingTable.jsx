// src/components/SavingTable.jsx
export default function SavingTable({ items, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th className="th">Goal</th>
            <th className="th">Target</th>
            <th className="th">Current</th>
            <th className="th">Progress</th>
            <th className="th">Created</th>
            <th className="th"></th>
          </tr>
        </thead>
        <tbody>
          {(items || []).map((s) => {
            const target = s.TARGET_AMOUNT || s.target_amount || 0;
            const current = s.CURRENT_AMOUNT || s.current_amount || 0;
            const pct = target ? Math.min(100, Math.round((current / target) * 100)) : 0;
            return (
              <tr key={s.ID || s.id} className="hover:bg-gray-50">
                <td className="td">{s.GOAL_NAME || s.goal_name}</td>
                <td className="td">${target}</td>
                <td className="td">${current}</td>
                <td className="td">{pct}%</td>
                <td className="td">{(s.CREATED_AT || s.created_at || '').toString().slice(0, 19).replace('T', ' ')}</td>
                <td className="td">
                  <button className="btn btn-danger" onClick={() => onDelete(s.ID || s.id)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}