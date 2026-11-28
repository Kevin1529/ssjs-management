import { todayISODate } from "@/lib/date-format";
import TextField, { type TextFieldProps } from "./TextField";

export default function DateOfBirthField({
  label = "Date of birth",
  ...props
}: Partial<TextFieldProps>) {
  return (
    <TextField
      label={label}
      type="date"
      autoComplete="bday"
      max={todayISODate()}
      {...props}
    />
  );
}
