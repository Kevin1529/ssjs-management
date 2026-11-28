import { CheckCircle2, ShieldCheck } from "lucide-react";
import type { LoginStep } from "@/hooks/useOtpLogin";

const content = {
  mobile: {
    Icon: ShieldCheck,
    eyebrow: "WELCOME TO MOSAIC",
    title: "Your community awaits.",
  },
  otp: {
    Icon: CheckCircle2,
    eyebrow: "ONE LAST STEP",
    title: "Verify your number.",
  },
} as const;

export default function LoginStepHeader({
  step,
  mobileNumber,
}: {
  step: LoginStep;
  mobileNumber: string;
}) {
  const { Icon, eyebrow, title } = content[step];

  return (
    <div className="mb-9">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-tint text-brand">
        <Icon size={24} aria-hidden="true" />
      </div>

      <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-brand-muted">{eyebrow}</p>
      <h2 className="text-3xl font-semibold tracking-tight text-ink-strong sm:text-4xl">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-gray-500">
        {step === "mobile"
          ? "Enter your mobile number to get started. We'll send you a one-time verification code."
          : `We've sent a 6-digit verification code to ${mobileNumber}. Enter it below to continue.`}
      </p>
    </div>
  );
}
