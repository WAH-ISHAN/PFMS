// src/components/ExpenseTable.jsx
export default function ExpenseTable({ items, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th className="th">Category</th>
            <th className="th">Amount</th>
            <th className="th">Date</th>
            <th className="th">Created</th>
            <th className="th"></th>
          </tr>
        </thead>
        <tbody>
          {(items || []).map((e) => (
            <tr key={e.ID || e.id} className="hover:bg-gray-50">
              <td className="td">{e.CATEGORY || e.category}</td>
              <td className="td">${(e.AMOUNT || e.amount)?.toFixed ? (e.AMOUNT || e.amount).toFixed(2) : e.AMOUNT || e.amount}</td>
              <td className="td">{(e.EXPENSE_DATE || e.expense_date || '').toString().slice(0, 10)}</td>
              <td className="td">{(e.CREATED_AT || e.created_at || '').toString().slice(0, 19).replace('T', ' ')}</td>
              <td className="td">
                <button className="btn btn-danger" onClick={() => onDelete(e.ID || e.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}