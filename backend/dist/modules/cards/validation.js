"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreate = validateCreate;
exports.validateUpdate = validateUpdate;
exports.validateContactUs = validateContactUs;
// ── Helpers ──────────────────────────────────────────────────────────────────
function isValidUrl(raw) {
    try {
        const url = raw.startsWith('http://') || raw.startsWith('https://') ? raw : `https://${raw}`;
        new URL(url);
        return true;
    }
    catch {
        return false;
    }
}
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+\d\s\-().]{7,25}$/;
// ── Validators ────────────────────────────────────────────────────────────────
/** Used when creating a new card — password is auto-generated server-side */
function validateCreate(body) {
    const errors = {};
    const name = body.name?.trim();
    if (!name)
        errors.name = 'Full name is required';
    else if (name.length > 100)
        errors.name = 'Name must be 100 characters or less';
    const email = body.email?.trim();
    if (!email)
        errors.email = 'Email address is required';
    else if (!EMAIL_RE.test(email))
        errors.email = 'Enter a valid email address';
    const designation = body.designation?.trim();
    if (!designation)
        errors.designation = 'Job title / designation is required';
    else if (designation.length > 100)
        errors.designation = 'Designation must be 100 characters or less';
    const phone = body.phone?.trim();
    if (!phone)
        errors.phone = 'Phone number is required';
    else if (!PHONE_RE.test(phone))
        errors.phone = 'Enter a valid phone number (digits, spaces, + - ( ) allowed)';
    const whatsapp = body.whatsapp?.trim();
    if (!whatsapp)
        errors.whatsapp = 'WhatsApp number is required';
    else if (!PHONE_RE.test(whatsapp))
        errors.whatsapp = 'Enter a valid WhatsApp number (digits, spaces, + - ( ) allowed)';
    const website = body.website?.trim();
    if (website && !isValidUrl(website))
        errors.website = 'Enter a valid URL (e.g. https://example.com)';
    return errors;
}
/** Used when updating an existing card */
function validateUpdate(body) {
    const errors = {};
    const name = body.name?.trim();
    if (!name)
        errors.name = 'Full name is required';
    else if (name.length > 100)
        errors.name = 'Name must be 100 characters or less';
    const designation = body.designation?.trim();
    if (!designation)
        errors.designation = 'Job title / designation is required';
    else if (designation.length > 100)
        errors.designation = 'Designation must be 100 characters or less';
    const phone = body.phone?.trim();
    if (!phone)
        errors.phone = 'Phone number is required';
    else if (!PHONE_RE.test(phone))
        errors.phone = 'Enter a valid phone number';
    const whatsapp = body.whatsapp?.trim();
    if (!whatsapp)
        errors.whatsapp = 'WhatsApp number is required';
    else if (!PHONE_RE.test(whatsapp))
        errors.whatsapp = 'Enter a valid WhatsApp number';
    const website = body.website?.trim();
    if (website && !isValidUrl(website))
        errors.website = 'Enter a valid URL';
    return errors;
}
function validateContactUs(body) {
    const errors = {};
    const product = body.product?.trim();
    if (product && product.length > 100) {
        errors.product = 'Product must be 100 characters or less';
    }
    const email = body.email?.trim();
    if (!email)
        errors.email = 'Email address is required';
    else if (!EMAIL_RE.test(email))
        errors.email = 'Enter a valid email address';
    const subject = body.subject?.trim();
    if (!subject)
        errors.subject = 'Subject is required';
    else if (subject.length > 100)
        errors.subject = 'Subject must be 100 characters or less';
    const message = body.message?.trim();
    if (!message)
        errors.message = 'Message is required';
    else if (message.length > 2000)
        errors.message = 'Message must be 2000 characters or less';
    return errors;
}
//# sourceMappingURL=validation.js.map