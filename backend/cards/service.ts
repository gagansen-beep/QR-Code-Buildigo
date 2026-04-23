import bcrypt from "bcryptjs";
import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";
import { query } from "../../database/connection";

// ── Static admin credentials ───────────────────────────────────────────────────
const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "admin123";

// ── Custom Errors ─────────────────────────────────────────────────────────────
export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class AuthError extends AppError {
  constructor(message = "Invalid credentials") {
    super(message, 401);
    this.name = "AuthError";
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not found") {
    super(message, 404);
    this.name = "NotFoundError";
  }
}

// ── Types ─────────────────────────────────────────────────────────────────────
export interface QrCard {
  id: string;
  name: string;
  designation: string | null;
  image_url: string | null;
  email: string;
  phone: string | null;
  whatsapp: string | null;
  website: string | null;
  location: string | null;
  bio: string | null;
  company: string | null;
  facebook: string | null;
  instagram: string | null;
  twitter: string | null;
  linkedin: string | null;
  qr_code: string | null;
  created_at: string;
  updated_at: string;
}

interface QrCardRow extends QrCard {
  password_hash: string;
}

export interface CardCreateInput {
  name: string;
  designation?: string;
  image_url?: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  website?: string;
  location?: string;
  bio?: string;
  company?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
}

export interface CardUpdateInput {
  name: string;
  designation?: string;
  phone?: string;
  whatsapp?: string;
  website?: string;
  location?: string;
  bio?: string;
  company?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const BCRYPT_ROUNDS = 12;

function trim(v: string | undefined | null): string | null {
  return v?.trim() || null;
}

function sanitizePublic(row: QrCardRow): QrCard {
  const { password_hash: _ph, ...safe } = row;
  return safe as QrCard;
}

function verifyAdmin(email: string, password: string): void {
  if (
    email.trim().toLowerCase() !== ADMIN_EMAIL ||
    password !== ADMIN_PASSWORD
  ) {
    throw new AuthError("Invalid admin credentials");
  }
}

// ── Service ───────────────────────────────────────────────────────────────────
export class CardService {
  /** Create a new card. Password is auto-generated server-side (user never logs in). */
  static async create(
    input: CardCreateInput,
    frontendBase: string,
  ): Promise<QrCard> {
    // Auto-generate a random password — users no longer authenticate via login

    const existing = await query(
      `SELECT id FROM qr_cards WHERE email = $1 LIMIT 1`,
      [input.email.trim().toLowerCase()],
    );

    if (existing.rows.length > 0) {
      throw new AppError("Email already registered", 400);
    }
    

    const autoPassword = uuidv4();
    const passwordHash = await bcrypt.hash(autoPassword, BCRYPT_ROUNDS);

    const result = await query<QrCardRow>(
      `INSERT INTO qr_cards
         (name, designation, image_url, email, password_hash, phone,
          whatsapp, website, location, bio, company, facebook, instagram, twitter, linkedin)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
       RETURNING *`,
      [
        input.name.trim(),
        trim(input.designation),
        trim(input.image_url),
        input.email.trim().toLowerCase(),
        passwordHash,
        trim(input.phone),
        trim(input.whatsapp),
        trim(input.website),
        trim(input.location),
        trim(input.bio),
        trim(input.company),
        trim(input.facebook),
        trim(input.instagram),
        trim(input.twitter),
        trim(input.linkedin),
      ],
    );

    const card = result.rows[0];

    const qrDataUrl = await QRCode.toDataURL(
      `${frontendBase}/card/${card.id}`,
      {
        width: 300,
        margin: 2,
        color: { dark: "#1a1a2e", light: "#ffffff" },
      },
    );

    await query(
      "UPDATE qr_cards SET qr_code = $1, updated_at = NOW() WHERE id = $2",
      [qrDataUrl, card.id],
    );

    card.qr_code = qrDataUrl;
    return sanitizePublic(card);
  }

  /** Public — get all cards with optional email/phone search and pagination. */
  static async publicGetAll(
    page = 1,
    limit = 10,
    search?: { email?: string; phone?: string },
  ): Promise<{ data: QrCard[]; total: number; page: number; limit: number }> {
    const offset = (page - 1) * limit;
    const conditions: string[] = [];
    const params: unknown[] = [];
    let idx = 1;

    if (search?.email?.trim()) {
      conditions.push(`email ILIKE $${idx}`);
      params.push(`%${search.email.trim()}%`);
      idx++;
    }

    if (search?.phone?.trim()) {
      conditions.push(`phone ILIKE $${idx}`);
      params.push(`%${search.phone.trim()}%`);
      idx++;
    }

    const where =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const countResult = await query<{ count: string }>(
      `SELECT COUNT(*) FROM qr_cards ${where}`,
      params,
    );
    const total = Number(countResult.rows[0].count);

    const result = await query<QrCardRow>(
      `SELECT * FROM qr_cards ${where} ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`,
      [...params, limit, offset],
    );

    return {
      data: result.rows.map(sanitizePublic),
      total,
      page,
      limit,
    };
  }

