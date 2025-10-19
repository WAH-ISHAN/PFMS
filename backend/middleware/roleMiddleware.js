// middleware/roleMiddleware.js
// Simple role guard and/or scope guard.

function requireRole(role) {
  return (req, res, next) => {
    if (req.user?.role !== role) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}

function requireScope(scope) {
  return (req, res, next) => {
    if (!req.user?.scopes?.includes(scope)) return res.status(403).json({ error: 'Missing scope' });
    next();
  };
}

module.exports = { requireRole, requireScope };