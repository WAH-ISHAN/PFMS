// src/components/GoogleLoginButton.jsx
import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

export default function GoogleLoginButton({ onSuccess }) {
  const divRef = useRef(null);
  const { googleLogin } = useAuth();
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!window.google || !clientId || !divRef.current) return;
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response) => {
        try {
          await googleLogin(response.credential);
          onSuccess?.();
        } catch {
          alert('Google login failed');
        }
      }
    });
    window.google.accounts.id.renderButton(divRef.current, {
      theme: 'outline',
      size: 'large',
      text: 'signin_with'
    });
  }, [clientId, googleLogin]);

  if (!clientId) return null;
  return <div ref={divRef}></div>;
}