import { useState, useCallback } from 'react';
import { ToastProvider } from './Toast.jsx';
import { Home } from './components/Home.jsx';
import CreateForm from './components/CreateForm.jsx';
import { PreviewPage } from './components/PreviewPage.jsx';
import { QRShow } from './components/QRShow.jsx';
import { BookingTable } from './components/BookingTable.jsx';
import { CardViewPage } from './components/CardViewPage.jsx';
import { CardLoader } from './components/CardLoader.jsx';

import './App.css';

// ── Root ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <ToastProvider>
      <Router />
    </ToastProvider>
  );
}

// ── Router ─────────────────────────────────────────────────────────────────────
// Views: home | create | preview | qrshow | booking-table |
//        card-view | card-loading | admin-login | admin-table
function Router() {
  const [view, setView] = useState(() => {
    // Handle direct /card/:id URL (from QR scan)
    const m = window.location.pathname.match(/^\/card\/([^/]+)/);
    if (m) return 'card-loading';
    return 'home';
  });

  const [data, setData] = useState(() => {
    const m = window.location.pathname.match(/^\/card\/([^/]+)/);
    return m ? { cardId: m[1] } : {};
  });

  const navigate = useCallback((nextView, nextData = {}) => {
    setData(nextData);
    setView(nextView);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const props = { navigate, ...data };

  return (
    <div className="app">
      {view === 'home'          && <Home          {...props} />}
      {view === 'create'        && <CreateForm    {...props} />}
      {view === 'preview'       && <PreviewPage   {...props} />}
      {view === 'qrshow'        && <QRShow        {...props} />}
      {view === 'booking-table' && <BookingTable  {...props} />}
      {view === 'card-view'     && <CardViewPage  {...props} />}
      {view === 'card-loading'  && <CardLoader    cardId={data.cardId} navigate={navigate} />}
    </div>
  );
}
