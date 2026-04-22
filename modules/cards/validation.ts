export type ValidationErrors = Record<string, string>

// ── Helpers ──────────────────────────────────────────────────────────────────
function isValidUrl(raw: string): boolean {
  try {
    const url = raw.startsWith('http://') || raw.startsWith('https://') ? raw : `https://${raw}`
    new URL(url)
    return true
  } catch {
    return false
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[+\d\s\-().]{7,25}$/

// ── Validators ────────────────────────────────────────────────────────────────

/** Used when creating a new card — password is auto-generated server-side */
export function validateCreate(body: Record<string, unknown>): ValidationErrors {
  const errors: ValidationErrors = {}

  const name = (body.name as string)?.trim()
  if (!name) errors.name = 'Full name is required'
  else if (name.length > 100) errors.name = 'Name must be 100 characters or less'

  const email = (body.email as string)?.trim()
  if (!email) errors.email = 'Email address is required'
  else if (!EMAIL_RE.test(email)) errors.email = 'Enter a valid email address'

  const designation = (body.designation as string)?.trim()
  if (!designation) errors.designation = 'Job title / designation is required'
  else if (designation.length > 100) errors.designation = 'Designation must be 100 characters or less'

  const phone = (body.phone as string)?.trim()
  if (!phone) errors.phone = 'Phone number is required'
  else if (!PHONE_RE.test(phone)) errors.phone = 'Enter a valid phone number (digits, spaces, + - ( ) allowed)'

  const whatsapp = (body.whatsapp as string)?.trim()
  if (!whatsapp) errors.whatsapp = 'WhatsApp number is required'
  else if (!PHONE_RE.test(whatsapp)) errors.whatsapp = 'Enter a valid WhatsApp number (digits, spaces, + - ( ) allowed)'


  const website = (body.website as string)?.trim()
  if (website && !isValidUrl(website)) errors.website = 'Enter a valid URL (e.g. https://example.com)'

  return errors
}

/** Used when updating an existing card */
export function validateUpdate(body: Record<string, unknown>): ValidationErrors {
  const errors: ValidationErrors = {}

  const name = (body.name as string)?.trim()
  if (!name) errors.name = 'Full name is required'
  else if (name.length > 100) errors.name = 'Name must be 100 characters or less'

  const designation = (body.designation as string)?.trim()
  if (!designation) errors.designation = 'Job title / designation is required'
  else if (designation.length > 100) errors.designation = 'Designation must be 100 characters or less'

  const phone = (body.phone as string)?.trim()
  if (!phone) errors.phone = 'Phone number is required'
  else if (!PHONE_RE.test(phone)) errors.phone = 'Enter a valid phone number'

  const whatsapp = (body.whatsapp as string)?.trim()
  if (!whatsapp) errors.whatsapp = 'WhatsApp number is required'
  else if (!PHONE_RE.test(whatsapp)) errors.whatsapp = 'Enter a valid WhatsApp number'

  const website = (body.website as string)?.trim()
  if (website && !isValidUrl(website)) errors.website = 'Enter a valid URL'

  return errors
}

export function validateContactUs(body: Record<string, unknown>): ValidationErrors {
  const errors: ValidationErrors = {}

  const product = (body.product as string)?.trim()
  if (product && product.length > 100) {
    errors.product = 'Product must be 100 characters or less'
  }

  const email = (body.email as string)?.trim()
  if (!email) errors.email = 'Email address is required'
  else if (!EMAIL_RE.test(email)) errors.email = 'Enter a valid email address'

  const subject = (body.subject as string)?.trim()
  if (!subject) errors.subject = 'Subject is required'
  else if (subject.length > 100) errors.subject = 'Subject must be 100 characters or less'

  const message = (body.message as string)?.trim()
  if (!message) errors.message = 'Message is required'
  else if (message.length > 100) errors.message = 'Message must be 100 characters or less'

  return errors
}