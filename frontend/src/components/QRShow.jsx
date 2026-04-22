// ── QR SHOW ────────────────────────────────────────────────────────────────────
export function QRShow({ navigate, card }) {
  const handleDownload = () => {
    const a      = document.createElement('a');
    a.href       = card.qr_code;
    a.download   = `qr-${card.name.replace(/\s+/g, '-').toLowerCase()}.png`;
    a.click();
  };

  return (
    <div style={{
      minHeight: '100svh', background: 'linear-gradient(160deg, #e3f2fd 0%, #fafcff 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }}>
      <div className="qr-card">
        {/* Top accent bar */}
        <div style={{ height: 4, width: '100%', background: 'linear-gradient(90deg, #1565c0, #42a5f5)', borderRadius: 2, marginBottom: 8 }} />

        {/* Success badge */}
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg, #1565c0, #42a5f5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(21,101,192,.3)',
        }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a2340' }}>Card Created!</h2>
        <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6, textAlign: 'center' }}>
          Your QR code is ready. Share it or let people scan it to view your digital card.
        </p>

        {/* QR Code */}
        <div className="qr-image-wrap">
          <img src={card.qr_code} alt="QR Code" className="qr-image" />
        </div>

        {/* Name & designation */}
        <p className="qr-name">{card.name}</p>
        {card.designation && <p className="text-muted" style={{ fontSize: 13 }}>{card.designation}</p>}
        {card.company     && <p className="text-muted" style={{ fontSize: 12 }}>{card.company}</p>}

        {/* Action buttons */}
        <div className="btn-row" style={{ marginTop: 8 }}>
          <button className="btn btn-outline" onClick={handleDownload}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download
          </button>
          <button className="btn btn-primary" onClick={() => navigate('home')}>
            Go Home
          </button>
        </div>

        <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>
          Save and share your QR code anywhere
        </p>
      </div>
    </div>
  );
}
