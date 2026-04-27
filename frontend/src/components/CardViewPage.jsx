import { BusinessCard } from "./BusinessCard.jsx";
import { cardToFormData } from "../utils.js";

export function CardViewPage({
  navigate,
  card,
  isScan,
  authEmail,
  authPassword,
  isAdmin,
  adminEmail,
  adminPassword,
}) {
  const canEdit =
    Boolean(authEmail && authPassword) || Boolean(isAdmin && adminEmail);

  const handleBack = () => {
    if (canEdit) {
      navigate("booking-table", { email: authEmail, password: authPassword });
    } else {
      navigate("home");
    }
  };

  const handleEdit = () => {
    navigate("create", {
      initialData: cardToFormData(card),
      imagePreview: card.image_url,
      cardId: card.id,
      authEmail,
      authPassword,
      isAdmin,
      adminEmail,
      adminPassword,
    });
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = card.qr_code;
    a.download = `qr-${card.name.replace(/\s+/g, "-").toLowerCase()}.png`;
    a.click();
  };

  // ── isScan = true matlab QR scan ya direct URL open ──
  // Header nahi dikhega, sirf BusinessCard dikhegi
  if (isScan) {
    return (
      <div style={{ 
        minHeight: '100svh', 
        background: '#f4f6fb',
        padding: '0 0 32px 0'
      }}>
        <BusinessCard form={card} imageSrc={card.image_url} mode="view" />
      </div>
    );
  }

  // ── Normal view (booking table se aaya) ──
  return (
    <div className="page card-view-page">
      {/* Header */}
      <header className="page-header">
        <button className="back-btn" onClick={handleBack}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h2 style={{ flex: 1, textAlign: "center" }}>Digital Card</h2>
        {canEdit ? (
          <button className="btn btn-sm btn-primary" onClick={handleEdit}>
            Edit
          </button>
        ) : (
          <div style={{ width: 48 }} />
        )}
      </header>

      {/* Business Card */}
      <div style={{ padding: "16px 12px" }}>
        <BusinessCard form={card} imageSrc={card.image_url} mode="view" />
      </div>

      {/* QR Code */}
      {card.qr_code && (
        <div className="qr-section" style={{ paddingBottom: 24 }}>
          <p className="section-small-label">QR Code</p>
          <img src={card.qr_code} alt="QR Code" className="card-qr-img" />
        </div>
      )}

      {/* Download Button */}
      <div className="flex justify-center">
        <button
          onClick={handleDownload}
          className="btn btn-outline btn-lg btn-full"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download
        </button>
      </div>
    </div>
  );
}