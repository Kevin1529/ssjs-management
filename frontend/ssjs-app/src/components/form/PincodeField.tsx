import TextField, { type TextFieldProps } from "./TextField";

export default function PincodeField({
  label = "PIN code",
  ...props
}: Partial<TextFieldProps>) {
  return (
    <TextField
      label={label}
      inputMode="numeric"
      autoComplete="postal-code"
      {...props}
    />
  );
}
