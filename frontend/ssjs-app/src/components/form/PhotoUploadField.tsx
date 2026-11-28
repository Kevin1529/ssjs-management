import { ImagePlus } from "lucide-react";
import { PHOTO_ACCEPT, PHOTO_UPLOAD } from "@/constants/upload";
import ProfilePhoto from "@/components/ui/ProfilePhoto";
import FileInputButton from "./FileInputButton";

interface PhotoUploadFieldProps {
  photoUrl: string;
  uploading: boolean;
  onUpload: (file?: File) => void;
  onRemove: () => void;
}

export default function PhotoUploadField({
  photoUrl,
  uploading,
  onUpload,
  onRemove,
}: PhotoUploadFieldProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <ProfilePhoto
        src={photoUrl}
        alt="Profile preview"
        size={80}
        fallback={<ImagePlus aria-hidden="true" />}
      />

      <div>
        <FileInputButton
          icon={<ImagePlus size={17} />}
          accept={PHOTO_ACCEPT}
          disabled={uploading}
          onFiles={(files) => onUpload(files?.[0])}
        >
          {uploading ? "Uploading..." : photoUrl ? "Change photo" : "Upload photo"}
        </FileInputButton>

        {photoUrl && (
          <button
            type="button"
            onClick={onRemove}
            className="ml-3 text-sm text-red-600 hover:underline"
          >
            Remove
          </button>
        )}
        <p className="mt-2 text-xs text-gray-500">{PHOTO_UPLOAD.hint}</p>
      </div>
    </div>
  );
}
