import { FileText, X } from "lucide-react";
import { DOCUMENT_ACCEPT, DOCUMENT_UPLOAD } from "@/constants/upload";
import { getFileName } from "@/lib/format";
import FileInputButton from "./FileInputButton";

interface DocumentsUploadFieldProps {
  documents: string[];
  uploading: boolean;
  onUpload: (files: FileList | null) => void;
  onRemove: (index: number) => void;
}

export default function DocumentsUploadField({
  documents,
  uploading,
  onUpload,
  onRemove,
}: DocumentsUploadFieldProps) {
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-brand">Documents</h2>
        <FileInputButton
          multiple
          icon={<FileText size={17} />}
          accept={DOCUMENT_ACCEPT}
          disabled={uploading}
          onFiles={onUpload}
        >
          {uploading ? "Uploading..." : "Add documents"}
        </FileInputButton>
      </div>

      {documents.length === 0 ? (
        <p className="text-sm text-gray-500">No documents uploaded.</p>
      ) : (
        <ul className="space-y-2">
          {documents.map((url, index) => {
            const name = getFileName(url, `Document ${index + 1}`);

            return (
              <li
                key={`${url}-${index}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-line px-4 py-3"
              >
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-w-0 items-center gap-2 text-sm text-brand-hover hover:underline"
                >
                  <FileText size={17} className="shrink-0" aria-hidden="true" />
                  <span className="truncate">{name}</span>
                </a>
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  aria-label={`Remove ${name}`}
                  className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                >
                  <X size={17} />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <p className="mt-2 text-xs text-gray-500">{DOCUMENT_UPLOAD.hint}</p>
    </div>
  );
}
