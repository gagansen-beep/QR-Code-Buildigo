import { useState } from "react";
import { api } from "../api.js";

// ── Icons ──────────────────────────────────────────────────────────────────────
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.8" width="20" height="20">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11.5a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .82h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91A16 16 0 0015.1 17.9l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.8" width="20" height="20">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2 7l10 7 10-7" />
  </svg>
);

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.8" width="20" height="20">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
  </svg>
);

const ShareIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.8" width="20" height="20">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.8" width="20" height="20">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="#25d366">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="#1877f2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22">
    <defs>
      <linearGradient id="ig-bc" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#f09433" />
        <stop offset="50%" stopColor="#e6683c" />
        <stop offset="100%" stopColor="#bc1888" />
      </linearGradient>
    </defs>
    <path
      fill="url(#ig-bc)"
      d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
    />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="#0a66c2">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

// ── Static Config — EDIT THESE VALUES ─────────────────────────────────────────
const STATIC_ABOUT = "Buildigo is a buyer side material buying partner that helps construction companies secure better material prices and structured payment solutions by coordinating professionally					between buyers and suppliers.";

const STATIC_ADDRESS = "87/2 Bicholi Hapsi, Mayank Blue Water Park Rd, opp. Parinay Homes, Indore, Madhya Pradesh,India 452016";

const STATIC_WEBSITE = "www.buildigo.in";


const STATIC_BANNER_IMAGE = "Cover@4x-100.jpg (1).jpeg"

const STATIC_SOCIAL = {
  whatsapp: { url: `https://wa.me/YOUR_WHATSAPP_NUMBER_HERE`, label: "Chat on WhatsApp" },
  facebook: { url: "https://www.facebook.com/yourpage",       label: "Follow on Facebook" },
  instagram: { url: "https://www.instagram.com/buildigoo/",   label: "@buildigoo" },
  linkedin:  { url: "https://www.linkedin.com/in/buildigo-technologies-7015663b0/", label: "Buildigo Technologies" },
  twitter:   { url: "https://x.com/buildigo",                 label: "@buildigo" },
};
// ──────────────────────────────────────────────────────────────────────────────

const AVATAR_SIZE = 110;
const AVATAR_OVERHANG = AVATAR_SIZE / 2;

// ── Helpers ────────────────────────────────────────────────────────────────────
function getInitials(name = "") {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "?";
}

function normaliseUrl(raw) {
  if (!raw?.trim()) return null;
  const s = raw.trim();
  return s.startsWith("http://") || s.startsWith("https://") ? s : `https://${s}`;
}

// ── CopyButton ─────────────────────────────────────────────────────────────────
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={handle}
      style={{
        marginTop: 4,
        fontSize: 11,
        padding: "2px 12px",
        borderRadius: 20,
        background: "#e0e7ff",
        color: "#01000e",
        fontWeight: 600,
        border: "none",
        cursor: "pointer",
        display: "inline-block",
      }}
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}

// ── ContactRow ─────────────────────────────────────────────────────────────────
// `value` is the display text shown under the label — NOT necessarily the href.
function ContactRow({ icon, label, value, href, extra, iconBg = "#f3f4f6" }) {
  const inner = (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "13px 16px",
      borderBottom: "1px solid #f3f4f6",
    }}>
      <div style={{
        width: 42,
        height: 42,
        borderRadius: "50%",
        background: iconBg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, color: "#111827", fontSize: 14, lineHeight: "1.3" }}>{label}</div>
        {value && (
          <div style={{ color: "#6b7280", fontSize: 13, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {value}
          </div>
        )}
        {extra}
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        style={{ display: "block", textDecoration: "none", color: "inherit" }}
        target={href.startsWith("tel:") || href.startsWith("mailto:") ? "_self" : "_blank"}
        rel="noopener noreferrer"
      >
        {inner}
      </a>
    );
  }
  return inner;
}

