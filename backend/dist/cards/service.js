"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactUsService = exports.CardService = exports.NotFoundError = exports.AuthError = exports.AppError = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const qrcode_1 = __importDefault(require("qrcode"));
const uuid_1 = require("uuid");
const connection_1 = require("../../database/connection");
// ── Static admin credentials ───────────────────────────────────────────────────
const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "admin123";
// ── Custom Errors ─────────────────────────────────────────────────────────────
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = "AppError";
    }
}
exports.AppError = AppError;
class AuthError extends AppError {
    constructor(message = "Invalid credentials") {
        super(message, 401);
        this.name = "AuthError";
    }
}
exports.AuthError = AuthError;
class NotFoundError extends AppError {
    constructor(message = "Not found") {
        super(message, 404);
        this.name = "NotFoundError";
    }
}
exports.NotFoundError = NotFoundError;
// ── Helpers ───────────────────────────────────────────────────────────────────
const BCRYPT_ROUNDS = 12;
function trim(v) {
    return v?.trim() || null;
}
function sanitizePublic(row) {
    const { password_hash: _ph, ...safe } = row;
    return safe;
}
function verifyAdmin(email, password) {
    if (email.trim().toLowerCase() !== ADMIN_EMAIL ||
        password !== ADMIN_PASSWORD) {
        throw new AuthError("Invalid admin credentials");
    }
}
// ── Service ───────────────────────────────────────────────────────────────────
class CardService {
    /** Create a new card. Password is auto-generated server-side (user never logs in). */
    static async create(input, frontendBase) {
        // Auto-generate a random password — users no longer authenticate via login
        const existing = await (0, connection_1.query)(`SELECT id FROM qr_cards WHERE email = $1 LIMIT 1`, [input.email.trim().toLowerCase()]);
        if (existing.rows.length > 0) {
            throw new AppError("Email already registered", 400);
        }
        const autoPassword = (0, uuid_1.v4)();
        const passwordHash = await bcryptjs_1.default.hash(autoPassword, BCRYPT_ROUNDS);
        const result = await (0, connection_1.query)(`INSERT INTO qr_cards
         (name, designation, image_url, email, password_hash, phone,
          whatsapp, website, location, bio, company, facebook, instagram, twitter, linkedin)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
       RETURNING *`, [
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
        ]);
        const card = result.rows[0];
        const qrDataUrl = await qrcode_1.default.toDataURL(`${frontendBase}/card/${card.id}`, {
            width: 300,
            margin: 2,
            color: { dark: "#1a1a2e", light: "#ffffff" },
        });
        await (0, connection_1.query)("UPDATE qr_cards SET qr_code = $1, updated_at = NOW() WHERE id = $2", [qrDataUrl, card.id]);
        card.qr_code = qrDataUrl;
        return sanitizePublic(card);
    }
    /** Public — get all cards with optional email/phone search and pagination. */
    static async publicGetAll(page = 1, limit = 10, search) {
        const offset = (page - 1) * limit;
        const conditions = [];
        const params = [];
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
        const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
        const countResult = await (0, connection_1.query)(`SELECT COUNT(*) FROM qr_cards ${where}`, params);
        const total = Number(countResult.rows[0].count);
        const result = await (0, connection_1.query)(`SELECT * FROM qr_cards ${where} ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`, [...params, limit, offset]);
        return {
            data: result.rows.map(sanitizePublic),
            total,
            page,
            limit,
        };
    }
    static async findById(id) {
        const result = await (0, connection_1.query)("SELECT * FROM qr_cards WHERE id = $1", [id]);
        return result.rows[0] ? sanitizePublic(result.rows[0]) : null;
    }
    /** Public update (no auth) */
    static async publicUpdate(id, input, newImageUrl) {
        const result = await (0, connection_1.query)("SELECT * FROM qr_cards WHERE id = $1", [id]);
        if (!result.rows[0])
            throw new NotFoundError("Card not found");
        const card = result.rows[0];
        const imageUrl = newImageUrl !== undefined ? newImageUrl : card.image_url;
        const updated = await (0, connection_1.query)(`UPDATE qr_cards SET
         name=$1, designation=$2, image_url=$3, phone=$4,
         whatsapp=$5, website=$6, location=$7, bio=$8, company=$9,
         facebook=$10, instagram=$11, twitter=$12, linkedin=$13,
         updated_at=NOW()
       WHERE id=$14
       RETURNING *`, [
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
        ]);
        return sanitizePublic(updated.rows[0]);
    }
    /** Public delete (no auth) */
    static async publicDelete(id) {
        const result = await (0, connection_1.query)("SELECT * FROM qr_cards WHERE id = $1", [id]);
        if (!result.rows[0])
            throw new NotFoundError("Card not found");
        await (0, connection_1.query)("DELETE FROM qr_cards WHERE id = $1", [id]);
    }
}
exports.CardService = CardService;
// ── Service ───────────────────────────────────────────────────────────────────
class contactUsService {
    static async create(input) {
        const result = await (0, connection_1.query)(`INSERT INTO contact_us (email, product, subject, message)
       VALUES ($1, $2, $3, $4)
       RETURNING *`, [
            input.email.trim().toLowerCase(),
            input.product?.trim() || null,
            input.subject.trim(),
            input.message?.trim() || null,
        ]);
        return result.rows[0];
    }
    static async getAll(page = 1, limit = 10, search) {
        const offset = (page - 1) * limit;
        const conditions = [];
        const params = [];
        let idx = 1;
        console.log("page :", page, limit);
        if (search?.email?.trim()) {
            conditions.push(`email ILIKE $${idx}`);
            params.push(`%${search.email.trim()}%`);
            idx++;
        }
        const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
        const countResult = await (0, connection_1.query)(`SELECT COUNT(*) FROM contact_us ${where}`, params);
        const total = Number(countResult.rows[0].count);
        const result = await (0, connection_1.query)(`SELECT * FROM contact_us ${where} ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`, [...params, limit, offset]);
        console.log("result : ", result);
        return { data: result.rows, total, page, limit };
    }
    static async findById(id) {
        const result = await (0, connection_1.query)("SELECT * FROM contact_us WHERE id = $1", [id]);
        return result.rows[0] ?? null;
    }
    static async delete(id) {
        const result = await (0, connection_1.query)("SELECT id FROM contact_us WHERE id = $1", [id]);
        if (!result.rows[0])
            throw new NotFoundError("Contact not found");
        await (0, connection_1.query)("DELETE FROM contact_us WHERE id = $1", [id]);
    }
}
exports.contactUsService = contactUsService;
//# sourceMappingURL=service.js.map