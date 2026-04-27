"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cardRoutes = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const controller_1 = require("./controller");
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, path_1.default.join(process.cwd(), 'uploads')),
    filename: (_req, file, cb) => {
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        cb(null, `${(0, uuid_1.v4)()}${ext}`);
    },
});
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: (_req, file, cb) => {
        const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        if (allowed.includes(path_1.default.extname(file.originalname).toLowerCase())) {
            cb(null, true);
        }
        else {
            cb(new Error('Only image files (jpg, jpeg, png, gif, webp) are allowed'));
        }
    },
});
const router = (0, express_1.Router)();
exports.cardRoutes = router;
// Admin routes (must come before /:id to avoid param capture)
router.post('/admin/all', controller_1.CardController.adminGetAll);
router.put('/admin/:id', upload.single('image'), controller_1.CardController.adminUpdate);
router.delete('/admin/:id', controller_1.CardController.adminRemove);
// Contact routes (must come before /:id to avoid param capture)
router.post('/contact/create', controller_1.ContactController.createContact);
router.get('/contact', controller_1.ContactController.getAllContact);
router.put('/contact/:id', controller_1.ContactController.getByIdContact);
router.delete('/contact/:id', controller_1.ContactController.deleteContact);
// Public card routes
router.get('/', controller_1.CardController.publicGetAll);
router.post('/', upload.single('image'), controller_1.CardController.create);
router.get('/:id', controller_1.CardController.getById);
router.put('/:id', upload.single('image'), controller_1.CardController.update);
router.delete('/:id', controller_1.CardController.remove);
//# sourceMappingURL=routes.js.map