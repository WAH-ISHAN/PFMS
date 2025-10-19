// utils/exportExcel.js
// Creates an Excel workbook buffer for a user's data using exceljs.

const ExcelJS = require('exceljs');

/**
 * Build an Excel workbook with Expenses, Budgets, Savings.
 * Returns a Buffer ready to send as a file.
 */
async function buildUserExport({ expenses, budgets, savings, user }) {
  const wb = new ExcelJS.Workbook();
  wb.created = new Date();
  wb.creator = 'PFM Backend';

  // Expenses sheet
  const wsExp = wb.addWorksheet('Expenses');
  wsExp.addRow(['Category', 'Amount', 'Date', 'Created At']);
  (expenses || []).forEach(e => wsExp.addRow([e.CATEGORY, e.AMOUNT, e.EXPENSE_DATE, e.CREATED_AT]));

  // Budgets sheet
  const wsBud = wb.addWorksheet('Budgets');
  wsBud.addRow(['Category', 'Amount', 'Created At']);
  (budgets || []).forEach(b => wsBud.addRow([b.CATEGORY, b.AMOUNT, b.CREATED_AT]));

  // Savings sheet
  const wsSav = wb.addWorksheet('Savings');
  wsSav.addRow(['Goal Name', 'Target', 'Current', 'Created At']);
  (savings || []).forEach(s => wsSav.addRow([s.GOAL_NAME, s.TARGET_AMOUNT, s.CURRENT_AMOUNT, s.CREATED_AT]));

  // Cover sheet
  const wsCover = wb.addWorksheet('Profile');
  wsCover.addRow(['Name', user.name]);
  wsCover.addRow(['Email', user.email]);
  wsCover.addRow(['Role', user.role]);
  wsCover.addRow(['Exported At', new Date().toISOString()]);

  const buffer = await wb.xlsx.writeBuffer();
  return buffer;
}

module.exports = { buildUserExport };