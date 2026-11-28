import { FileText } from "lucide-react";
import SectionCard from "@/components/ui/SectionCard";

interface DocumentsCardProps {
  documents?: string[];
  /** "list" = underlined links; "cards" = bordered tiles with a view hint. */
  variant?: "list" | "cards";
  className?: string;
}

export default function DocumentsCard({
  documents,
  variant = "list",
  className,
}: DocumentsCardProps) {
  return (
    <SectionCard icon={FileText} title="Supporting documents" className={className}>
      {documents?.length ? (
        variant === "cards" ? (
          <ul className="grid gap-3 sm:grid-cols-2">
            {documents.map((url, index) => (
              <li key={`${url}-${index}`}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl border border-line p-4 text-sm text-ink hover:bg-canvas"
                >
                  <span className="flex items-center gap-3">
                    <FileText size={19} aria-hidden="true" />
                    Document {index + 1}
                  </span>
                  <span className="text-xs text-brand-accent">View file ↗</span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="space-y-2">
            {documents.map((url, index) => (
              <li key={`${url}-${index}`}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-ink underline hover:text-brand"
                >
                  <FileText size={16} aria-hidden="true" />
                  Document {index + 1}
                </a>
              </li>
            ))}
          </ul>
        )
      ) : (
        <p className="rounded-xl text-sm text-gray-500">No supporting documents uploaded.</p>
      )}
    </SectionCard>
  );
}
