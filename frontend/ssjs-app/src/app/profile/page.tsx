"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LoaderCircle, Sparkles } from "lucide-react";
import { userService } from "@/services/user.service";
import type { Gender, ProfilePayload } from "@/types/user";

const initialForm: ProfilePayload = {
  fullName: "",
  email: "",
  dateOfBirth: "",
  gender: "MALE",
  address: {
    addressLine: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
  },
  profilePhoto: "",
  documents: [],
};

export default function ProfilePage() {
  const router = useRouter();

  const [form, setForm] = useState<ProfilePayload>(initialForm);
  const [documentUrls, setDocumentUrls] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("userToken");

    if (!token) {
      router.replace("/");
      return;
    }

    const loadProfile = async () => {
      try {
        const response = await userService.getMyProfile();
        const user = response.user;

        if (!user) return;

        if (user.status === "APPROVED" || user.status === "PENDING_APPROVAL") {
          router.replace("/dashboard");
          return;
        }

        setForm({
          fullName: user.fullName || "",
          email: user.email || "",
          dateOfBirth: user.dateOfBirth ? user.dateOfBirth.slice(0, 10) : "",
          gender: user.gender || "MALE",
          address: {
            addressLine: user.address?.addressLine || "",
            city: user.address?.city || "",
            state: user.address?.state || "",
            country: user.address?.country || "India",
            pincode: user.address?.pincode || "",
          },
          profilePhoto: user.profilePhoto || "",
          documents: user.documents || [],
        });

        setDocumentUrls((user.documents || []).join("\n"));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to load your profile.",
        );
      } finally {
        setInitialLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  const updateField = (field: keyof ProfilePayload, value: string) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const updateAddress = (
    field: keyof ProfilePayload["address"],
    value: string,
  ) => {
    setForm((previous) => ({
      ...previous,
      address: {
        ...previous.address,
        [field]: value,
      },
    }));
  };

  const submitProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!form.fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!form.dateOfBirth) {
      setError("Please select your date of birth.");
      return;
    }

    if (!form.address.pincode.trim()) {
      setError("Please enter your PIN code.");
      return;
    }

    const documents = documentUrls
      .split("\n")
      .map((url) => url.trim())
      .filter(Boolean);

    setLoading(true);

    try {
      await userService.createProfile({
        ...form,
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        documents,
      });

      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to submit your profile.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F6F5EF]">
        <LoaderCircle
          className="animate-spin text-[#173F35]"
          size={30}
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F6F5EF] px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#173F35] text-white">
            <Sparkles size={21} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-[#173F35]">Mosaic</h1>
            <p className="text-xs tracking-widest text-gray-500">
              MEMBERSHIP COMMUNITY
            </p>
          </div>
        </header>

        <section className="overflow-hidden rounded-3xl bg-white shadow-[0_15px_60px_rgba(23,63,53,0.07)]">
          <div className="bg-[#173F35] px-6 py-9 text-white sm:px-10">
            <p className="text-xs tracking-[0.2em] text-[#D5E6D7]">
              YOUR MEMBERSHIP JOURNEY
            </p>
            <h2 className="mt-3 text-3xl font-semibold">
              Tell us about yourself.
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/65">
              Complete your profile so we can get to know you better.
            </p>
          </div>

          <form
            onSubmit={submitProfile}
            className="space-y-8 p-6 sm:p-10"
          >
            <section>
              <h3 className="mb-5 text-lg font-semibold text-[#173F35]">
                Personal information
              </h3>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Full name">
                  <input
                    required
                    value={form.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    placeholder="Enter your full name"
                    className="input"
                  />
                </Field>

                <Field label="Email address">
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="you@example.com"
                    className="input"
                  />
                </Field>

                <Field label="Date of birth">
                  <input
                    type="date"
                    required
                    value={form.dateOfBirth}
                    onChange={(e) => updateField("dateOfBirth", e.target.value)}
                    className="input"
                  />
                </Field>

                <Field label="Gender">
                  <select
                    value={form.gender}
                    onChange={(e) =>
                      updateField("gender", e.target.value as Gender)
                    }
                    className="input"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </Field>
              </div>
            </section>

            <div className="h-px bg-[#EDF0EA]" />

            <section>
              <h3 className="mb-5 text-lg font-semibold text-[#173F35]">
                Residential address
              </h3>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field label="Address">
                    <input
                      required
                      value={form.address.addressLine}
                      onChange={(e) =>
                        updateAddress("addressLine", e.target.value)
                      }
                      placeholder="House number, street, area"
                      className="input"
                    />
                  </Field>
                </div>

                <Field label="City">
                  <input
                    required
                    value={form.address.city}
                    onChange={(e) => updateAddress("city", e.target.value)}
                    className="input"
                  />
                </Field>

                <Field label="State">
                  <input
                    required
                    value={form.address.state}
                    onChange={(e) => updateAddress("state", e.target.value)}
                    className="input"
                  />
                </Field>

                <Field label="Country">
                  <input
                    required
                    value={form.address.country}
                    onChange={(e) => updateAddress("country", e.target.value)}
                    className="input"
                  />
                </Field>

                <Field label="PIN code">
                  <input
                    required
                    inputMode="numeric"
                    value={form.address.pincode}
                    onChange={(e) => updateAddress("pincode", e.target.value)}
                    className="input"
                  />
                </Field>
              </div>
            </section>

            <div className="h-px bg-[#EDF0EA]" />

            <section>
              <h3 className="mb-2 text-lg font-semibold text-[#173F35]">
                Profile and documents
              </h3>
              <p className="mb-5 text-sm text-gray-500">
                For this first version, provide accessible URLs. We'll add
                actual file uploads in the next backend integration step.
              </p>

              <div className="space-y-5">
                <Field label="Profile photo URL">
                  <input
                    type="url"
                    value={form.profilePhoto}
                    onChange={(e) =>
                      updateField("profilePhoto", e.target.value)
                    }
                    placeholder="https://example.com/photo.jpg"
                    className="input"
                  />
                </Field>

                <Field label="Document URLs">
                  <textarea
                    rows={3}
                    value={documentUrls}
                    onChange={(e) => setDocumentUrls(e.target.value)}
                    placeholder={"Enter one document URL per line"}
                    className="input resize-y"
                  />
                </Field>
              </div>
            </section>

            {error && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#173F35] font-medium text-white transition hover:bg-[#245747] disabled:opacity-60"
            >
              {loading ? (
                <>
                  <LoaderCircle
                    className="animate-spin"
                    size={19}
                  />
                  Submitting profile...
                </>
              ) : (
                <>
                  Submit for approval
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <p className="text-center text-xs text-gray-400">
              Please review your details before submitting.
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[#29473D]">
        {label}
      </span>
      {children}
    </label>
  );
}
