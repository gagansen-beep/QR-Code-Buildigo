import { useEffect } from 'react';
import { useToast } from '../Toast.jsx';
import { api } from '../api.js';

// Shown briefly while fetching the card data from a QR scan URL (/card/:id)
export function CardLoader({ cardId, navigate }) {
  const toast = useToast();

  useEffect(() => {
    let active = true;

    api.getCard(cardId)
      .then((card) => {
        if (active) navigate('card-view', { card, isScan: true });
      })
      .catch(() => {
        if (active) {
          toast.error('Card not found');
          navigate('home');
        }
      });

    return () => { active = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        background: 'linear-gradient(160deg, #e3f2fd 0%, #fafcff 100%)',
      }}
    >
      <div
        style={{
          width: 48, height: 48, borderRadius: '50%',
          border: '3px solid #e3f2fd',
          borderTopColor: '#1565c0',
          animation: 'spin .7s linear infinite',
        }}
      />
      <p style={{ fontSize: 14, color: '#6b7280' }}>Loading card…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
