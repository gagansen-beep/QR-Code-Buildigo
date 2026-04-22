import { useState } from 'react';
import { useToast } from '../Toast.jsx';
import { api } from '../api.js';
import { BusinessCard } from './BusinessCard.jsx';

export function PreviewPage({
  navigate,
  form,
  imageFile,
  imagePreview,
  cardId,
}) {
  const toast  = useToast();
  const isEdit = Boolean(cardId);
  const [loading, setLoading] = useState(false);

  // Cancel — go back to the Create form, form state is preserved
  const handleBack = () =>
    navigate('create', { initialData: form, imageFile, imagePreview, cardId });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
      if (imageFile) fd.append('image', imageFile);

      if (isEdit) {
        await api.updateCard(cardId, fd);
        toast.success('Card updated successfully');
        navigate('booking-table');
      } else {
        const card = await api.createCard(fd);
        navigate('qrshow', { card });
      }
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100svh', background: '#f4f6fb', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header className="page-header">
        <button className="back-btn" onClick={handleBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Edit
        </button>
        <h2 style={{ flex: 1, textAlign: 'center' }}>
          {isEdit ? 'Preview Changes' : 'Card Preview'}
        </h2>
        <div style={{ width: 48 }} />
      </header>

      {/* Card preview area */}
      <div style={{ flex: 1, padding: '16px 12px 100px', overflowY: 'auto' }}>
        <p style={{
          textAlign: 'center', fontSize: 11, fontWeight: 700,
          color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px',
          marginBottom: 14,
        }}>
          Preview
        </p>
        <BusinessCard form={form} imageSrc={imagePreview} mode="preview" />
      </div>

      {/* Sticky footer */}
      <div style={{
        position: 'sticky', bottom: 0,
        background: '#fff',
        borderTop: '1px solid #e5e7eb',
        padding: '14px 16px',
        display: 'flex', gap: 12,
        boxShadow: '0 -4px 16px rgba(0,0,0,0.06)',
      }}>
        <button
          onClick={handleBack}
          disabled={loading}
          style={{
            flex: 1, padding: '13px 0', borderRadius: 14,
            border: '1.5px solid #e5e7eb', background: '#fff',
            fontSize: 14, fontWeight: 600, color: '#374151',
            cursor: 'pointer', opacity: loading ? 0.5 : 1,
          }}
        >
          ← Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            flex: 2, padding: '13px 0', borderRadius: 14,
            background: 'linear-gradient(135deg, #1565c0, #1976d2)',
            border: 'none', fontSize: 14, fontWeight: 600, color: '#fff',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          {loading
            ? <span className="spinner spinner-sm" />
            : isEdit ? 'Save Changes' : 'Submit & Get QR'
          }
        </button>
      </div>
    </div>
  );
}
