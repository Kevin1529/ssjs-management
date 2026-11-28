import { useId } from "react";
import { cn } from "@/lib/cn";
import FormField from "./FormField";

interface TextAreaFieldProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "className"> {
  label: string;
  hideLabel?: boolean;
  className?: string;
  textareaClassName?: string;
}

export default function TextAreaField({
  label,
  hideLabel,
  className,
  textareaClassName,
  id,
  ...props
}: TextAreaFieldProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;

  return (
    <FormField
      label={label}
      htmlFor={textareaId}
      hideLabel={hideLabel}
      className={className}
    >
      <textarea
        id={textareaId}
        className={cn("input resize-y", textareaClassName)}
        {...props}
      />
    </FormField>
  );
}
