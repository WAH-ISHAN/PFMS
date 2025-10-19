// config/wso2.js
// WSO2 JWT verification using JOSE and JWKS. Also supports local dev JWTs.

const { createRemoteJWKSet, jwtVerify } = require('jose');

/**
 * Lazy JWKS loader for WSO2 (only used when DEV_LOCAL_AUTH=false).
 */
let remoteJwks;
function getRemoteJwks() {
  if (!remoteJwks) {
    const jwksUrl = new URL(process.env.WSO2_JWKS_URL);
    remoteJwks = createRemoteJWKSet(jwksUrl);
  }
  return remoteJwks;
}

/**
 * Verify a WSO2-issued JWT using JWKS and expected claims.
 */
async function verifyWSO2JWT(token) {
  const expectedIss = process.env.WSO2_EXPECTED_ISS;
  const expectedAud = process.env.WSO2_EXPECTED_AUD;

  const { payload } = await jwtVerify(token, getRemoteJwks(), {
    issuer: expectedIss,
    audience: expectedAud
  });

  // Typical claims: sub, scope (string space-separated), exp, iat
  return payload;
}

/**
 * Verify a local dev JWT (HS256) for development only.
 */
async function verifyLocalJWT(token) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET_DEV);
  const { payload } = await jwtVerify(token, secret, {
    issuer: process.env.JWT_ISSUER_DEV
  });
  return payload;
}

module.exports = {
  verifyWSO2JWT,
  verifyLocalJWT
};