interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <section>
      <h2 className="mb-5 text-lg font-semibold text-brand">{title}</h2>
      {description && <p className="-mt-3 mb-5 text-sm text-gray-500">{description}</p>}
      {children}
    </section>
  );
}
