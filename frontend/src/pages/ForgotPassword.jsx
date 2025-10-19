// src/pages/ForgotPassword.jsx
import { useState } from 'react';
import api from '../api/api';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      await api.post('/auth/forgot-password', { email });
      setOk(true);
    } catch {
      setErr('Failed to send OTP');
    }
  };

  return (
    <div className="card max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Forgot Password</h2>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        {err && <div className="error">{err}</div>}
        <button className="btn w-full">Send OTP</button>
      </form>
      {ok && (
        <div className="info mt-3">
          Check your email for the OTP. Then proceed to <Link to="/otp-verify" className="text-blue-600 hover:underline">Verify OTP</Link>.
        </div>
      )}
    </div>
  );
}