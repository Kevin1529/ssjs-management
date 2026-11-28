import { OTP_LENGTH, sanitizeOtp } from "@/lib/phone";
import TextField from "./TextField";

interface OtpFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export default function OtpField({ value, onChange }: OtpFieldProps) {
  return (
    <TextField
      label="Verification code"
      inputMode="numeric"
      autoComplete="one-time-code"
      maxLength={OTP_LENGTH}
      value={value}
      onChange={(event) => onChange(sanitizeOtp(event.target.value))}
      placeholder="• • • • • •"
      inputClassName="h-16 text-center text-2xl font-semibold tracking-[0.5em] placeholder:text-gray-300"
    />
  );
}
