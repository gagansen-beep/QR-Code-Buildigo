// ── Empty form default values ─────────────────────────────────────────────────
export const EMPTY_FORM = {
  name: '', designation: '',
  email: '',
  phone: '', whatsapp: '',
  website: '', location: '',
  bio: '', company: '',
  facebook: '', instagram: '', twitter: '', linkedin: '',
};


// ── URL helpers ───────────────────────────────────────────────────────────────
export function toLink(raw) {
  if (!raw?.trim()) return null;
  const s = raw.trim();
  if (s.startsWith('http://') || s.startsWith('https://')) return s;
  if (s.includes('.')) return `https://${s}`;
  return null;
}

// ── Date formatting ───────────────────────────────────────────────────────────
export function formatDate(dt) {
  return new Date(dt).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

// ── Convert a saved card object into CreateForm's flat field map ───────────────
export function cardToFormData(card) {
  return {
    name:        card.name        ?? '',
    designation: card.designation ?? '',
    email:       card.email       ?? '',
    phone:       card.phone       ?? '',
    whatsapp:    card.whatsapp    ?? '',
    website:     card.website     ?? '',
    location:    card.location    ?? '',
    bio:         card.bio         ?? '',
    company:     card.company     ?? '',
    facebook:    card.facebook    ?? '',
    instagram:   card.instagram   ?? '',
    twitter:     card.twitter     ?? '',
    linkedin:    card.linkedin    ?? '',
  };
}

// ── Frontend form validation ──────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+\d\s\-().]{7,25}$/;

export function validateForm(form) {
  const errors = {};

  if (!form.name?.trim()) {
    errors.name = 'Full name is required';
  } else if (form.name.trim().length > 100) {
    errors.name = 'Name must be 100 characters or less';
  }

  if (!form.designation?.trim()) {
    errors.designation = 'Job title / designation is required';
  } else if (form.designation.trim().length > 100) {
    errors.designation = 'Designation must be 100 characters or less';
  }

  if (!form.email?.trim()) {
    errors.email = 'Email address is required';
  } else if (!EMAIL_RE.test(form.email.trim())) {
    errors.email = 'Enter a valid email address';
  }

  if (!form.phone?.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!PHONE_RE.test(form.phone.trim())) {
    errors.phone = 'Enter a valid phone number';
  }

  if (!form.whatsapp?.trim()) {
    errors.whatsapp = 'WhatsApp number is required';
  } else if (!PHONE_RE.test(form.whatsapp.trim())) {
    errors.whatsapp = 'Enter a valid WhatsApp number';
  }

  if (form.website?.trim()) {
    const raw = form.website.trim();
    const url = raw.startsWith('http://') || raw.startsWith('https://') ? raw : `https://${raw}`;
    try { new URL(url); } catch { errors.website = 'Enter a valid URL (e.g. https://example.com)'; }
  }

  return errors;
}

export function applyServerErrors(serverErrors, setErrors) {
  if (serverErrors && typeof serverErrors === 'object' && Object.keys(serverErrors).length) {
    setErrors(serverErrors);
    return true;
  }
  return false;
}

// ── Download vCard ────────────────────────────────────────────────────────────
export function downloadVCard(card) {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${card.name || ''}`,
    `N:${card.name || ''};;;`,
    card.designation ? `TITLE:${card.designation}` : '',
    card.company     ? `ORG:${card.company}`        : '',
    card.email       ? `EMAIL:${card.email}`         : '',
    card.phone       ? `TEL:${card.phone}`           : '',
    card.website     ? `URL:${card.website}`         : '',
    card.location    ? `ADR:;;${card.location};;;;`  : '',
    'END:VCARD',
  ].filter(Boolean);

  const blob = new Blob([lines.join('\r\n')], { type: 'text/vcard;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `${(card.name || 'contact').replace(/\s+/g, '_')}.vcf`;
  a.click();
  URL.revokeObjectURL(url);
}
