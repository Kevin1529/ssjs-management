import TextField, { type TextFieldProps } from "./TextField";

export default function FullNameField({
  label = "Full name",
  ...props
}: Partial<TextFieldProps>) {
  return (
    <TextField label={label} autoComplete="name" placeholder="Enter your full name" {...props} />
  );
}
