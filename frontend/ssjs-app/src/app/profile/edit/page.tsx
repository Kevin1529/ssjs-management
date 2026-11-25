"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  ImagePlus,
  LoaderCircle,
  Save,
  Sparkles,
  X,
} from "lucide-react";
import { userService } from "@/services/user.service";
import type { Gender, ProfilePayload } from "@/types/user";

const emptyForm: ProfilePayload = {
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

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-[#DDE5DC] bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#547A65] focus:ring-2 focus:ring-[#547A65]/15";

export default function EditApprovedProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState<ProfilePayload>(emptyForm);
  const [initialLoading, setInitialLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingDocuments, setUploadingDocuments] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      try {
        const response = await userService.getMyProfile();
        const user = response.profile;

        if (!user) throw new Error("Unable to find your profile.");

        if (user.status !== "APPROVED") {
          router.replace("/account-settings");
          return;
        }

        if (!active) return;
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
      } catch (loadError) {
        const message =
          loadError instanceof Error
            ? loadError.message
            : "Unable to load your profile.";
        if (/token|session|authentication|unauthorized|login/i.test(message)) {
          router.replace("/");
          return;
        }
        if (active) setError(message);
      } finally {
        if (active) setInitialLoading(false);
      }
    };

    void loadProfile();
    return () => {
      active = false;
    };
  }, [router]);

  const updateField = (field: keyof ProfilePayload, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateAddress = (
    field: keyof ProfilePayload["address"],
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      address: { ...current.address, [field]: value },
    }));
  };

  const uploadPhoto = async (file?: File) => {
    if (!file) return;
    setError("");
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Profile photo must be JPG, PNG or WEBP.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Profile photo must be 5 MB or smaller.");
      return;
    }

    setUploadingPhoto(true);
    try {
      const result = await userService.uploadFile(file, "photo");
      setForm((current) => ({ ...current, profilePhoto: result.fileUrl }));
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Photo upload failed.",
      );
    } finally {
      setUploadingPhoto(false);
    }
  };

  const uploadDocuments = async (files: FileList | null) => {
    if (!files?.length) return;
    const selected = Array.from(files);
    const allowed = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];
    const invalid = selected.find(
      (file) => !allowed.includes(file.type) || file.size > 10 * 1024 * 1024,
    );
    if (invalid) {
      setError(
        "Documents must be PDF, JPG, PNG or WEBP and 10 MB or smaller each.",
      );
      return;
    }

    setUploadingDocuments(true);
    setError("");
    try {
      const urls: string[] = [];
      for (const file of selected) {
        const result = await userService.uploadFile(file, "document");
        urls.push(result.fileUrl);
      }
      setForm((current) => ({
        ...current,
        documents: [...current.documents, ...urls],
      }));
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Document upload failed.",
      );
    } finally {
      setUploadingDocuments(false);
    }
  };

  const saveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.fullName.trim()) return setError("Please enter your full name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      return setError("Please enter a valid email address.");
    }
    if (!form.dateOfBirth) return setError("Please select your date of birth.");
    if (new Date(form.dateOfBirth) >= new Date()) {
      return setError("Date of birth must be in the past.");
    }
    if (
      !form.address.addressLine.trim() ||
      !form.address.city.trim() ||
      !form.address.state.trim() ||
      !form.address.country.trim() ||
      !form.address.pincode.trim()
    ) {
      return setError("Please complete all address fields.");
    }

    setSaving(true);
    try {
      await userService.updateApprovedProfile({
        ...form,
        fullName: form.fullName.trim(),
        email: form.email.trim(),
      });
      setSuccess("Your profile has been updated successfully");
      window.setTimeout(() => {
        setSuccess("");
        router.push("/account-settings");
      }, 1800);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to update your profile.",
      );
    } finally {
      setSaving(false);
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
        <Link
          href="/account-settings"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#173F35] hover:underline"
        >
          <ArrowLeft size={17} /> Back to account settings
        </Link>

        <section className="overflow-hidden rounded-3xl bg-white shadow-[0_15px_60px_rgba(23,63,53,0.07)]">
          <header className="bg-[#173F35] px-6 py-8 text-white sm:px-10">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                <Sparkles size={21} />
              </span>
              <div>
                <p className="text-xs tracking-[0.2em] text-[#D5E6D7]">
                  MOSAIC MEMBERSHIP
                </p>
                <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">
                  Edit your profile
                </h1>
              </div>
            </div>
            <p className="mt-4 text-sm text-white/70">
              Keep your membership information up to date.
            </p>
          </header>

          <form
            onSubmit={saveProfile}
            className="space-y-8 p-6 sm:p-10"
          >
            <section>
              <h2 className="mb-5 text-lg font-semibold text-[#173F35]">
                Personal information
              </h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Full name">
                  <input
                    required
                    className={inputClass}
                    value={form.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                  />
                </Field>
                <Field label="Email address">
                  <input
                    required
                    type="email"
                    className={inputClass}
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                  />
                </Field>
                <Field label="Date of birth">
                  <input
                    required
                    type="date"
                    className={inputClass}
                    value={form.dateOfBirth}
                    max={new Date().toISOString().slice(0, 10)}
                    onChange={(e) => updateField("dateOfBirth", e.target.value)}
                  />
                </Field>
                <Field label="Gender">
                  <select
                    className={inputClass}
                    value={form.gender}
                    onChange={(e) =>
                      updateField("gender", e.target.value as Gender)
                    }
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
              <h2 className="mb-5 text-lg font-semibold text-[#173F35]">
                Residential address
              </h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field label="Address">
                    <input
                      required
                      className={inputClass}
                      value={form.address.addressLine}
                      onChange={(e) =>
                        updateAddress("addressLine", e.target.value)
                      }
                    />
                  </Field>
                </div>
                <Field label="City">
                  <input
                    required
                    className={inputClass}
                    value={form.address.city}
                    onChange={(e) => updateAddress("city", e.target.value)}
                  />
                </Field>
                <Field label="State">
                  <input
                    required
                    className={inputClass}
                    value={form.address.state}
                    onChange={(e) => updateAddress("state", e.target.value)}
                  />
                </Field>
                <Field label="Country">
                  <input
                    required
                    className={inputClass}
                    value={form.address.country}
                    onChange={(e) => updateAddress("country", e.target.value)}
                  />
                </Field>
                <Field label="PIN code">
                  <input
                    required
                    className={inputClass}
                    value={form.address.pincode}
                    onChange={(e) => updateAddress("pincode", e.target.value)}
                  />
                </Field>
              </div>
            </section>

            <div className="h-px bg-[#EDF0EA]" />
            <section>
              <h2 className="mb-4 text-lg font-semibold text-[#173F35]">
                Profile photo
              </h2>
              <div className="flex flex-wrap items-center gap-4">
                {form.profilePhoto ? (
                  <img
                    src={form.profilePhoto}
                    alt="Current profile"
                    className="h-20 w-20 rounded-2xl border border-[#E8EAE2] object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#E8F0E7] text-[#173F35]">
                    <ImagePlus />
                  </div>
                )}
                <div>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#DDE5DC] px-4 py-2.5 text-sm font-medium text-[#173F35] hover:bg-[#F6F8F4]">
                    <ImagePlus size={17} />{" "}
                    {uploadingPhoto ? "Uploading..." : "Change photo"}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      disabled={uploadingPhoto}
                      onChange={(e) => {
                        void uploadPhoto(e.target.files?.[0]);
                        e.currentTarget.value = "";
                      }}
                    />
                  </label>
                  {form.profilePhoto && (
                    <button
                      type="button"
                      onClick={() => updateField("profilePhoto", "")}
                      className="ml-3 text-sm text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                  <p className="mt-2 text-xs text-gray-500">
                    JPG, PNG or WEBP. Maximum 5 MB.
                  </p>
                </div>
              </div>
            </section>

            <div className="h-px bg-[#EDF0EA]" />
            <section>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-[#173F35]">
                  Documents
                </h2>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#DDE5DC] px-4 py-2.5 text-sm font-medium text-[#173F35] hover:bg-[#F6F8F4]">
                  <FileText size={17} />{" "}
                  {uploadingDocuments ? "Uploading..." : "Add documents"}
                  <input
                    type="file"
                    multiple
                    accept="application/pdf,image/jpeg,image/png,image/webp"
                    className="hidden"
                    disabled={uploadingDocuments}
                    onChange={(e) => {
                      void uploadDocuments(e.target.files);
                      e.currentTarget.value = "";
                    }}
                  />
                </label>
              </div>
              {form.documents.length === 0 ? (
                <p className="text-sm text-gray-500">No documents uploaded.</p>
              ) : (
                <div className="space-y-2">
                  {form.documents.map((document, index) => (
                    <div
                      key={`${document}-${index}`}
                      className="flex items-center justify-between gap-3 rounded-xl border border-[#E8EAE2] px-4 py-3"
                    >
                      <a
                        href={document}
                        target="_blank"
                        rel="noreferrer"
                        className="flex min-w-0 items-center gap-2 truncate text-sm text-[#245747] hover:underline"
                      >
                        <FileText size={17} />{" "}
                        <span className="truncate">Document {index + 1}</span>
                      </a>
                      <button
                        type="button"
                        onClick={() =>
                          setForm((current) => ({
                            ...current,
                            documents: current.documents.filter(
                              (item) => item !== document,
                            ),
                          }))
                        }
                        aria-label={`Remove document ${index + 1}`}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                      >
                        <X size={17} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="mt-2 text-xs text-gray-500">
                PDF, JPG, PNG or WEBP. Maximum 10 MB per file.
              </p>
            </section>

            {error && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}
            {success && (
              <p
                role="status"
                className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700"
              >
                {success}
              </p>
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-[#EDF0EA] pt-6 sm:flex-row sm:justify-end">
              <Link
                href="/account-settings"
                className="rounded-xl border border-[#DDE5DC] px-6 py-3 text-center text-sm font-semibold text-[#173F35] hover:bg-[#F6F8F4]"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving || uploadingPhoto || uploadingDocuments}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173F35] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#245747] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <LoaderCircle
                    className="animate-spin"
                    size={17}
                  />
                ) : (
                  <Save size={17} />
                )}
                {saving ? "Saving changes..." : "Save changes"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
