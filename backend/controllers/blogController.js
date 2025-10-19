// controllers/blogController.js

const { createPost, listPosts, updatePost, deletePost } = require('../models/blogModel');

async function getPosts(req, res, next) {
  try {
    const rows = await listPosts();
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function addPost(req, res, next) {
  try {
    const { title, content } = req.body;
    await createPost({ title, content, authorId: req.user.id });
    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
}

async function patchPost(req, res, next) {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    await updatePost({ id: Number(id), title, content, authorId: req.user.id });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

async function removePost(req, res, next) {
  try {
    const { id } = req.params;
    const isAdmin = req.user.role === 'ADMIN';
    await deletePost({ id: Number(id), authorId: req.user.id, isAdmin });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { getPosts, addPost, patchPost, removePost };