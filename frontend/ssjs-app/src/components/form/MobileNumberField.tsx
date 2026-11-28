import TextField, { type TextFieldProps } from "./TextField";

export default function MobileNumberField({
  label = "Mobile number",
  ...props
}: Partial<TextFieldProps>) {
  return (
    <TextField
      label={label}
      type="tel"
      autoComplete="tel"
      placeholder="+91 9876543210"
      hint="Include your country code, for example +91 for India."
      inputClassName="h-14 text-base"
      {...props}
    />
  );
}
