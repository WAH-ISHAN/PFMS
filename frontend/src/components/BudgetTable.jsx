// src/components/BudgetTable.jsx
export default function BudgetTable({ items, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th className="th">Category</th>
            <th className="th">Amount</th>
            <th className="th">Created</th>
            <th className="th"></th>
          </tr>
        </thead>
        <tbody>
          {(items || []).map((b) => (
            <tr key={b.ID || b.id} className="hover:bg-gray-50">
              <td className="td">{b.CATEGORY || b.category}</td>
              <td className="td">${(b.AMOUNT || b.amount)?.toFixed ? (b.AMOUNT || b.amount).toFixed(2) : b.AMOUNT || b.amount}</td>
              <td className="td">{(b.CREATED_AT || b.created_at || '').toString().slice(0, 19).replace('T', ' ')}</td>
              <td className="td">
                <button className="btn btn-danger" onClick={() => onDelete(b.ID || b.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}