// src/pages/OtpVerify.jsx
import { useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function OtpVerify() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      await api.post('/auth/verify-otp', { email, otp, newPassword: password });
      alert('Password reset successful. Please login.');
      navigate('/login');
    } catch (e) {
      setErr(e?.response?.data?.error || 'Verification failed');
    }
  };

  return (
    <div className="card max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Verify OTP</h2>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">OTP</label>
          <input className="input" value={otp} onChange={(e) => setOtp(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">New Password</label>
          <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {err && <div className="error">{err}</div>}
        <button className="btn w-full">Reset Password</button>
      </form>
    </div>
  );
}