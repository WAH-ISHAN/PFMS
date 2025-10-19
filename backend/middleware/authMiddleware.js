// middleware/authMiddleware.js
// Verifies JWT either from WSO2 (prod) or local dev JWT (dev mode).

const { verifyWSO2JWT, verifyLocalJWT } = require('../config/wso2');
const { getUserByEmail, getUserById } = require('../models/userModel');

/**
 * Extract Bearer token from Authorization header.
 */
function getTokenFromHeader(req) {
  const auth = req.headers.authorization || '';
  const [scheme, token] = auth.split(' ');
  return scheme === 'Bearer' ? token : null;
}

/**
 * Middleware: verify token, attach req.user
 */
async function requireAuth(req, res, next) {
  try {
    const token = getTokenFromHeader(req);
    if (!token) return res.status(401).json({ error: 'Missing token' });

    const dev = process.env.DEV_LOCAL_AUTH === 'true';

    let payload;
    if (dev) {
      // Local dev mode: verify with HS256 secret
      payload = await verifyLocalJWT(token);
      // We include userId and role in local tokens
      req.user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role || 'USER',
        scopes: payload.scope ? payload.scope.split(' ') : []
      };
    } else {
      // Production mode: verify with WSO2 JWKS
      payload = await verifyWSO2JWT(token);
      // Map payload claims to our user. Common claims: sub (subject), email, scope
      const email = payload.email || payload.user_email || null;
      const sub = payload.sub;

      let user = null;
      if (email) user = await getUserByEmail(email);
      if (!user && sub) user = await getUserById(Number(sub)).catch(() => null);

      if (!user) {
        return res.status(401).json({ error: 'Unknown user in token' });
      }

      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        scopes: typeof payload.scope === 'string' ? payload.scope.split(' ') : []
      };
    }

    next();
  } catch (err) {
    err.status = 401;
    next(err);
  }
}

module.exports = { requireAuth };