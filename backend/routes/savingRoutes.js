// routes/savingRoutes.js

const router = require('express').Router();
const { requireAuth } = require('../middleware/authMiddleware');
const { listSavings, addSaving, editSaving, removeSaving } = require('../controllers/savingController');

router.use(requireAuth);

router.get('/', listSavings);
router.post('/', addSaving);
router.put('/:id', editSaving);
router.delete('/:id', removeSaving);

module.exports = router;