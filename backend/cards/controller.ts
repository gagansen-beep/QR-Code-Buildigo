import { Response, NextFunction, Request } from "express";
import fs from "fs";
import path from "path";
import { CardService, contactUsService } from "./service";
import {
  validateContactUs,
  validateCreate,
  validateUpdate,
} from "./validation";

// Multer attaches file at runtime
type Req = Request & { file?: Express.Multer.File };

// ── Image helpers ─────────────────────────────────────────────────────────────

/** Delete a newly uploaded file on failure (cleanup). */
function cleanupUpload(file: Express.Multer.File | undefined): void {
  if (file?.path) {
    fs.unlink(file.path, () => {
      /* best effort */
    });
  }
}

/** Delete the old profile image from disk (best effort, never throws). */
function deleteOldImage(imageUrl: string | null | undefined): void {
  if (!imageUrl) return;
  try {
    const filename = path.basename(imageUrl);
    const filePath = path.join(process.cwd(), "uploads", filename);
    fs.unlink(filePath, () => {
      /* best effort */
    });
  } catch {
    // Intentionally silent — old file cleanup is non-critical
  }
}

// ── Controller ────────────────────────────────────────────────────────────────
export class CardController {
  // POST /api/cards
  static async create(
    req: Req,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const errors = validateCreate(req.body);
      if (Object.keys(errors).length) {
        cleanupUpload(req.file);
        res
          .status(422)
          .json({ success: false, message: "Validation failed", errors });
        return;
      }

      const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
      const frontendBase =
        process.env.FRONTEND_URL ||
        `${req.protocol}://${req.hostname}:${process.env.FRONTEND_PORT || 5173}`;

      const { body } = req;
      const card = await CardService.create(
        {
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
        },
        frontendBase,
      );

      res.status(201).json({ success: true, data: card });
    } catch (err) {
      cleanupUpload(req.file);
      next(err);
    }
  }

  // GET /api/cards  (public, paginated, searchable)
  static async publicGetAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const page = Number(req.query.page || 1);
      const limit = Number(req.query.limit || 10);
      const email = req.query.email as string | undefined;
      const phone = req.query.phone as string | undefined;

      const result = await CardService.publicGetAll(page, limit, {
        email,
        phone,
      });
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  // GET /api/cards/:id
  static async getById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const card = await CardService.findById(req.params.id);
      if (!card) {
        res.status(404).json({ success: false, message: "Card not found" });
        return;
      }
      res.json({ success: true, data: card });
    } catch (err) {
      next(err);
    }
  }

  // PUT /api/cards/:id  (public)
  static async update(
    req: Req,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const errors = validateUpdate(req.body);
      if (Object.keys(errors).length) {
        cleanupUpload(req.file);
        res
          .status(422)
          .json({ success: false, message: "Validation failed", errors });
        return;
      }

      const oldCard = await CardService.findById(req.params.id);
      if (!oldCard) {
        cleanupUpload(req.file);
        res.status(404).json({ success: false, message: "Card not found" });
        return;
      }

      const newImageUrl = req.file
        ? `/uploads/${req.file.filename}`
        : undefined;

      try {
        const card = await CardService.publicUpdate(
          req.params.id,
          {
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
          },
          newImageUrl,
        );

        if (newImageUrl && oldCard.image_url) deleteOldImage(oldCard.image_url);

        res.json({ success: true, data: card });
      } catch (err) {
        cleanupUpload(req.file);
        throw err;
      }
    } catch (err) {
      next(err);
    }
  }

  // DELETE /api/cards/:id  (public)
  static async remove(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const oldCard = await CardService.findById(req.params.id);
      if (!oldCard) {
        res.status(404).json({ success: false, message: "Card not found" });
        return;
      }

      await CardService.publicDelete(req.params.id);
      if (oldCard.image_url) deleteOldImage(oldCard.image_url);

      res.json({ success: true, message: "Card deleted successfully" });
    } catch (err) {
      next(err);
    }
  }

  // ── Admin endpoints ────────────────────────────────────────────────────────

  // POST /api/cards/admin/all
  static async adminGetAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
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

      const result = await CardService.adminGetAll(
        email,
        password,
        page,
        limit,
      );
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  // PUT /api/cards/admin/:id
  static async adminUpdate(
    req: Req,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { body } = req;

      if (!body.admin_email || !body.admin_password) {
        cleanupUpload(req.file);
        res
          .status(401)
          .json({ success: false, message: "Admin credentials required" });
        return;
      }

      const errors = validateUpdate(body);
      if (Object.keys(errors).length) {
        cleanupUpload(req.file);
        res
          .status(422)
          .json({ success: false, message: "Validation failed", errors });
        return;
      }

      const oldCard = await CardService.findById(req.params.id);
      if (!oldCard) {
        cleanupUpload(req.file);
        res.status(404).json({ success: false, message: "Card not found" });
        return;
      }

      const newImageUrl = req.file
        ? `/uploads/${req.file.filename}`
        : undefined;

      try {
        const card = await CardService.adminUpdate(
          body.admin_email,
          body.admin_password,
          req.params.id,
          {
            name: body.name,
            designation: body.designation,
            phone: body.phone,
            website: body.website,
            location: body.location,
          },
          newImageUrl,
        );

        if (newImageUrl && oldCard.image_url) {
          deleteOldImage(oldCard.image_url);
        }

        res.json({ success: true, data: card });
      } catch (err) {
        cleanupUpload(req.file);
        throw err;
      }
    } catch (err) {
      next(err);
    }
  }

  // DELETE /api/cards/admin/:id
  static async adminRemove(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { admin_email, admin_password } = req.body;
      if (!admin_email || !admin_password) {
        res
          .status(401)
          .json({ success: false, message: "Admin credentials required" });
        return;
      }

      const oldCard = await CardService.findById(req.params.id);
      await CardService.adminDelete(admin_email, admin_password, req.params.id);

      if (oldCard?.image_url) deleteOldImage(oldCard.image_url);

      res.json({ success: true, message: "Card deleted successfully" });
    } catch (err) {
      next(err);
    }
  }
}


export class ContactController {
  // POST /api/cards/contact/create
  static async createContact(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const errors = validateContactUs(req.body);
      if (Object.keys(errors).length) {
        res.status(422).json({ success: false, message: "Validation failed", errors });
        return;
      }

      const { body } = req;
      const contact = await contactUsService.create({
        product: body.product,
        subject: body.subject,
        email: body.email,
        message: body.message,
      });

      res.status(201).json({ success: true, data: contact });
    } catch (err) {
      next(err);
    }
  }

  // GET /api/cards/contact
  static async getAllContact(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const page = Number(req.query.page || 1);
      const limit = Number(req.query.limit || 10);
      const email = req.query.email as string | undefined;

      const result = await contactUsService.getAll(page, limit, { email });
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  // GET /api/cards/contact/:id
  static async getByIdContact(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const contact = await contactUsService.findById(req.params.id);
      if (!contact) {
        res.status(404).json({ success: false, message: "Contact not found" });
        return;
      }
      res.json({ success: true, data: contact });
    } catch (err) {
      next(err);
    }
  }

  // DELETE /api/cards/contact/:id
  static async deleteContact(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      await contactUsService.delete(req.params.id);
      res.json({ success: true, message: "Contact deleted successfully" });
    } catch (err) {
      next(err);
    }
  }
}
