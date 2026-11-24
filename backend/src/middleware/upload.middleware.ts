import multer from "multer";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { Request } from "express";

const uploadDirectory = path.resolve(process.cwd(), "uploads");

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadDirectory);
  },
  filename: (_req, file, callback) => {
    const extensionByMimeType: Record<string, string> = {
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "image/webp": ".webp",
      "application/pdf": ".pdf",
    };

    callback(
      null,
      `${randomUUID()}${extensionByMimeType[file.mimetype] || ""}`,
    );
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: multer.FileFilterCallback,
) => {
  const uploadType = req.query.type;

  const photoTypes = ["image/jpeg", "image/png", "image/webp"];
  const documentTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (uploadType === "photo" && !photoTypes.includes(file.mimetype)) {
    return callback(new Error("Profile photo must be JPG, PNG or WEBP."));
  }

  if (uploadType === "document" && !documentTypes.includes(file.mimetype)) {
    return callback(new Error("Documents must be PDF, JPG, PNG or WEBP."));
  }

  if (uploadType !== "photo" && uploadType !== "document") {
    return callback(new Error("Upload type must be photo or document."));
  }

  callback(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB maximum
    files: 1,
  },
});

export default upload;