  static async findById(id: string): Promise<QrCard | null> {
    const result = await query<QrCardRow>(
      "SELECT * FROM qr_cards WHERE id = $1",
      [id],
    );
    return result.rows[0] ? sanitizePublic(result.rows[0]) : null;
  }

  /** Public update (no auth) */
  static async publicUpdate(
    id: string,
    input: CardUpdateInput,
    newImageUrl?: string,
  ): Promise<QrCard> {
    const result = await query<QrCardRow>(
      "SELECT * FROM qr_cards WHERE id = $1",
      [id],
    );
    if (!result.rows[0]) throw new NotFoundError("Card not found");

    const card = result.rows[0];
    const imageUrl = newImageUrl !== undefined ? newImageUrl : card.image_url;

    const updated = await query<QrCardRow>(
      `UPDATE qr_cards SET
         name=$1, designation=$2, image_url=$3, phone=$4,
         whatsapp=$5, website=$6, location=$7, bio=$8, company=$9,
         facebook=$10, instagram=$11, twitter=$12, linkedin=$13,
         updated_at=NOW()
       WHERE id=$14
       RETURNING *`,
      [
        input.name.trim(),
        trim(input.designation),
        imageUrl,
        trim(input.phone),
        trim(input.whatsapp),
        trim(input.website),
        trim(input.location),
        trim(input.bio),
        trim(input.company),
        trim(input.facebook),
        trim(input.instagram),
        trim(input.twitter),
        trim(input.linkedin),
        id,
      ],
    );

    return sanitizePublic(updated.rows[0]);
  }

  /** Public delete (no auth) */
  static async publicDelete(id: string): Promise<void> {
    const result = await query<QrCardRow>(
      "SELECT * FROM qr_cards WHERE id = $1",
      [id],
    );
    if (!result.rows[0]) throw new NotFoundError("Card not found");
    await query("DELETE FROM qr_cards WHERE id = $1", [id]);
  }
}


// ── Types ─────────────────────────────────────────────────────────────────────
export interface ContactUsInput {
  product?: string;
  subject: string;
  email: string;
  message: string;
}

export interface ContactUs {
  id: string;
  email: string;
  product: string | null;
  subject: string;
  message: string | null;
  created_at: string;
  updated_at: string;
}

// ── Service ───────────────────────────────────────────────────────────────────
export class contactUsService {
  static async create(input: ContactUsInput): Promise<ContactUs> {
    const result = await query<ContactUs>(
      `INSERT INTO contact_us (email, product, subject, message)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        input.email.trim().toLowerCase(),
        input.product?.trim() || null,
        input.subject.trim(),
        input.message?.trim() || null,
      ],
    );
    return result.rows[0];
  }

  static async getAll(
    page = 1,
    limit = 10,
    search?: { email?: string },
  ): Promise<{ data: ContactUs[]; total: number; page: number; limit: number }> {
    const offset = (page - 1) * limit;
    const conditions: string[] = [];
    const params: unknown[] = [];
    let idx = 1;

    console.log("page :",page,limit)
    
    if (search?.email?.trim()) {
      conditions.push(`email ILIKE $${idx}`);
      params.push(`%${search.email.trim()}%`);
      idx++;
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const countResult = await query<{ count: string }>(
      `SELECT COUNT(*) FROM contact_us ${where}`,
      params,
    );
    const total = Number(countResult.rows[0].count);

    const result = await query<ContactUs>(
      `SELECT * FROM contact_us ${where} ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`,
      [...params, limit, offset],
    );
  console.log("result : ",result);
  
    return { data: result.rows, total, page, limit };
  }

  static async findById(id: string): Promise<ContactUs | null> {
    const result = await query<ContactUs>(
      "SELECT * FROM contact_us WHERE id = $1",
      [id],
    );
    return result.rows[0] ?? null;
  }

  static async delete(id: string): Promise<void> {
    const result = await query<ContactUs>(
      "SELECT id FROM contact_us WHERE id = $1",
      [id],
    );
    if (!result.rows[0]) throw new NotFoundError("Contact not found");
    await query("DELETE FROM contact_us WHERE id = $1", [id]);
  }
}

