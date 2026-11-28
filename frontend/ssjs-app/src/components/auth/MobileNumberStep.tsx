import { ArrowRight } from "lucide-react";
import MobileNumberField from "@/components/form/MobileNumberField";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";

interface MobileNumberStepProps {
  mobileNumber: string;
  onMobileNumberChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
  error: string;
}

export default function MobileNumberStep({
  mobileNumber,
  onMobileNumberChange,
  onSubmit,
  loading,
  error,
}: MobileNumberStepProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="space-y-5"
    >
      <MobileNumberField
        value={mobileNumber}
        onChange={(event) => onMobileNumberChange(event.target.value)}
      />

      {error && <Alert plain>{error}</Alert>}

      <Button
        type="submit"
        size="lg"
        fullWidth
        loading={loading}
        loadingText="Sending code..."
        iconAfter={<ArrowRight size={18} />}
      >
        Continue with OTP
      </Button>
    </form>
  );
}
