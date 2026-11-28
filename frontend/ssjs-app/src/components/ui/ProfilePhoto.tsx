import Image from "next/image";
import { UserRound } from "lucide-react";
import { cn } from "@/lib/cn";

interface ProfilePhotoProps {
  src?: string;
  alt: string;
  /** Pixel size of the square avatar. */
  size?: number;
  fallback?: React.ReactNode;
  className?: string;
}

export default function ProfilePhoto({
  src,
  alt,
  size = 96,
  fallback,
  className,
}: ProfilePhotoProps) {
  return (
    <div
      style={{ width: size, height: size }}
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-brand-tint text-brand",
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={size}
          height={size}
          unoptimized
          className="h-full w-full object-cover"
        />
      ) : (
        (fallback ?? <UserRound size={Math.round(size * 0.42)} />)
      )}
    </div>
  );
}
