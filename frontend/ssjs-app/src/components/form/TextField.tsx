import { useId } from "react";
import { cn } from "@/lib/cn";
import FormField from "./FormField";

export interface TextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "className"> {
  label: string;
  hint?: string;
  hideLabel?: boolean;
  /** Class for the wrapper (e.g. grid column span). */
  className?: string;
  /** Extra classes merged onto the `<input>` itself. */
  inputClassName?: string;
}

export default function TextField({
  label,
  hint,
  hideLabel,
  className,
  inputClassName,
  id,
  ...inputProps
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <FormField
      label={label}
      htmlFor={inputId}
      hint={hint}
      hideLabel={hideLabel}
      className={className}
    >
      <input id={inputId} className={cn("input", inputClassName)} {...inputProps} />
    </FormField>
  );
}
