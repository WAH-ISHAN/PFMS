// routes/publicRoutes.js
// Contact form endpoint (optional). Stores message and emails admin.

const router = require('express').Router();
const { execute } = require('../config/db');
const { sendMail } = require('../utils/email');

// POST /public/contact
router.post('/contact', async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    await execute(
      `INSERT INTO contact_messages (name, email, subject, message)
       VALUES (:name, :email, :subject, :message)`,
      { name, email, subject, message }
    );

    // Notify admin email (optional)
    await sendMail({
      to: process.env.SMTP_USER,
      subject: `[Contact] ${subject}`,
      text: `${name} <${email}> says:\n\n${message}`,
      html: `<p><b>${name}</b> &lt;${email}&gt; says:</p><p>${message}</p>`
    });

    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;