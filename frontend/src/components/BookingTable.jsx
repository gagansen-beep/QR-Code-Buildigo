import { useState, useEffect } from 'react';
import { useToast } from '../Toast.jsx';
import { api } from '../api.js';
import { formatDate, cardToFormData } from '../utils.js';

// ── Pagination ────────────────────────────────────────────────────────────────
function Pagination({ page, total, limit, onChange }) {
  const totalPages = Math.ceil(total / limit) || 1;
  if (totalPages <= 1) return null;
  return (
    <div className="pagination">
      <button className="page-btn" disabled={page <= 1} onClick={() => onChange(page - 1)}>‹</button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          className={`page-btn${p === page ? ' active' : ''}`}
          onClick={() => onChange(p)}
        >
          {p}
        </button>
      ))}
      <button className="page-btn" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>›</button>
    </div>
  );
}

// ── Avatar ────────────────────────────────────────────────────────────────────
function TableAvatar({ card }) {
  return (
    <div className="table-avatar">
      {card.image_url
        ? <img src={card.image_url} alt={card.name} onError={(e) => { e.target.style.display = 'none'; }} />
        : (card.name?.[0] || '?').toUpperCase()
      }
    </div>
  );
}

// ── Cards Tab ─────────────────────────────────────────────────────────────────
function CardsTab({ navigate }) {
  const toast = useToast();

  const [cards,    setCards]    = useState([]);
  const [total,    setTotal]    = useState(0);
  const [page,     setPage]     = useState(1);
  const [loading,  setLoading]  = useState(true);
  const [deleting, setDeleting] = useState(null);

  const LIMIT = 10;
  const [trigger, setTrigger] = useState({ pg: 1 });

  useEffect(() => {
    let active = true;
    setLoading(true);
    api.getAllCards(trigger.pg, LIMIT)
      .then(({ data, total: t }) => {
        if (!active) return;
        setCards(data);
        setTotal(t);
      })
      .catch((err) => { if (active) toast.error(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  const handlePageChange = (pg) => {
    setPage(pg);
    setTrigger({ pg });
  };

  const handleEdit = (card) => {
    navigate('create', {
      initialData:  cardToFormData(card),
      imagePreview: card.image_url || null,
      cardId:       card.id,
    });
  };

  const handleDelete = async (card) => {
    if (!window.confirm(`Delete card for "${card.name}"? This cannot be undone.`)) return;
    setDeleting(card.id);
    try {
      await api.deleteCard(card.id);
      toast.success('Card deleted');
      setCards((prev) => prev.filter((c) => c.id !== card.id));
      setTotal((prev) => prev - 1);
    } catch (err) {
      toast.error(err.message || 'Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return <div className="center-content"><span className="spinner spinner-lg" /></div>;
  }

  if (cards.length === 0) {
    return (
      <div className="empty-state">
        <p>No cards found.</p>
        <button className="btn btn-primary" onClick={() => navigate('create')}>
          Create your first card
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Name / Title</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cards.map((card) => (
              <tr key={card.id}>
                <td><TableAvatar card={card} /></td>
                <td>
                  <div className="table-name">{card.name}</div>
                  {card.designation && <div className="table-sub">{card.designation}</div>}
                </td>
                <td>
                  {card.email
                    ? <a href={`mailto:${card.email}`} style={{ color: '#1565c0', fontSize: 13 }}>{card.email}</a>
                    : <span className="text-muted">—</span>
                  }
                </td>
                <td>
                  {card.phone
                    ? <a href={`tel:${card.phone.replace(/\s/g, '')}`} style={{ color: '#1565c0', fontSize: 13 }}>{card.phone}</a>
                    : <span className="text-muted">—</span>
                  }
                </td>
                <td>
                  <span className="text-muted" style={{ fontSize: 12 }}>{formatDate(card.created_at)}</span>
                </td>
                <td>
                  <div className="action-btns">
                    <button className="btn btn-sm btn-outline" onClick={() => navigate('card-view', { card })}>View</button>
                    <button className="btn btn-sm btn-outline" onClick={() => handleEdit(card)}>Edit</button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(card)}
                      disabled={deleting === card.id}
                    >
                      {deleting === card.id ? '…' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} total={total} limit={LIMIT} onChange={handlePageChange} />
    </>
  );
}

// ── Enquiries Tab ─────────────────────────────────────────────────────────────
function EnquiriesTab() {
  const toast = useToast();

  const [enquiries, setEnquiries] = useState([]);
  const [total,     setTotal]     = useState(0);
  const [page,      setPage]      = useState(1);
  const [loading,   setLoading]   = useState(true);
  const [deleting,  setDeleting]  = useState(null);

  const LIMIT = 10;
  const [trigger, setTrigger] = useState({ pg: 1 });

  useEffect(() => {
    let active = true;
    setLoading(true);
    api.getAllEnquiries(trigger.pg, LIMIT)
      .then(({ data, total: t }) => {
        if (!active) return;
        setEnquiries(data);
        setTotal(t);
      })
      .catch((err) => { if (active) toast.error(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  const handlePageChange = (pg) => {
    setPage(pg);
    setTrigger({ pg });
  };

  const handleDelete = async (enq) => {
    if (!window.confirm(`Delete enquiry from "${enq.email}"? This cannot be undone.`)) return;
    setDeleting(enq.id);
    try {
      await api.deleteEnquiry(enq.id);
      toast.success('Enquiry deleted');
      setEnquiries((prev) => prev.filter((e) => e.id !== enq.id));
      setTotal((prev) => prev - 1);
    } catch (err) {
      toast.error(err.message || 'Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return <div className="center-content"><span className="spinner spinner-lg" /></div>;
  }

  if (enquiries.length === 0) {
    return (
      <div className="empty-state">
        <p>No enquiries yet.</p>
        <p style={{ fontSize: 13, color: '#6b7280' }}>Enquiries submitted via business cards will appear here.</p>
      </div>
    );
  }

  return (
    <>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Product</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Received</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map((enq) => (
              <tr key={enq.id}>
                <td>
                  <a href={`mailto:${enq.email}`} style={{ color: '#1565c0', fontSize: 13 }}>{enq.email}</a>
                </td>
                <td>
                  {enq.product
                    ? <span style={{ fontSize: 13 }}>{enq.product}</span>
                    : <span className="text-muted">—</span>
                  }
                </td>
                <td>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{enq.subject}</span>
                </td>
                <td style={{ maxWidth: 220 }}>
                  <span style={{ fontSize: 12, color: '#6b7280', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {enq.message}
                  </span>
                </td>
                <td>
                  <span className="text-muted" style={{ fontSize: 12 }}>{formatDate(enq.created_at)}</span>
                </td>
                <td>
                  <div className="action-btns">
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(enq)}
                      disabled={deleting === enq.id}
                    >
                      {deleting === enq.id ? '…' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} total={total} limit={LIMIT} onChange={handlePageChange} />
    </>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function BookingTable({ navigate }) {
  const [activeTab, setActiveTab] = useState('cards');

  return (
    <div className="page table-page">
      {/* Header */}
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate('home')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h2 style={{ flex: 1, textAlign: 'center' }}>
          {activeTab === 'cards' ? 'All Cards' : 'Enquiries'}
        </h2>
        {activeTab === 'cards' && (
          <button
            className="btn btn-sm btn-primary"
            onClick={() => navigate('create')}
            title="Create a new card"
          >
            + New
          </button>
        )}
        {activeTab === 'enquiries' && <div style={{ width: 60 }} />}
      </header>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '2px solid #e5e7eb',
        background: '#fff',
        padding: '0 14px',
      }}>
        <button
          onClick={() => setActiveTab('cards')}
          style={{
            padding: '10px 18px',
            fontSize: 14,
            fontWeight: 600,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            borderBottom: activeTab === 'cards' ? '2px solid #1565c0' : '2px solid transparent',
            color: activeTab === 'cards' ? '#1565c0' : '#6b7280',
            marginBottom: -2,
          }}
        >
          Cards
        </button>
        <button
          onClick={() => setActiveTab('enquiries')}
          style={{
            padding: '10px 18px',
            fontSize: 14,
            fontWeight: 600,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            borderBottom: activeTab === 'enquiries' ? '2px solid #1565c0' : '2px solid transparent',
            color: activeTab === 'enquiries' ? '#1565c0' : '#6b7280',
            marginBottom: -2,
          }}
        >
          Enquiries
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'cards'     && <CardsTab navigate={navigate} />}
      {activeTab === 'enquiries' && <EnquiriesTab />}
    </div>
  );
}
