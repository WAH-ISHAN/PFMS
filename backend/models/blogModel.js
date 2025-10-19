// models/blogModel.js

const { execute } = require('../config/db');

async function createPost({ title, content, authorId }) {
  await execute(
    `INSERT INTO blog_posts (title, content, author_id)
     VALUES (:title, :content, :author_id)`,
    { title, content, author_id: authorId }
  );
}

async function listPosts() {
  const res = await execute(
    `SELECT p.id, p.title, p.content, p.author_id, p.created_at, u.name as author_name
     FROM blog_posts p
     LEFT JOIN app_users u ON u.id = p.author_id
     ORDER BY p.created_at DESC`,
    {}
  );
  return res.rows;
}

async function updatePost({ id, title, content, authorId }) {
  await execute(
    `UPDATE blog_posts
     SET title = :title, content = :content
     WHERE id = :id AND author_id = :author_id`,
    { id, title, content, author_id: authorId }
  );
}

async function deletePost({ id, authorId, isAdmin = false }) {
  if (isAdmin) {
    await execute(`DELETE FROM blog_posts WHERE id = :id`, { id });
  } else {
    await execute(`DELETE FROM blog_posts WHERE id = :id AND author_id = :author_id`, { id, author_id: authorId });
  }
}

module.exports = { createPost, listPosts, updatePost, deletePost };