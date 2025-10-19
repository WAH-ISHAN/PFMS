// routes/expenseRoutes.js

const router = require('express').Router();
const { requireAuth } = require('../middleware/authMiddleware');
const { listExpenses, addExpense, editExpense, removeExpense } = require('../controllers/expenseController');

router.use(requireAuth);

router.get('/', listExpenses);
router.post('/', addExpense);
router.put('/:id', editExpense);
router.delete('/:id', removeExpense);

module.exports = router;