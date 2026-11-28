import TextField, { type TextFieldProps } from "./TextField";

export default function EmailField({
  label = "Email address",
  ...props
}: Partial<TextFieldProps>) {
  return <TextField label={label} type="email" autoComplete="email" {...props} />;
}
