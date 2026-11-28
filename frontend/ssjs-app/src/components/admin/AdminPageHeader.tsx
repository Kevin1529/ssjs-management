import RefreshButton from "@/components/ui/RefreshButton";

interface AdminPageHeaderProps {
  title: string;
  onRefresh: () => void;
  refreshing?: boolean;
}

export default function AdminPageHeader({ title, onRefresh, refreshing }: AdminPageHeaderProps) {
  return (
    <header className="flex flex-col justify-between gap-4 border-b border-line bg-white px-5 py-5 sm:flex-row sm:items-center sm:px-9">
      <div>
        <p className="text-xs tracking-widest text-brand-muted">ADMINISTRATION</p>
        <h1 className="mt-1 text-xl font-semibold text-brand">{title}</h1>
      </div>
      <RefreshButton onClick={onRefresh} loading={refreshing} />
    </header>
  );
}
