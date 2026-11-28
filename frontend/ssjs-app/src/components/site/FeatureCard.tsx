interface FeatureCardProps {
  index: number;
  title: string;
  description: string;
}

export default function FeatureCard({ index, title, description }: FeatureCardProps) {
  return (
    <article className="rounded-3xl border border-line bg-white p-8">
      <span className="text-sm font-semibold tracking-widest text-brand-muted">
        {String(index + 1).padStart(2, "0")}
      </span>
      <h2 className="mt-5 text-xl font-semibold text-ink-strong">{title}</h2>
      <p className="mt-3 leading-7 text-gray-500">{description}</p>
    </article>
  );
}
