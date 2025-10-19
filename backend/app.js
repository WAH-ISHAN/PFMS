// app.js
// Express app: middleware, routes, error handling.

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const savingRoutes = require('./routes/savingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const blogRoutes = require('./routes/blogRoutes');
const publicRoutes = require('./routes/publicRoutes');

const app = express();

// CORS config for frontend origin
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true
}));

// Request logging for dev
app.use(morgan('dev'));

// JSON/body parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_, res) => res.json({ ok: true }));

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/expenses', expenseRoutes);
app.use('/budgets', budgetRoutes);
app.use('/savings', savingRoutes);
app.use('/admin', adminRoutes);
app.use('/blog', blogRoutes);
app.use('/public', publicRoutes);

// 404 handler
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal server error'
  });
});

module.exports = app;