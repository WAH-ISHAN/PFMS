// Small formatting helpers used in various places.

export const fmtCurrency = (n) =>
  (Number(n) || 0).toLocaleString(undefined, { style: 'currency', currency: 'USD' });

export const todayISO = () => new Date().toISOString().slice(0, 10);