"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, FileText, ImagePlus, LoaderCircle, Sparkles, X } from "lucide-react";
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
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingDocuments, setUploadingDocuments] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await userService.getMyProfile();
        const user = response.profile;

        if (!user) return;

        if (user.status === "APPROVED") {
          router.replace("/dashboard");
          return;
        }

        if (user.status === "PENDING_APPROVAL") {
          router.replace("/account-settings");
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

      } catch (err) {
        const message = err instanceof Error ? err.message : "Unable to load your profile.";
        if (/token|session|authentication|unauthorized|login/i.test(message)) {
          router.replace("/");
          return;
        }
        setError(message);
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

  const uploadPhoto = async (file?: File) => {
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Profile photo must be JPG, PNG or WEBP.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Profile photo must be 5 MB or smaller.");
      return;
    }

    setUploadingPhoto(true);
    setError("");

    try {
      const result = await userService.uploadFile(file, "photo");
      setForm((previous) => ({ ...previous, profilePhoto: result.fileUrl }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Photo upload failed.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const uploadDocuments = async (files: FileList | null) => {
    if (!files?.length) return;

    const selectedFiles = Array.from(files);
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    const invalidFile = selectedFiles.find(
      (file) => !allowedTypes.includes(file.type) || file.size > 10 * 1024 * 1024,
    );

    if (invalidFile) {
      setError("Documents must be PDF, JPG, PNG or WEBP and 10 MB or smaller each.");
      return;
    }

    setUploadingDocuments(true);
    setError("");

    try {
      const uploadedUrls: string[] = [];

      for (const file of selectedFiles) {
        const result = await userService.uploadFile(file, "document");
        uploadedUrls.push(result.fileUrl);
      }

      setForm((previous) => ({
        ...previous,
        documents: [...previous.documents, ...uploadedUrls],
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Document upload failed.");
    } finally {
      setUploadingDocuments(false);
    }
  };

  const removeDocument = (url: string) => {
    setForm((previous) => ({
      ...previous,
      documents: previous.documents.filter((document) => document !== url),
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

    setLoading(true);

    try {
      await userService.createProfile({
        ...form,
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        documents: form.documents,
      });

      router.push("/account-settings");
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
                Upload a profile photo and supporting documents. Photos accept
                JPG, PNG or WEBP (up to 5 MB). Documents accept PDF, JPG, PNG
                or WEBP (up to 10 MB each).
              </p>

              <div className="space-y-6">
                <Field label="Profile photo">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    {form.profilePhoto ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={form.profilePhoto}
                        alt="Profile preview"
                        className="h-20 w-20 rounded-2xl border border-[#E4E9E2] object-cover"
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#E8F0E7] text-[#47765C]">
                        <ImagePlus size={28} />
                      </div>
                    )}
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(event) => {
                          void uploadPhoto(event.target.files?.[0]);
                          event.currentTarget.value = "";
                        }}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-[#E8F0E7] file:px-4 file:py-2 file:font-medium file:text-[#173F35]"
                      />
                      {uploadingPhoto && (
                        <p className="mt-2 text-xs text-[#47765C]">Uploading photo...</p>
                      )}
                    </div>
                  </div>
                </Field>

                <Field label="Supporting documents">
                  <input
                    type="file"
                    multiple
                    accept="application/pdf,image/jpeg,image/png,image/webp"
                    onChange={(event) => {
                      void uploadDocuments(event.target.files);
                      event.currentTarget.value = "";
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-[#E8F0E7] file:px-4 file:py-2 file:font-medium file:text-[#173F35]"
                  />
                  {uploadingDocuments && (
                    <p className="mt-2 text-xs text-[#47765C]">Uploading documents...</p>
                  )}

                  {form.documents.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {form.documents.map((url) => (
                        <li
                          key={url}
                          className="flex items-center justify-between gap-3 rounded-xl border border-[#E8EAE2] p-3"
                        >
                          <a
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex min-w-0 items-center gap-2 text-sm text-[#29473D] underline"
                          >
                            <FileText size={17} className="shrink-0" />
                            <span className="truncate">{decodeURIComponent(url.split("/").pop() || "Uploaded document")}</span>
                          </a>
                          <button
                            type="button"
                            onClick={() => removeDocument(url)}
                            aria-label="Remove document"
                            className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                          >
                            <X size={16} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
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
