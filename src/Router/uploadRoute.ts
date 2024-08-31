import { Router } from "express";
import { uploadController } from "../Controller/upload.controller";
import Multer from "multer";

const router = Router();

const upload = Multer({ storage: Multer.memoryStorage() });

router.route("/upload").post(upload.single("file"), uploadController);

export default router;
