import { LoaderCircle } from "lucide-react";

export default function LoadingScreen({ label = "Loading" }: { label?: string }) {
  return (
    <main
      role="status"
      aria-label={label}
      className="flex min-h-screen items-center justify-center bg-canvas"
    >
      <LoaderCircle className="animate-spin text-brand" size={30} />
    </main>
  );
}
