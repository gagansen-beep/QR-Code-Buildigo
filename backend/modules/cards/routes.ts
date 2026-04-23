import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { CardController, ContactController } from './controller';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(process.cwd(), 'uploads')),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    if (allowed.includes(path.extname(file.originalname).toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (jpg, jpeg, png, gif, webp) are allowed'));
    }
  },
});

const router = Router();

// Admin routes (must come before /:id to avoid param capture)
router.post('/admin/all',          CardController.adminGetAll);
router.put('/admin/:id',  upload.single('image'), CardController.adminUpdate);
router.delete('/admin/:id',        CardController.adminRemove);

// Public routes
router.get('/',        CardController.publicGetAll);
router.post('/',       upload.single('image'), CardController.create);
router.get('/:id',     CardController.getById);
router.put('/:id',     upload.single('image'), CardController.update);
router.delete('/:id',  CardController.remove);

router.post('/contact/create',ContactController.createContact);
router.get('/contact/',ContactController.getAllContact);
router.put('/contact/:id',ContactController.getByIdContact);
router.delete('/contact/:id',ContactController.deleteContact);


export { router as cardRoutes };
