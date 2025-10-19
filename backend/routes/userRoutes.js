// routes/userRoutes.js

const router = require('express').Router();
const { requireAuth } = require('../middleware/authMiddleware');
const { profile, exportData, backup } = require('../controllers/userController');

router.get('/profile', requireAuth, profile);
router.get('/export', requireAuth, exportData);
router.get('/backup', requireAuth, backup);

module.exports = router;