import TextField, { type TextFieldProps } from "./TextField";

export default function PasswordField({
  label = "Password",
  ...props
}: Partial<TextFieldProps>) {
  return (
    <TextField
      label={label}
      type="password"
      autoComplete="current-password"
      {...props}
    />
  );
}
