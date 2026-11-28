import { ShieldAlert } from "lucide-react";

export default function RejectionNotice({ reason }: { reason: string }) {
  return (
    <section className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6">
      <div className="flex items-center gap-3 text-red-700">
        <ShieldAlert size={20} aria-hidden="true" />
        <h3 className="font-semibold">Rejection reason</h3>
      </div>
      <p className="mt-3 text-sm text-red-800">{reason}</p>
    </section>
  );
}
