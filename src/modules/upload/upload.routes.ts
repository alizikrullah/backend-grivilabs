import { Router } from "express";
import multer from "multer";
import { verifyAdminAccessToken } from "../../middlewares/authenticate.middleware.js";
import { uploadFileController } from "./upload.controller.js";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Format file tidak didukung. Gunakan JPG, PNG, WebP, atau GIF."));
    }
  },
});

router.post(
  "/",
  verifyAdminAccessToken,
  upload.single("file"),
  uploadFileController
);

export default router;