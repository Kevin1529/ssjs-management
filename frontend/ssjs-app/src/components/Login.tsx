"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  LoaderCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import { setActiveRole } from "@/lib/active-role";
import { userService } from "@/services/user.service";

export default function Login() {
  const router = useRouter();

  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [mobileNumber, setMobileNumber] = useState("+91");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const sendOtp = async () => {
    setError("");
    setMessage("");

    // Accept a number with or without spaces.
    const cleanedNumber = mobileNumber.replace(/[\s-]/g, "");

    if (!/^\+[1-9]\d{7,14}$/.test(cleanedNumber)) {
      setError(
        "Enter a valid mobile number with country code, e.g. +919876543210.",
      );
      return;
    }

    setLoading(true);

    try {
      await apiRequest("/auth/send-otp", {
        method: "POST",
        body: JSON.stringify({ mobileNumber: cleanedNumber }),
      });

      setMobileNumber(cleanedNumber);
      setStep("otp");
      setMessage("Your verification code has been sent.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setError("");
    setMessage("");

    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    setLoading(true);

    try {
      await apiRequest("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({
          mobileNumber,
          otp,
        }),
      });

      // The backend sets the HttpOnly userToken cookie.
      setActiveRole("user");
      setStep("mobile");
      setMobileNumber("+91");
      setOtp("");
      setMessage("");
      const response = await userService.getMyProfile();
      router.push(
        response.profile.status === "APPROVED"
          ? "/dashboard"
          : "/account-settings",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F6F5EF] p-3 sm:p-5 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-24px)] max-w-[1440px] overflow-hidden rounded-[28px] bg-white shadow-[0_20px_80px_rgba(23,63,53,0.08)] lg:grid-cols-2 sm:min-h-[calc(100vh-40px)] lg:min-h-[calc(100vh-64px)]">
        {/* Left: Illustration panel */}
        <section className="relative hidden flex-col justify-between overflow-hidden bg-[#173F35] p-10 text-white lg:flex xl:p-14">
          <div className="absolute -right-28 -top-28 h-96 w-96 rounded-full border border-white/10" />
          <div className="absolute -bottom-36 -left-28 h-[500px] w-[500px] rounded-full border border-white/10" />
          <div className="absolute right-10 top-1/3 h-48 w-48 rounded-full bg-[#D5E6D7]/10 blur-3xl" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D5E6D7] text-[#173F35]">
              <Sparkles size={22} />
            </div>
            <div>
              <p className="text-xl font-semibold tracking-tight">Mosaic</p>
              <p className="text-xs tracking-[0.2em] text-white/60">
                MEMBERSHIP COMMUNITY
              </p>
            </div>
          </div>

          <div className="relative z-10 mx-auto w-full max-w-lg">
            <div className="mb-8">
              <span className="rounded-full border border-white/20 px-4 py-2 text-xs tracking-widest text-[#D5E6D7]">
                YOUR JOURNEY STARTS HERE
              </span>
              <h1 className="mt-7 text-5xl font-medium leading-[1.12] tracking-tight xl:text-6xl">
                Belong to
                <br />
                something
                <br />
                <span className="font-serif italic text-[#D5E6D7]">
                  meaningful.
                </span>
              </h1>
              <p className="mt-6 max-w-sm text-base leading-7 text-white/65">
                One community. Shared experiences. A membership that brings
                people closer together.
              </p>
            </div>

            {/* Original inline illustration */}
            <div className="relative mx-auto max-w-[390px]">
              <svg
                viewBox="0 0 420 300"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full"
                role="img"
                aria-label="Illustration of people connecting through a membership card"
              >
                <ellipse
                  cx="210"
                  cy="267"
                  rx="174"
                  ry="15"
                  fill="#0D3029"
                />

                <circle
                  cx="210"
                  cy="124"
                  r="105"
                  fill="#D5E6D7"
                  fillOpacity=".08"
                />
                <circle
                  cx="210"
                  cy="124"
                  r="78"
                  stroke="#D5E6D7"
                  strokeOpacity=".2"
                  strokeDasharray="5 8"
                />

                {/* Membership card */}
                <rect
                  x="107"
                  y="75"
                  width="206"
                  height="137"
                  rx="17"
                  fill="#F6F5EF"
                  transform="rotate(-7 107 75)"
                />
                <rect
                  x="126"
                  y="98"
                  width="42"
                  height="42"
                  rx="12"
                  fill="#D5E6D7"
                />
                <path
                  d="M139 120L146 127L157 111"
                  stroke="#173F35"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <rect
                  x="179"
                  y="103"
                  width="91"
                  height="8"
                  rx="4"
                  fill="#173F35"
                />
                <rect
                  x="179"
                  y="119"
                  width="65"
                  height="5"
                  rx="2.5"
                  fill="#A6B7A9"
                />
                <rect
                  x="126"
                  y="158"
                  width="139"
                  height="6"
                  rx="3"
                  fill="#D8DED6"
                />
                <rect
                  x="126"
                  y="171"
                  width="93"
                  height="6"
                  rx="3"
                  fill="#D8DED6"
                />
                <circle
                  cx="280"
                  cy="181"
                  r="12"
                  fill="#D8A66C"
                />

                {/* Person on left */}
                <circle
                  cx="74"
                  cy="156"
                  r="19"
                  fill="#D8A66C"
                />
                <path
                  d="M54 155C54 130 91 126 94 154L88 149L57 161Z"
                  fill="#302D29"
                />
                <path
                  d="M45 238C45 199 52 177 74 177C98 177 108 203 108 238"
                  fill="#D8A66C"
                />
                <path
                  d="M45 238C45 204 55 188 74 188C93 188 105 209 105 238"
                  fill="#D5E6D7"
                />
                <path
                  d="M101 206L132 186"
                  stroke="#D8A66C"
                  strokeWidth="12"
                  strokeLinecap="round"
                />

                {/* Person on right */}
                <circle
                  cx="345"
                  cy="153"
                  r="19"
                  fill="#B77E5D"
                />
                <path
                  d="M325 153C325 126 364 128 365 151L359 142L329 160Z"
                  fill="#252C27"
                />
                <path
                  d="M311 238C312 197 325 178 346 178C371 178 380 207 381 238"
                  fill="#A9C6AD"
                />
                <path
                  d="M317 202L287 184"
                  stroke="#B77E5D"
                  strokeWidth="12"
                  strokeLinecap="round"
                />

                {/* Decorative stars */}
                <path
                  d="M67 76L71 87L82 91L71 95L67 106L63 95L52 91L63 87L67 76Z"
                  fill="#D8A66C"
                />
                <path
                  d="M348 65L351 73L359 76L351 79L348 87L345 79L337 76L345 73L348 65Z"
                  fill="#D5E6D7"
                />
                <circle
                  cx="100"
                  cy="105"
                  r="4"
                  fill="#D5E6D7"
                />
                <circle
                  cx="323"
                  cy="109"
                  r="4"
                  fill="#D8A66C"
                />
              </svg>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between text-xs text-white/45">
            <span>© 2026 Mosaic Membership</span>
            <span>Made for belonging.</span>
          </div>
        </section>

        {/* Right: Login panel */}
        <section className="flex items-center justify-center px-6 py-12 sm:px-12 lg:px-14 xl:px-20">
          <div className="w-full max-w-md">
            <div className="mb-12 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#173F35] text-white">
                <Sparkles size={20} />
              </div>
              <div>
                <p className="text-lg font-semibold text-[#173F35]">Mosaic</p>
                <p className="text-[10px] tracking-[0.2em] text-gray-500">
                  MEMBERSHIP COMMUNITY
                </p>
              </div>
            </div>

            <div className="mb-9">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8F0E7] text-[#173F35]">
                {step === "mobile" ? (
                  <ShieldCheck size={24} />
                ) : (
                  <CheckCircle2 size={24} />
                )}
              </div>

              <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-[#78917F]">
                {step === "mobile" ? "WELCOME TO MOSAIC" : "ONE LAST STEP"}
              </p>

              <h2 className="text-3xl font-semibold tracking-tight text-[#193B32] sm:text-4xl">
                {step === "mobile"
                  ? "Your community awaits."
                  : "Verify your number."}
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                {step === "mobile"
                  ? "Enter your mobile number to get started. We'll send you a one-time verification code."
                  : `We've sent a 6-digit verification code to ${mobileNumber}. Enter it below to continue.`}
              </p>
            </div>

            {step === "mobile" ? (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  sendOtp();
                }}
                className="space-y-5"
              >
                <div>
                  <label
                    htmlFor="mobileNumber"
                    className="mb-2 block text-sm font-medium text-[#29473D]"
                  >
                    Mobile number
                  </label>
                  <input
                    id="mobileNumber"
                    type="tel"
                    autoComplete="tel"
                    value={mobileNumber}
                    onChange={(event) => setMobileNumber(event.target.value)}
                    placeholder="+91 9876543210"
                    className="h-14 w-full rounded-xl border border-[#E4E9E2] bg-[#FAFBF8] px-4 text-base text-[#193B32] outline-none transition placeholder:text-gray-400 focus:border-[#47765C] focus:ring-4 focus:ring-[#47765C]/10"
                  />
                  <p className="mt-2 text-xs text-gray-400">
                    Include your country code, for example +91 for India.
                  </p>
                </div>

                {error && (
                  <p
                    role="alert"
                    className="text-sm text-red-600"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#173F35] font-medium text-white transition hover:bg-[#245747] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <LoaderCircle
                        className="animate-spin"
                        size={19}
                      />
                      Sending code...
                    </>
                  ) : (
                    <>
                      Continue with OTP
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  verifyOtp();
                }}
                className="space-y-5"
              >
                <div>
                  <label
                    htmlFor="otp"
                    className="mb-2 block text-sm font-medium text-[#29473D]"
                  >
                    Verification code
                  </label>
                  <input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={otp}
                    onChange={(event) =>
                      setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="• • • • • •"
                    className="h-16 w-full rounded-xl border border-[#E4E9E2] bg-[#FAFBF8] px-4 text-center text-2xl font-semibold tracking-[0.5em] text-[#193B32] outline-none transition placeholder:text-gray-300 focus:border-[#47765C] focus:ring-4 focus:ring-[#47765C]/10"
                  />
                </div>

                {message && <p className="text-sm text-[#47765C]">{message}</p>}

                {error && (
                  <p
                    role="alert"
                    className="text-sm text-red-600"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#173F35] font-medium text-white transition hover:bg-[#245747] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <LoaderCircle
                        className="animate-spin"
                        size={19}
                      />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify and continue
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep("mobile");
                    setOtp("");
                    setError("");
                    setMessage("");
                  }}
                  className="flex w-full items-center justify-center gap-2 py-2 text-sm font-medium text-[#47765C] hover:text-[#173F35]"
                >
                  <ArrowLeft size={16} />
                  Change mobile number
                </button>

                <button
                  type="button"
                  onClick={sendOtp}
                  disabled={loading}
                  className="w-full text-center text-sm text-gray-500 hover:text-[#173F35] disabled:opacity-50"
                >
                  Didn't receive a code? Resend OTP
                </button>
              </form>
            )}

            <div className="mt-10 flex items-center justify-center gap-2 border-t border-[#EDF0EA] pt-6 text-xs text-gray-400">
              <ShieldCheck size={15} />
              Your information is protected and secure.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
