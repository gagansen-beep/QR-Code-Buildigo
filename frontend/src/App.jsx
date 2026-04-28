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

function getInitialState() {
  const p = window.location.pathname;

  // /card/:id — direct QR scan link
  const cardMatch = p.match(/^\/card\/([^/]+)/);
  if (cardMatch) return { view: 'card-loading', data: { cardId: cardMatch[1] } };

  // /my-cards — booking table
  if (p === '/my-cards') return { view: 'booking-table', data: {} };

  // /create — create form
  if (p === '/create') return { view: 'create', data: {} };

  // everything else → home
  return { view: 'home', data: {} };
}

function viewToPath(nextView, nextData = {}) {
  switch (nextView) {
    case 'home':          return '/';
    case 'create':        return '/create';
    case 'booking-table': return '/my-cards';
    case 'preview':       return '/preview';
    case 'qrshow':        return '/qrshow';
    case 'card-view':     return nextData?.card?.id ? `/card/${nextData.card.id}` : '/';
    case 'card-loading':  return nextData?.cardId   ? `/card/${nextData.cardId}`  : '/';
    default:              return '/';
  }
}

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
      viewToPath(nextView, nextData),
    );
  }, []);

  useEffect(() => {
    const handlePop = (e) => {
      if (e.state?.view) {
        setView(e.state.view);
        setData(e.state.data || {});
      } else {
        const s = getInitialState();
        setView(s.view);
        setData(s.data);
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
