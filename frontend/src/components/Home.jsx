export function Home({ navigate }) {
  return (
    <div className="page home-page">
      <div className="home-hero">
        <div className="home-logo-wrap">
          <QrSvgIcon />
        </div>
        <h1 className="home-title">QR Business Card</h1>
        <p className="home-subtitle">
          Create a smart digital card with an instant scannable QR code
        </p>
      </div>

      <div className="home-actions">
        {/* Create Card */}
        <button
          className="btn btn-primary btn-lg btn-full"
          onClick={() => navigate('create')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Create Card
        </button>

        {/* My QR / My Cards */}
        <button
          className="btn btn-outline btn-lg btn-full"
          onClick={() => navigate('booking-table')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3z" />
            <rect x="14" y="14" width="3" height="3" />
            <rect x="18" y="14" width="3" height="3" />
            <rect x="14" y="18" width="3" height="3" />
            <rect x="18" y="18" width="3" height="3" />
          </svg>
          My QR
        </button>

        {/* Admin Panel — subtle link */}
        {/* <button
          className="home-admin-link"
          onClick={() => navigate('admin-login')}
        >
          Admin Panel*
        </button> */}
      </div>
    </div>
  );
}

// ── QR SVG logo ───────────────────────────────────────────────────────────────
function QrSvgIcon() {
  return (
    <svg className="home-logo" viewBox="0 0 80 80" fill="none">
      <rect x="4"  y="4"  width="30" height="30" rx="3" fill="#1565c0" />
      <rect x="10" y="10" width="18" height="18" rx="1" fill="white" />
      <rect x="14" y="14" width="10" height="10" rx="1" fill="#1565c0" />

      <rect x="46" y="4"  width="30" height="30" rx="3" fill="#1565c0" />
      <rect x="52" y="10" width="18" height="18" rx="1" fill="white" />
      <rect x="56" y="14" width="10" height="10" rx="1" fill="#1565c0" />

      <rect x="4"  y="46" width="30" height="30" rx="3" fill="#1565c0" />
      <rect x="10" y="52" width="18" height="18" rx="1" fill="white" />
      <rect x="14" y="56" width="10" height="10" rx="1" fill="#1565c0" />

      <rect x="46" y="46" width="8"  height="8"  rx="1" fill="#1565c0" />
      <rect x="58" y="46" width="8"  height="8"  rx="1" fill="#1565c0" />
      <rect x="46" y="58" width="8"  height="8"  rx="1" fill="#1565c0" />
      <rect x="58" y="58" width="18" height="8"  rx="1" fill="#1565c0" />
    </svg>
  );
}
