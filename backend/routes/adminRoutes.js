// routes/adminRoutes.js

const router = require('express').Router();
const { requireAuth } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const { users, stats } = require('../controllers/adminController');

router.use(requireAuth, requireRole('ADMIN'));

router.get('/users', users);
router.get('/stats', stats);

module.exports = router;