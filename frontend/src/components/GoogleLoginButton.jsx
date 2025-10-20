import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

export default function GoogleLoginButton({ onSuccess }) {
  const divRef = useRef(null);
  const { googleLogin } = useAuth();
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId || !divRef.current) return;
    if (!(window && window.google && window.google.accounts && window.google.accounts.id)) return;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response) => {
        try {
          await googleLogin(response.credential);
          onSuccess?.();
        } catch {
          alert('Google login failed');
        }
      },
    });

    window.google.accounts.id.renderButton(divRef.current, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: 'signin_with',
      shape: 'pill',
      logo_alignment: 'left',
      // width works for 'standard' type; comment it out if sizing looks off
      width: 320,
    });
  }, [clientId, googleLogin, onSuccess]);

  if (!clientId) return null;

  return (
    <div className="w-full flex justify-center">
      <div ref={divRef} />
    </div>
  );
}