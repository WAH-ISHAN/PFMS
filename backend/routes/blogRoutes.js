// routes/blogRoutes.js

const router = require('express').Router();
const { requireAuth } = require('../middleware/authMiddleware');
const { getPosts, addPost, patchPost, removePost } = require('../controllers/blogController');

// Public read (if you want it public; otherwise add requireAuth)
router.get('/', getPosts);

// Authors/Admin can write
router.post('/', requireAuth, addPost);
router.put('/:id', requireAuth, patchPost);
router.delete('/:id', requireAuth, removePost);

module.exports = router;