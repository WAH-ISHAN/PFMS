// src/pages/BlogPosts.jsx
import { useEffect, useState } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function BlogPosts() {
  const { user, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editId, setEditId] = useState(null);

  const load = async () => {
    const { data } = await api.get('/blog');
    setPosts(data);
  };

  useEffect(() => { load(); }, []);

  const addOrUpdate = async (e) => {
    e.preventDefault();
    if (!title || !content) return;
    if (editId) await api.put(`/blog/${editId}`, { title, content });
    else await api.post('/blog', { title, content });
    setTitle(''); setContent(''); setEditId(null); await load();
  };

  const onEdit = (p) => {
    setEditId(p.ID || p.id);
    setTitle(p.TITLE || p.title);
    setContent(p.CONTENT || p.content);
  };

  const onDelete = async (id) => {
    if (!confirm('Delete this post?')) return;
    await api.delete(`/blog/${id}`); await load();
  };

  const canManage = (p) => {
    const authorId = p.AUTHOR_ID || p.author_id;
    return isAuthenticated && (user.role === 'ADMIN' || user.id === authorId);
  };

  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="text-2xl font-semibold mb-4">Blog</h2>
        {isAuthenticated && (
          <form onSubmit={addOrUpdate} className="space-y-3">
            <input className="input" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <textarea className="textarea" placeholder="Content" rows={4} value={content} onChange={(e) => setContent(e.target.value)} required />
            <div className="flex gap-2">
              <button className="btn">{editId ? 'Update' : 'Publish'}</button>
              {editId && <button type="button" className="btn btn-secondary" onClick={() => { setEditId(null); setTitle(''); setContent(''); }}>Cancel</button>}
            </div>
          </form>
        )}
      </div>

      <ul className="space-y-4">
        {posts.map(p => (
          <li key={p.ID || p.id} className="card">
            <h3 className="text-xl font-semibold">{p.TITLE || p.title}</h3>
            <div className="text-sm text-gray-500">By {(p.AUTHOR_NAME || p.author_name) || 'Unknown'} on {(p.CREATED_AT || p.created_at || '').toString().slice(0,19).replace('T',' ')}</div>
            <p className="mt-2 whitespace-pre-wrap">{(p.CONTENT || p.content) || ''}</p>
            {canManage(p) && (
              <div className="mt-3 flex gap-2">
                <button className="btn btn-secondary" onClick={() => onEdit(p)}>Edit</button>
                <button className="btn btn-danger" onClick={() => onDelete(p.ID || p.id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}