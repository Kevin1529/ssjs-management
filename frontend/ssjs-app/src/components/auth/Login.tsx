"use client";

import { ShieldCheck } from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";
import { useOtpLogin } from "@/hooks/useOtpLogin";
import LoginHero from "./LoginHero";
import LoginStepHeader from "./LoginStepHeader";
import MobileNumberStep from "./MobileNumberStep";
import OtpStep from "./OtpStep";

export default function Login() {
  const login = useOtpLogin();

  return (
    <main className="min-h-screen bg-canvas p-3 sm:p-5 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-24px)] max-w-[1440px] overflow-hidden rounded-[28px] bg-white shadow-[0_20px_80px_rgba(23,63,53,0.08)] sm:min-h-[calc(100vh-40px)] lg:min-h-[calc(100vh-64px)] lg:grid-cols-2">
        <LoginHero />

        <section className="flex items-center justify-center px-6 py-12 sm:px-12 lg:px-14 xl:px-20">
          <div className="w-full max-w-md">
            <div className="mb-12 lg:hidden">
              <BrandLogo />
            </div>

            <LoginStepHeader step={login.step} mobileNumber={login.mobileNumber} />

            {login.step === "mobile" ? (
              <MobileNumberStep
                mobileNumber={login.mobileNumber}
                onMobileNumberChange={login.setMobileNumber}
                onSubmit={login.sendOtp}
                loading={login.loading}
                error={login.error}
              />
            ) : (
              <OtpStep
                otp={login.otp}
                onOtpChange={login.setOtp}
                onSubmit={login.verifyOtp}
                onResend={login.sendOtp}
                onChangeNumber={login.changeNumber}
                loading={login.loading}
                message={login.message}
                error={login.error}
              />
            )}

            <div className="mt-10 flex items-center justify-center gap-2 border-t border-line-soft pt-6 text-xs text-gray-400">
              <ShieldCheck size={15} aria-hidden="true" />
              Your information is protected and secure.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
