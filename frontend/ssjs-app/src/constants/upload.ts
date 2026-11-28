const MB = 1024 * 1024;

export const PHOTO_UPLOAD = {
  types: ["image/jpeg", "image/png", "image/webp"],
  maxBytes: 5 * MB,
  hint: "JPG, PNG or WEBP. Maximum 5 MB.",
  typeError: "Profile photo must be JPG, PNG or WEBP.",
  sizeError: "Profile photo must be 5 MB or smaller.",
} as const;

export const DOCUMENT_UPLOAD = {
  types: ["application/pdf", "image/jpeg", "image/png", "image/webp"],
  maxBytes: 10 * MB,
  hint: "PDF, JPG, PNG or WEBP. Maximum 10 MB per file.",
  error: "Documents must be PDF, JPG, PNG or WEBP and 10 MB or smaller each.",
} as const;

export const PHOTO_ACCEPT = PHOTO_UPLOAD.types.join(",");
export const DOCUMENT_ACCEPT = DOCUMENT_UPLOAD.types.join(",");
