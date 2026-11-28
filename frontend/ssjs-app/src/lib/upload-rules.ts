import { DOCUMENT_UPLOAD, PHOTO_UPLOAD } from "@/constants/upload";

type AllowedTypes = readonly string[];

/** Returns an error message, or null when the photo is acceptable. */
export function validatePhoto(file: File): string | null {
  if (!(PHOTO_UPLOAD.types as AllowedTypes).includes(file.type)) {
    return PHOTO_UPLOAD.typeError;
  }
  if (file.size > PHOTO_UPLOAD.maxBytes) return PHOTO_UPLOAD.sizeError;
  return null;
}

/** Returns an error message, or null when every document is acceptable. */
export function validateDocuments(files: File[]): string | null {
  const invalid = files.some(
    (file) =>
      !(DOCUMENT_UPLOAD.types as AllowedTypes).includes(file.type) ||
      file.size > DOCUMENT_UPLOAD.maxBytes,
  );
  return invalid ? DOCUMENT_UPLOAD.error : null;
}
