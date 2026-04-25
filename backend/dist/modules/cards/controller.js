"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactController = exports.CardController = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const service_1 = require("./service");
const validation_1 = require("./validation");
// ── Image helpers ─────────────────────────────────────────────────────────────
/** Delete a newly uploaded file on failure (cleanup). */
function cleanupUpload(file) {
    if (file?.path) {
        fs_1.default.unlink(file.path, () => {
            /* best effort */
        });
    }
}
/** Delete the old profile image from disk (best effort, never throws). */
function deleteOldImage(imageUrl) {
    if (!imageUrl)
        return;
    try {
        const filename = path_1.default.basename(imageUrl);
        const filePath = path_1.default.join(process.cwd(), "uploads", filename);
        fs_1.default.unlink(filePath, () => {
            /* best effort */
        });
    }
    catch {
        // Intentionally silent — old file cleanup is non-critical
    }
}
// ── Controller ────────────────────────────────────────────────────────────────
class CardController {
    // POST /api/cards
    static async create(req, res, next) {
        try {
            const errors = (0, validation_1.validateCreate)(req.body);
            if (Object.keys(errors).length) {
                cleanupUpload(req.file);
                res
                    .status(422)
                    .json({ success: false, message: "Validation failed", errors });
                return;
            }
            const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
            const frontendBase = process.env.FRONTEND_URL ||
                `${req.protocol}://${req.hostname}:${process.env.FRONTEND_PORT || 5173}`;
            const { body } = req;
            const card = await service_1.CardService.create({
                name: body.name,
                designation: body.designation,
                image_url: imageUrl,
                email: body.email,
                phone: body.phone,
                whatsapp: body.whatsapp,
                website: body.website,
                location: body.location,
                bio: body.bio,
                company: body.company,
                facebook: body.facebook,
                instagram: body.instagram,
                twitter: body.twitter,
                linkedin: body.linkedin,
            }, frontendBase);
            res.status(201).json({ success: true, data: card });
        }
        catch (err) {
            cleanupUpload(req.file);
            next(err);
        }
    }
    // GET /api/cards  (public, paginated, searchable)
    static async publicGetAll(req, res, next) {
        try {
            const page = Number(req.query.page || 1);
            const limit = Number(req.query.limit || 10);
            const email = req.query.email;
            const phone = req.query.phone;
            const result = await service_1.CardService.publicGetAll(page, limit, {
                email,
                phone,
            });
            res.json({ success: true, ...result });
        }
        catch (err) {
            next(err);
        }
    }
    // GET /api/cards/:id
    static async getById(req, res, next) {
        try {
            const card = await service_1.CardService.findById(String(req.params.id));
            if (!card) {
                res.status(404).json({ success: false, message: "Card not found" });
                return;
            }
            res.json({ success: true, data: card });
        }
        catch (err) {
            next(err);
        }
    }
    // PUT /api/cards/:id  (public)
    static async update(req, res, next) {
        try {
            const errors = (0, validation_1.validateUpdate)(req.body);
            if (Object.keys(errors).length) {
                cleanupUpload(req.file);
                res
                    .status(422)
                    .json({ success: false, message: "Validation failed", errors });
                return;
            }
            const oldCard = await service_1.CardService.findById(String(req.params.id));
            if (!oldCard) {
                cleanupUpload(req.file);
                res.status(404).json({ success: false, message: "Card not found" });
                return;
            }
            const newImageUrl = req.file
                ? `/uploads/${req.file.filename}`
                : undefined;
            try {
                const card = await service_1.CardService.publicUpdate(String(req.params.id), {
                    name: req.body.name,
                    designation: req.body.designation,
                    phone: req.body.phone,
                    whatsapp: req.body.whatsapp,
                    website: req.body.website,
                    location: req.body.location,
                    bio: req.body.bio,
                    company: req.body.company,
                    facebook: req.body.facebook,
                    instagram: req.body.instagram,
                    twitter: req.body.twitter,
                    linkedin: req.body.linkedin,
                }, newImageUrl);
                if (newImageUrl && oldCard.image_url)
                    deleteOldImage(oldCard.image_url);
                res.json({ success: true, data: card });
            }
            catch (err) {
                cleanupUpload(req.file);
                throw err;
            }
        }
        catch (err) {
            next(err);
        }
    }
    // DELETE /api/cards/:id  (public)
    static async remove(req, res, next) {
        try {
            const oldCard = await service_1.CardService.findById(String(req.params.id));
            if (!oldCard) {
                res.status(404).json({ success: false, message: "Card not found" });
                return;
            }
            await service_1.CardService.publicDelete(String(req.params.id));
            if (oldCard.image_url)
                deleteOldImage(oldCard.image_url);
            res.json({ success: true, message: "Card deleted successfully" });
        }
        catch (err) {
            next(err);
        }
    }
    // ── Admin endpoints ────────────────────────────────────────────────────────
    // POST /api/cards/admin/all
    static async adminGetAll(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res
                    .status(401)
                    .json({ success: false, message: "Admin credentials required" });
                return;
            }
            const page = Number(req.query.page || 1);
            const limit = Number(req.query.limit || 10);
            const result = await service_1.CardService.adminGetAll(email, password, page, limit);
            res.json({ success: true, ...result });
        }
        catch (err) {
            next(err);
        }
    }
    // PUT /api/cards/admin/:id
    static async adminUpdate(req, res, next) {
        try {
            const { body } = req;
            if (!body.admin_email || !body.admin_password) {
                cleanupUpload(req.file);
                res
                    .status(401)
                    .json({ success: false, message: "Admin credentials required" });
                return;
            }
            const errors = (0, validation_1.validateUpdate)(body);
            if (Object.keys(errors).length) {
                cleanupUpload(req.file);
                res
                    .status(422)
                    .json({ success: false, message: "Validation failed", errors });
                return;
            }
            const oldCard = await service_1.CardService.findById(String(req.params.id));
            if (!oldCard) {
                cleanupUpload(req.file);
                res.status(404).json({ success: false, message: "Card not found" });
                return;
            }
            const newImageUrl = req.file
                ? `/uploads/${req.file.filename}`
                : undefined;
            try {
                const card = await service_1.CardService.adminUpdate(body.admin_email, body.admin_password, String(req.params.id), {
                    name: body.name,
                    designation: body.designation,
                    phone: body.phone,
                    website: body.website,
                    location: body.location,
                }, newImageUrl);
                if (newImageUrl && oldCard.image_url) {
                    deleteOldImage(oldCard.image_url);
                }
                res.json({ success: true, data: card });
            }
            catch (err) {
                cleanupUpload(req.file);
                throw err;
            }
        }
        catch (err) {
            next(err);
        }
    }
    // DELETE /api/cards/admin/:id
    static async adminRemove(req, res, next) {
        try {
            const { admin_email, admin_password } = req.body;
            if (!admin_email || !admin_password) {
                res
                    .status(401)
                    .json({ success: false, message: "Admin credentials required" });
                return;
            }
            const oldCard = await service_1.CardService.findById(String(req.params.id));
            await service_1.CardService.adminDelete(admin_email, admin_password, String(req.params.id));
            if (oldCard?.image_url)
                deleteOldImage(oldCard.image_url);
            res.json({ success: true, message: "Card deleted successfully" });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.CardController = CardController;
class ContactController {
    // POST /api/cards/contact/create
    static async createContact(req, res, next) {
        try {
            const errors = (0, validation_1.validateContactUs)(req.body);
            if (Object.keys(errors).length) {
                res.status(422).json({ success: false, message: "Validation failed", errors });
                return;
            }
            const { body } = req;
            const contact = await service_1.contactUsService.create({
                product: body.product,
                subject: body.subject,
                email: body.email,
                message: body.message,
            });
            res.status(201).json({ success: true, data: contact });
        }
        catch (err) {
            next(err);
        }
    }
    // GET /api/cards/contact
    static async getAllContact(req, res, next) {
        try {
            const page = Number(req.query.page || 1);
            const limit = Number(req.query.limit || 10);
            const email = req.query.email;
            const result = await service_1.contactUsService.getAll(page, limit, { email });
            res.json({ success: true, ...result });
        }
        catch (err) {
            next(err);
        }
    }
    // GET /api/cards/contact/:id
    static async getByIdContact(req, res, next) {
        try {
            const contact = await service_1.contactUsService.findById(String(req.params.id));
            if (!contact) {
                res.status(404).json({ success: false, message: "Contact not found" });
                return;
            }
            res.json({ success: true, data: contact });
        }
        catch (err) {
            next(err);
        }
    }
    // DELETE /api/cards/contact/:id
    static async deleteContact(req, res, next) {
        try {
            await service_1.contactUsService.delete(String(req.params.id));
            res.json({ success: true, message: "Contact deleted successfully" });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.ContactController = ContactController;
//# sourceMappingURL=controller.js.map