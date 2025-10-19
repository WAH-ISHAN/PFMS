// controllers/authController.js
// Register/Login/Logout, Google login, Forgot password (OTP) flow.

const bcrypt = require('bcryptjs');
const { SignJWT } = require('jose');
const { OAuth2Client } = require('google-auth-library');

const { createUser, getUserByEmail, updateUserPassword, linkGoogleIdToUser } = require('../models/userModel');
const { createPasswordReset, findValidReset, markResetUsed } = require('../models/passwordResetModel');
const { sendMail } = require('../utils/email');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Helper: issue local JWT (dev mode only).
 */
async function issueLocalJWT({ sub, email, role, scope = '' }) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET_DEV);
  return await new SignJWT({ email, role, scope })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(String(sub))
    .setIssuer(process.env.JWT_ISSUER_DEV)
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRES_IN || '1d')
    .sign(secret);
}

// POST /auth/register
async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const existing = await getUserByEmail(email);
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const hash = await bcrypt.hash(password, 10);
    const user = await createUser({ name, email, passwordHash: hash, role: 'USER' });

    // Dev-only token for immediate login
    let token = null;
    if (process.env.DEV_LOCAL_AUTH === 'true') {
      token = await issueLocalJWT({ sub: user.id, email, role: 'USER', scope: 'user.read user.write' });
    }

    res.status(201).json({ user: { id: user.id, name, email, role: 'USER' }, token });
  } catch (err) {
    next(err);
  }
}

// POST /auth/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.PASSWORD_HASH || user.password_hash);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });

    let token = null;
    if (process.env.DEV_LOCAL_AUTH === 'true') {
      token = await issueLocalJWT({ sub: user.ID || user.id, email: user.EMAIL || user.email, role: user.ROLE || user.role, scope: 'user.read user.write' });
    } else {
      // In prod with WSO2, login typically happens via WSO2 (OAuth2). Backend doesn't issue tokens.
      // You can redirect the SPA to WSO2 login page. Here, we just confirm credentials (if used).
    }

    res.json({
      user: { id: user.ID || user.id, name: user.NAME || user.name, email: user.EMAIL || user.email, role: user.ROLE || user.role },
      token
    });
  } catch (err) {
    next(err);
  }
}

// POST /auth/google-login
// Frontend should send Google's id_token. We verify and either create or attach user.
async function googleLogin(req, res, next) {
  try {
    const { idToken } = req.body;
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    const email = payload.email;
    const googleId = payload.sub;
    const name = payload.name || email.split('@')[0];

    let user = await getUserByEmail(email);
    if (!user) {
      // Create user auto-linked to Google ID
      user = await createUser({ name, email, passwordHash: await bcrypt.hash(googleId, 10), role: 'USER', googleId });
    } else if (!user.GOOGLE_ID && !user.google_id) {
      await linkGoogleIdToUser(user.ID || user.id, googleId);
    }

    let token = null;
    if (process.env.DEV_LOCAL_AUTH === 'true') {
      token = await issueLocalJWT({ sub: user.ID || user.id, email, role: user.ROLE || user.role, scope: 'user.read user.write' });
    }

    res.json({
      user: { id: user.ID || user.id, name: user.NAME || user.name, email, role: user.ROLE || user.role },
      token
    });
  } catch (err) {
    next(err);
  }
}

// POST /auth/forgot-password
async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    const user = await getUserByEmail(email);
    if (!user) return res.json({ ok: true }); // Do not leak user existence

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await createPasswordReset({ userId: user.ID || user.id, otpCode: otp, expiresAt: expires });

    await sendMail({
      to: email,
      subject: 'Your password reset code',
      text: `Your OTP is ${otp}. It expires in 15 minutes.`,
      html: `<p>Your OTP is <b>${otp}</b>. It expires in 15 minutes.</p>`
    });

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

// POST /auth/verify-otp
async function verifyOtp(req, res, next) {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await getUserByEmail(email);
    if (!user) return res.status(400).json({ error: 'Invalid request' });

    const record = await findValidReset({ userId: user.ID || user.id, otpCode: otp });
    if (!record) return res.status(400).json({ error: 'Invalid or expired OTP' });

    const hash = await bcrypt.hash(newPassword, 10);
    await updateUserPassword(user.ID || user.id, hash);
    await markResetUsed(record.ID || record.id);

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

// POST /auth/logout
// Server stateless logout (client should remove token). Optionally we could maintain a token blocklist.
async function logout(req, res) {
  res.json({ ok: true });
}

module.exports = { register, login, googleLogin, forgotPassword, verifyOtp, logout };