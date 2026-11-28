"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setActiveRole } from "@/lib/active-role";
import { getErrorMessage } from "@/lib/errors";
import {
  DEFAULT_COUNTRY_CODE,
  isValidMobileNumber,
  isValidOtp,
  normalizeMobileNumber,
} from "@/lib/phone";
import { authService } from "@/services/auth.service";
import { userService } from "@/services/user.service";

export type LoginStep = "mobile" | "otp";

/** Two-step OTP login: send a code, then verify it and route by profile status. */
export function useOtpLogin() {
  const router = useRouter();

  const [step, setStep] = useState<LoginStep>("mobile");
  const [mobileNumber, setMobileNumber] = useState(DEFAULT_COUNTRY_CODE);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const reset = () => {
    setStep("mobile");
    setOtp("");
    setError("");
    setMessage("");
  };

  const sendOtp = async () => {
    setError("");
    setMessage("");

    const cleaned = normalizeMobileNumber(mobileNumber);
    if (!isValidMobileNumber(cleaned)) {
      setError("Enter a valid mobile number with country code, e.g. +919876543210.");
      return;
    }

    setLoading(true);
    try {
      await authService.sendOtp(cleaned);
      setMobileNumber(cleaned);
      setStep("otp");
      setMessage("Your verification code has been sent.");
    } catch (err) {
      setError(getErrorMessage(err, "Something went wrong."));
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setError("");
    setMessage("");

    if (!isValidOtp(otp)) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    setLoading(true);
    try {
      await authService.verifyOtp(mobileNumber, otp);

      // The backend sets the HttpOnly userToken cookie.
      setActiveRole("user");
      reset();
      setMobileNumber(DEFAULT_COUNTRY_CODE);

      const { profile } = await userService.getMyProfile();
      router.push(profile.status === "APPROVED" ? "/dashboard" : "/account-settings");
    } catch (err) {
      setError(getErrorMessage(err, "Something went wrong."));
    } finally {
      setLoading(false);
    }
  };

  return {
    step,
    mobileNumber,
    setMobileNumber,
    otp,
    setOtp,
    loading,
    error,
    message,
    sendOtp,
    verifyOtp,
    changeNumber: reset,
  };
}