// ── SectionTitle ───────────────────────────────────────────────────────────────
function SectionTitle({ children }) {
  return (
    <div style={{ fontWeight: 700, fontSize: 15, color: "#111827", padding: "16px 16px 10px" }}>
      {children}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export function BusinessCard({ form = {}, imageSrc, mode = "preview" }) {
  const [enquiry, setEnquiry] = useState({ email: "", product: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [enquiryError, setEnquiryError] = useState(null);

  const { name = "", designation = "", phone = "", email = "" } = form;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied!");
    }
  };

  const handleAddToContacts = () => {
    const lines = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      name ? `FN:${name}` : null,
      designation ? `TITLE:${designation}` : null,
      form.company ? `ORG:${form.company}` : null,
      phone ? `TEL;TYPE=WORK:${phone}` : null,
      email ? `EMAIL:${email}` : null,
      STATIC_WEBSITE ? `URL:${normaliseUrl(STATIC_WEBSITE)}` : null,
      STATIC_ADDRESS ? `ADR:;;${STATIC_ADDRESS}` : null,
      "END:VCARD",
    ].filter(Boolean);
    const blob = new Blob([lines.join("\n")], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name || "contact"}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleEnquiry = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setEnquiryError(null);
    try {
      await api.submitEnquiry(enquiry);
      setSent(true);
      setEnquiry({ email: "", product: "", subject: "", message: "" });
      setTimeout(() => setSent(false), 5000);
    } catch (err) {
      setEnquiryError(err.message || "Failed to send enquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const card = {
    fontFamily: "Poppins, sans-serif",
    background: "#f4f6fb",
    width: "100%",
    maxWidth: 430,
    margin: "0 auto",
    overflow: "hidden",
    ...(mode === "preview" ? { maxHeight: "90vh", overflowY: "auto", borderRadius: 20 } : {}),
  };

  const section = { background: "#ffffff", marginTop: 8 };

  return (
    <div style={card}>

      {/* ── Banner + Profile ── */}
      <div style={{ position: "relative", height: 200, flexShrink: 0 }}>
        <div style={{ position: "absolute", inset: 0, background: "#1a2c6b", zIndex: 0 }} />
        <img
          src={STATIC_BANNER_IMAGE}
          alt="cover"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block", zIndex: 1 }}
          onError={(e) => { e.target.style.display = "none"; }}
        />
        <div style={{
          position: "absolute",
          left: "50%",
          bottom: 0,
          transform: "translate(-50%, 50%)",
          width: AVATAR_SIZE,
          height: AVATAR_SIZE,
          borderRadius: "50%",
          border: "4px solid #ffffff",
          overflow: "hidden",
          background: "#e5e7eb",
          boxShadow: "0 4px 20px rgba(0,0,0,0.22)",
          zIndex: 10,
        }}>
          {imageSrc ? (
            <img src={imageSrc} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.target.style.display = "none"; }} />
          ) : (
            <div style={{ width: "100%", height: "100%", background: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 700, color: "#fff" }}>
              {getInitials(name)}
            </div>
          )}
        </div>
      </div>

      {/* ── Identity ── */}
      <div style={{ background: "#fff", paddingTop: AVATAR_OVERHANG + 14, paddingBottom: 18, textAlign: "center", borderBottom: "1px solid #f3f4f6" }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>{name || "—"}</div>
        {designation && <div style={{ fontSize: 19, color: "#111827", marginTop: 3 }}>{designation}</div>}
        <div style={{ fontSize: 14, color: "#6b7280", marginTop: 10, padding: "0 20px", lineHeight: 1.6 }}>
          {STATIC_ABOUT}
        </div>
      </div>

      {/* ── Contact Details ── */}
      <div style={section}>

        {/* Add to Contacts */}
        <div onClick={handleAddToContacts} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 16px", borderBottom: "1px solid #f3f4f6", cursor: "pointer" }}>
          <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <UserIcon />
          </div>
          <div style={{ fontWeight: 600, color: "#111827", fontSize: 14 }}>Add To Contacts</div>
        </div>

        {phone && (
          <ContactRow
            icon={<PhoneIcon />}
            label="Call Now"
            value={phone}
            href={`tel:${phone.replace(/\s/g, "")}`}
            iconBg="#f0fdf4"
            extra={<CopyButton text={phone} />}
          />
        )}

        {email && (
          <ContactRow
            icon={<EmailIcon />}
            label="Email"
            value={email}
            href={`mailto:${email}`}
            iconBg="#eff6ff"
          />
        )}

        <ContactRow
          icon={<GlobeIcon />}
          label="Website"
          value={STATIC_WEBSITE}
          href={normaliseUrl(STATIC_WEBSITE)}
          iconBg="#f9fafb"
        />

        {/* Share */}
        <div onClick={handleShare} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 16px", borderBottom: "1px solid #f3f4f6", cursor: "pointer" }}>
          <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <ShareIcon />
          </div>
          <div style={{ fontWeight: 600, color: "#111827", fontSize: 14 }}>Share</div>
        </div>

        {/* Social rows — value shows clean label, href is the actual URL */}
        <ContactRow
          icon={<WhatsAppIcon />}
          label="WhatsApp"
          value={STATIC_SOCIAL.whatsapp.label}
          href={STATIC_SOCIAL.whatsapp.url}
          iconBg="#f0fdf4"
        />

        <ContactRow
          icon={<FacebookIcon />}
          label="Facebook"
          value={STATIC_SOCIAL.facebook.label}
          href={STATIC_SOCIAL.facebook.url}
          iconBg="#eff6ff"
        />

        <ContactRow
          icon={<InstagramIcon />}
          label="Instagram"
          value={STATIC_SOCIAL.instagram.label}
          href={STATIC_SOCIAL.instagram.url}
          iconBg="#fdf2f8"
        />

        <ContactRow
          icon={<LinkedInIcon />}
          label="LinkedIn"
          value={STATIC_SOCIAL.linkedin.label}
          href={STATIC_SOCIAL.linkedin.url}
          iconBg="#eff6ff"
        />

        <ContactRow
          icon={<img src="/X.svg" width={20} height={20} alt="Twitter" />}
          label="Twitter"
          value={STATIC_SOCIAL.twitter.label}
          href={STATIC_SOCIAL.twitter.url}
          iconBg="#f9fafb"
        />
      </div>

      {/* ── Static Address ── */}
      <div style={section}>
        <SectionTitle>Address</SectionTitle>
        <p style={{ fontSize: 13, color: "#111827", lineHeight: 1.6, padding: "0 16px 12px" }}>
          {STATIC_ADDRESS}
        </p>
        <div style={{ padding: "0 16px 12px" }}>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(STATIC_ADDRESS)}`}
            target="_blank"
            rel="noreferrer noopener"
            style={{ display: "block", width: "100%", padding: "10px 0", textAlign: "center", color: "#111827", border: "1.5px solid #111827", borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: "none", boxSizing: "border-box" }}
          >
            Direction
          </a>
        </div>
        <div style={{ margin: "0 16px 16px", borderRadius: 8, overflow: "hidden" }}>
          <iframe
            title="map"
            width="100%"
            height="180"
            style={{ border: 0, display: "block" }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(STATIC_ADDRESS)}&output=embed`}
          />
        </div>
      </div>

      {/* ── Contact Us Form ── */}
      <div style={section}>
        <SectionTitle>Contact Us</SectionTitle>
        <div style={{ padding: "0 16px 20px" }}>
          {sent ? (
            <div style={{ padding: 16, background: "#f0fdf4", color: "#15803d", borderRadius: 8, textAlign: "center", fontWeight: 600, fontSize: 14 }}>
              ✓ Enquiry sent! We&apos;ll contact you soon.
            </div>
          ) : (
            <form onSubmit={handleEnquiry} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {enquiryError && (
                <div style={{ padding: "10px 12px", background: "#fef2f2", color: "#b91c1c", borderRadius: 8, fontSize: 13 }}>
                  {enquiryError}
                </div>
              )}
              <input type="email" placeholder="Email*" value={enquiry.email} onChange={(e) => setEnquiry((f) => ({ ...f, email: e.target.value }))} required style={inputStyle} />
              <select value={enquiry.product} onChange={(e) => setEnquiry((f) => ({ ...f, product: e.target.value }))} style={inputStyle}>
                <option value="">Product</option>
                <option>Glass Panels</option>
                <option>Window Glass</option>
                <option>Door Glass</option>
                <option>Digital Printed Glass</option>
                <option>Other</option>
              </select>
              <input type="text" placeholder="Subject*" value={enquiry.subject} onChange={(e) => setEnquiry((f) => ({ ...f, subject: e.target.value }))} required style={inputStyle} />
              <textarea placeholder="Message*" value={enquiry.message} onChange={(e) => setEnquiry((f) => ({ ...f, message: e.target.value }))} required rows={4} style={{ ...inputStyle, resize: "vertical", minHeight: 90 }} />
              <button
                type="submit"
                disabled={submitting}
                style={{ width: "100%", padding: "14px 0", background: submitting ? "#6b7280" : "#1a2c6b", color: "#fff", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: submitting ? "not-allowed" : "pointer", marginTop: 4, fontFamily: "inherit" }}
              >
                {submitting ? "Sending…" : "Send Enquiry"}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{ background: "#fff", marginTop: 8, padding: "16px 0", textAlign: "center", fontSize: 12, color: "#9ca3af" }}>
        Crafted with care by{" "}
        <a href="https://buildigo.in" target="_blank" rel="noopener noreferrer" style={{ color: "#111827", fontWeight: 600, textDecoration: "none" }}>
          Buildigo Technology
        </a>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  border: "1px solid #e5e7eb",
  borderRadius: 8,
  fontSize: 14,
  color: "#374151",
  background: "#fff",
  outline: "none",
  fontFamily: "Poppins, sans-serif",
  boxSizing: "border-box",
};