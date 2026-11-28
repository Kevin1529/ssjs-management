import TextAreaField from "./TextAreaField";

interface RejectionReasonFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hideLabel?: boolean;
  className?: string;
}

export default function RejectionReasonField({
  value,
  onChange,
  placeholder = "Explain why this application is being rejected...",
  hideLabel,
  className,
}: RejectionReasonFieldProps) {
  return (
    <TextAreaField
      label="Reason for rejection"
      hideLabel={hideLabel}
      rows={4}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className={className}
      textareaClassName="min-h-28"
    />
  );
}
