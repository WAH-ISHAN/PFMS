// src/pages/Contact.jsx
import { useState } from 'react';
import api from '../api/api';

export default function Contact() {
  const [name, setName] = useState(''); const [email, setEmail] = useState('');
  const [subject, setSubject] = useState(''); const [message, setMessage] = useState('');
  const [ok, setOk] = useState(false); const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault(); setErr('');
    try {
      await api.post('/public/contact', { name, email, subject, message });
      setOk(true); setName(''); setEmail(''); setSubject(''); setMessage('');
    } catch { setErr('Failed to send'); }
  };

  return (
    <div className="card max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Contact</h2>
      <form onSubmit={submit} className="space-y-3">
        <input className="input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="input" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
        <textarea className="textarea" placeholder="Message" rows={5} value={message} onChange={(e) => setMessage(e.target.value)} required />
        {err && <div className="error">{err}</div>}
        <button className="btn">Send</button>
        {ok && <div className="info">Thanks! We received your message.</div>}
      </form>
    </div>
  );
}