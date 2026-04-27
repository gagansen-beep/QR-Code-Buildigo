// import { useState, useCallback } from 'react';
// import { ToastProvider } from './Toast.jsx';
// import { Home } from './components/Home.jsx';
// import CreateForm from './components/CreateForm.jsx';
// import { PreviewPage } from './components/PreviewPage.jsx';
// import { QRShow } from './components/QRShow.jsx';
// import { BookingTable } from './components/BookingTable.jsx';
// import { CardViewPage } from './components/CardViewPage.jsx';
// import { CardLoader } from './components/CardLoader.jsx';

// import './App.css';

// // ── Root ───────────────────────────────────────────────────────────────────────
// export default function App() {
//   return (
//     <ToastProvider>
//       <Router />
//     </ToastProvider>
//   );
// }

// // ── Router ─────────────────────────────────────────────────────────────────────
// // Views: home | create | preview | qrshow | booking-table |
// //        card-view | card-loading | admin-login | admin-table
// function Router() {
//   const [view, setView] = useState(() => {
//     // Handle direct /card/:id URL (from QR scan)
//     const m = window.location.pathname.match(/^\/card\/([^/]+)/);
//     if (m) return 'card-loading';
//     return 'home';
//   });

//   const [data, setData] = useState(() => {
//     const m = window.location.pathname.match(/^\/card\/([^/]+)/);
//     return m ? { cardId: m[1] } : {};
//   });

//   const navigate = useCallback((nextView, nextData = {}) => {
//     setData(nextData);
//     setView(nextView);
//     window.scrollTo({ top: 0, behavior: 'instant' });
//   }, []);

//   const props = { navigate, ...data };

//   return (
//     <div className="app">
//       {view === 'home'          && <Home          {...props} />}
//       {view === 'create'        && <CreateForm    {...props} />}
//       {view === 'preview'       && <PreviewPage   {...props} />}
//       {view === 'qrshow'        && <QRShow        {...props} />}
//       {view === 'booking-table' && <BookingTable  {...props} />}
//       {view === 'card-view'     && <CardViewPage  {...props} />}
//       {view === 'card-loading'  && <CardLoader    cardId={data.cardId} navigate={navigate} />}
//     </div>
//   );
// }


import { useState, useCallback, useEffect } from 'react';
import { ToastProvider } from './Toast.jsx';
import { Home } from './components/Home.jsx';
import CreateForm from './components/CreateForm.jsx';
import { PreviewPage } from './components/PreviewPage.jsx';
import { QRShow } from './components/QRShow.jsx';
import { BookingTable } from './components/BookingTable.jsx';
import { CardViewPage } from './components/CardViewPage.jsx';
import { CardLoader } from './components/CardLoader.jsx';
import './App.css';

export default function App() {
  return (
    <ToastProvider>
      <Router />
    </ToastProvider>
  );
}

// ── URL se initial state detect karo ─────────────────────────────────────────
function getInitialState() {
  const path = window.location.pathname;

  // /card/:id — QR scan, sirf yahi direct open ho sakta hai
  const cardMatch = path.match(/^\/card\/([^/]+)/);
  if (cardMatch) return { view: 'card-loading', data: { cardId: cardMatch[1] } };

  // Baaki sabhi pages state-dependent hain — home pe bhejo
  return { view: 'home', data: {} };
}

// ── View → URL mapping ────────────────────────────────────────────────────────
function viewToPath(nextView, nextData = {}) {
  switch (nextView) {
    case 'home':          return '/';
    case 'create':        return '/create';
    case 'booking-table': return '/my-cards';
    case 'preview':       return '/preview';
    case 'qrshow':        return '/qrshow';
    case 'card-view':
      return nextData?.card?.id ? `/card/${nextData.card.id}` : '/';
    case 'card-loading':
      return nextData?.cardId ? `/card/${nextData.cardId}` : '/';
    default:
      return '/';
  }
}

// ── Router ────────────────────────────────────────────────────────────────────
function Router() {
  const initial = getInitialState();
  const [view, setView] = useState(initial.view);
  const [data, setData] = useState(initial.data);

  const navigate = useCallback((nextView, nextData = {}) => {
    setData(nextData);
    setView(nextView);
    window.scrollTo({ top: 0, behavior: 'instant' });
    window.history.pushState(
      { view: nextView, data: nextData },
      '',
      viewToPath(nextView, nextData)
    );
  }, []);

  // Browser back/forward button
  useEffect(() => {
    const handlePop = (e) => {
      if (e.state?.view) {
        setView(e.state.view);
        setData(e.state.data || {});
      } else {
        // State nahi hai (direct URL) — home pe bhejo
        setView('home');
        setData({});
      }
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
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