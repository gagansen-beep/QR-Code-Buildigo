import { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastCtx = createContext(null);

const ICONS = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
const DURATIONS = { success: 3000, error: 5000, warning: 4000, info: 3000 };

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const show = useCallback(
    (message, type = 'info') => {
      const id = ++idRef.current;
      setToasts((t) => [...t, { id, message, type }]);
      setTimeout(() => dismiss(id), DURATIONS[type] ?? 3000);
    },
    [dismiss],
  );

  const toast = {
    success: (msg) => show(msg, 'success'),
    error:   (msg) => show(msg, 'error'),
    warning: (msg) => show(msg, 'warning'),
    info:    (msg) => show(msg, 'info'),
  };

  return (
    <ToastCtx.Provider value={toast}>
      {children}
      {toasts.length > 0 && (
        <div className="toast-container" role="region" aria-label="Notifications">
          {toasts.map((t) => (
            <div key={t.id} className={`toast toast-${t.type}`} role="alert">
              <span className="toast-icon" aria-hidden="true">{ICONS[t.type]}</span>
              <span className="toast-msg">{t.message}</span>
              <button className="toast-close" onClick={() => dismiss(t.id)} aria-label="Dismiss">×</button>
            </div>
          ))}
        </div>
      )}
    </ToastCtx.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
