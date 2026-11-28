import { ArrowLeft, ArrowRight } from "lucide-react";
import OtpField from "@/components/form/OtpField";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";

interface OtpStepProps {
  otp: string;
  onOtpChange: (value: string) => void;
  onSubmit: () => void;
  onResend: () => void;
  onChangeNumber: () => void;
  loading: boolean;
  message: string;
  error: string;
}

export default function OtpStep({
  otp,
  onOtpChange,
  onSubmit,
  onResend,
  onChangeNumber,
  loading,
  message,
  error,
}: OtpStepProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="space-y-5"
    >
      <OtpField value={otp} onChange={onOtpChange} />

      {message && (
        <Alert tone="success" plain>
          {message}
        </Alert>
      )}
      {error && <Alert plain>{error}</Alert>}

      <Button
        type="submit"
        size="lg"
        fullWidth
        loading={loading}
        loadingText="Verifying..."
        iconAfter={<ArrowRight size={18} />}
      >
        Verify and continue
      </Button>

      <Button
        variant="link"
        fullWidth
        className="py-2"
        onClick={onChangeNumber}
        icon={<ArrowLeft size={16} />}
      >
        Change mobile number
      </Button>

      <button
        type="button"
        onClick={onResend}
        disabled={loading}
        className="w-full text-center text-sm text-gray-500 hover:text-brand disabled:opacity-50"
      >
        Didn&apos;t receive a code? Resend OTP
      </button>
    </form>
  );
}
