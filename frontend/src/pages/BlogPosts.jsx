import { useEffect, useState } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function BlogPosts() {
  const { user, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setErr('');
      const { data } = await api.get('/blog');
      setPosts(data);
    } catch {
      setErr('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const addOrUpdate = async (e) => {
    e.preventDefault();
    if (!title || !content) return;
    try {
      setSaving(true);
      if (editId) {
        await api.put(`/blog/${editId}`, { title, content });
      } else {
        await api.post('/blog', { title, content });
      }
      setTitle(''); setContent(''); setEditId(null);
      await load();
    } catch {
      setErr(editId ? 'Failed to update post' : 'Failed to publish post');
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (p) => {
    setEditId(p.ID || p.id);
    setTitle(p.TITLE || p.title);
    setContent(p.CONTENT || p.content);
  };

  const onDelete = async (id) => {
    if (!confirm('Delete this post?')) return;
    try {
      await api.delete(`/blog/${id}`);
      await load();
    } catch {
      setErr('Failed to delete post');
    }
  };

  const canManage = (p) => {
    const authorId = p.AUTHOR_ID || p.author_id;
    return isAuthenticated && (user?.role === 'ADMIN' || user?.id === authorId);
  };

  const formatDate = (d) => {
    if (!d) return '';
    try {
      return new Date(d).toLocaleString();
    } catch {
      return (d || '').toString().slice(0, 19).replace('T', ' ');
    }
  };

  return (
    <div className="space-y-6 px-4 md:px-6">
      <div className="rounded-2xl border border-gray-200/60 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 backdrop-blur shadow-xl p-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Blog</h2>

        {isAuthenticated && (
          <form onSubmit={addOrUpdate} className="space-y-3 mb-6">
            <input
              className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-gray-100"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-gray-100"
              placeholder="Content"
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <div className="flex gap-2">
              <button
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 text-white font-medium py-2.5 px-4 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <svg className="mr-2 h-5 w-5 animate-spin text-white/90" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    {editId ? 'Updating...' : 'Publishing...'}
                  </>
                ) : (
                  editId ? 'Update' : 'Publish'
                )}
              </button>
              {editId && (
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-lg bg-gray-800 text-white font-medium py-2.5 px-4 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700 transition"
                  onClick={() => { setEditId(null); setTitle(''); setContent(''); }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}

        {err && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm" role="alert" aria-live="polite">
            {err}
          </div>
        )}

        <div className="space-y-4">
          {loading ? (
            <>
              <div className="h-24 bg-gray-200 dark:bg-gray-800/60 border border-gray-200/60 dark:border-gray-700 rounded-xl animate-pulse" />
              <div className="h-24 bg-gray-200 dark:bg-gray-800/60 border border-gray-200/60 dark:border-gray-700 rounded-xl animate-pulse" />
              <div className="h-24 bg-gray-200 dark:bg-gray-800/60 border border-gray-200/60 dark:border-gray-700 rounded-xl animate-pulse" />
            </>
          ) : posts.length === 0 ? (
            <div className="rounded-xl border border-gray-200/60 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 p-5 text-gray-600 dark:text-gray-300">
              No posts yet.
            </div>
          ) : (
            posts.map(p => (
              <article key={p.ID || p.id} className="rounded-xl border border-gray-200/60 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 p-5">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{p.TITLE || p.title}</h3>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  By {(p.AUTHOR_NAME || p.author_name) || 'Unknown'} • {formatDate(p.CREATED_AT || p.created_at)}
                </div>
                <p className="mt-3 whitespace-pre-wrap text-gray-800 dark:text-gray-100">{(p.CONTENT || p.content) || ''}</p>

                {canManage(p) && (
                  <div className="mt-3 flex gap-2">
                    <button
                      className="inline-flex items-center justify-center rounded-lg bg-gray-800 text-white font-medium py-1.5 px-3 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-700 transition"
                      onClick={() => onEdit(p)}
                    >
                      Edit
                    </button>
                    <button
                      className="inline-flex items-center justify-center rounded-lg bg-red-600 text-white font-medium py-1.5 px-3 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                      onClick={() => onDelete(p.ID || p.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}