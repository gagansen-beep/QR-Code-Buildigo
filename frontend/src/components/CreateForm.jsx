import { useState, useRef } from 'react';
import { useToast } from '../Toast.jsx';
import { validateForm, EMPTY_FORM } from '../utils.js';

// ── Shared Field wrapper ───────────────────────────────────────────────────────
function Field({ label, error, hint, children }) {
  return (
    <div className="field">
      {label && <label className="field-label">{label}</label>}
      {children}
      {error && <span className="field-error">{error}</span>}
      {hint  && <span className="field-hint">{hint}</span>}
    </div>
  );
}

// ── Section label ─────────────────────────────────────────────────────────────
function SectionLabel({ n, label }) {
  return (
    <div className="section-label">
      <div className="section-num">{n}</div>
      {label}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function CreateForm({
  navigate,
  initialData,
  imageFile:    initFile    = null,
  imagePreview: initPreview = null,
  cardId        = null,
}) {
  const toast  = useToast();
  const isEdit = Boolean(cardId);

  const [form,         setForm]         = useState({ ...EMPTY_FORM, ...initialData });
  const [imageFile,    setImageFile]    = useState(initFile);
  const [imagePreview, setImagePreview] = useState(initPreview);
  const [errors,       setErrors]       = useState({});
  const fileRef = useRef();

  const setField = (key) => (e) => {
    const val = e.target.value;
    setForm((f) => ({ ...f, [key]: val }));
    if (errors[key]) setErrors((prev) => { const { [key]: _, ...rest } = prev; return rest; });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setImageFile(null);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleGenerate = () => {
    const errs = validateForm(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      toast.error('Please fix the highlighted errors');
      return;
    }
    navigate('preview', { form, imageFile, imagePreview, cardId });
  };

  const handleBack = () => navigate('home');

  return (
    <div className="page form-page">
      <header className="page-header">
        <button className="back-btn" onClick={handleBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h2>{isEdit ? 'Edit Card' : 'Create Card'}</h2>
        <div style={{ width: 48 }} />
      </header>

      {/* ── 1. Personal Information ── */}
      <section className="form-section">
        {/* <SectionLabel n="1" label="Personal Information" /> */}

        {/* Avatar upload */}
        <div className="avatar-upload" onClick={() => fileRef.current?.click()}>
          {imagePreview ? (
            <>
              <img src={imagePreview} alt="Profile" className="avatar-img" />
              <button className="avatar-remove" onClick={handleRemoveImage} title="Remove photo">×</button>
            </>
          ) : (
            <div className="avatar-placeholder">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              <span>Upload Photo</span>
            </div>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          hidden
          onChange={handleImage}
        />

        <Field label="Full Name *" error={errors.name}>
          <input
            value={form.name}
            onChange={setField('name')}
            placeholder="David Elson"
            maxLength={100}
            className={errors.name ? 'input-error' : ''}
          />
        </Field>

        <Field label="Job Title / Designation *" error={errors.designation}>
          <input
            value={form.designation}
            onChange={setField('designation')}
            placeholder="Lead Graphic Designer"
            maxLength={100}
            className={errors.designation ? 'input-error' : ''}
          />
        </Field>
      {/* </section> */}

        <Field label="Email Address *" error={errors.email}>
          <input
            value={form.email}
            onChange={setField('email')}
            placeholder="david@example.com"
            type="email"
            className={errors.email ? 'input-error' : ''}
            readOnly={isEdit}
            style={isEdit ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
          />
        </Field>

        <Field label="Phone Number *" error={errors.phone}>
          <input
            value={form.phone}
            onChange={setField('phone')}
            placeholder="+91 0000000000"
            type="tel"
            className={errors.phone ? 'input-error' : ''}
          />
        </Field>

        <Field label="Whatsapp Number *" error={errors.whatsapp}>
          <input
            value={form.whatsapp}
            onChange={setField('whatsapp')}
            placeholder="+91 0000000000"
            type="tel"
            className={errors.whatsapp ? 'input-error' : ''}
          />
        </Field>

        
      </section>

      {/* ── Footer ── */}
      <div className="form-footer">
        <button className="btn btn-primary btn-full" onClick={handleGenerate}>
          {isEdit ? 'Preview Changes →' : 'Generate Preview →'}
        </button>
      </div>
    </div>
  );
}
