// routes/budgetRoutes.js

const router = require('express').Router();
const { requireAuth } = require('../middleware/authMiddleware');
const { listBudgets, addBudget, editBudget, removeBudget } = require('../controllers/budgetController');

router.use(requireAuth);

router.get('/', listBudgets);
router.post('/', addBudget);
router.put('/:id', editBudget);
router.delete('/:id', removeBudget);

module.exports = router;