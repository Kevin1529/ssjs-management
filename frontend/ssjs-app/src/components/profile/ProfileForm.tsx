"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, Save } from "lucide-react";
import AddressFields from "@/components/form/AddressFields";
import DocumentsUploadField from "@/components/form/DocumentsUploadField";
import FormSection from "@/components/form/FormSection";
import PersonalInfoFields from "@/components/form/PersonalInfoFields";
import PhotoUploadField from "@/components/form/PhotoUploadField";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import ButtonLink from "@/components/ui/ButtonLink";
import { useProfileForm } from "@/hooks/useProfileForm";
import type { ProfilePayload } from "@/types/user";

interface ProfileFormProps {
  initialValues: ProfilePayload;
  /** "create" submits for approval; "edit" updates an approved profile. */
  variant: "create" | "edit";
  onSubmit: (payload: ProfilePayload) => Promise<unknown>;
  successMessage?: string;
  /** Runs after a successful save, once `successDelayMs` has passed. */
  onSuccess?: () => void;
  successDelayMs?: number;
  cancelHref?: string;
}

const Divider = () => <hr className="border-line-soft" />;

export default function ProfileForm({
  initialValues,
  variant,
  onSubmit,
  successMessage,
  onSuccess,
  successDelayMs = 0,
  cancelHref,
}: ProfileFormProps) {
  const profile = useProfileForm(initialValues);
  const { form } = profile;
  const redirectTimer = useRef<number | undefined>(undefined);
  const isCreate = variant === "create";

  useEffect(() => () => window.clearTimeout(redirectTimer.current), []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const saved = await profile.submit(onSubmit);
    if (!saved) return;

    if (successMessage) profile.setSuccess(successMessage);
    if (onSuccess) {
      redirectTimer.current = window.setTimeout(onSuccess, successDelayMs);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-6 sm:p-10">
      <FormSection title="Personal information">
        <PersonalInfoFields
          values={form}
          onChange={{ text: profile.setField, gender: (value) => profile.setField("gender", value) }}
        />
      </FormSection>

      <Divider />

      <FormSection title="Residential address">
        <AddressFields values={form.address} onChange={profile.setAddressField} />
      </FormSection>

      <Divider />

      <FormSection title="Profile photo">
        <PhotoUploadField
          photoUrl={form.profilePhoto}
          uploading={profile.uploadingPhoto}
          onUpload={profile.uploadPhoto}
          onRemove={profile.removePhoto}
        />
      </FormSection>

      <Divider />

      <section>
        <DocumentsUploadField
          documents={form.documents}
          uploading={profile.uploadingDocuments}
          onUpload={profile.uploadDocuments}
          onRemove={profile.removeDocument}
        />
      </section>

      {profile.error && <Alert>{profile.error}</Alert>}
      {profile.success && <Alert tone="success">{profile.success}</Alert>}

      {isCreate ? (
        <>
          <Button
            type="submit"
            size="lg"
            fullWidth
            loading={profile.saving}
            loadingText="Submitting profile..."
            disabled={profile.busy}
            iconAfter={<ArrowRight size={18} />}
          >
            Submit for approval
          </Button>
          <p className="text-center text-xs text-gray-400">
            Please review your details before submitting.
          </p>
        </>
      ) : (
        <div className="flex flex-col-reverse gap-3 border-t border-line-soft pt-6 sm:flex-row sm:justify-end">
          {cancelHref && (
            <ButtonLink href={cancelHref} variant="secondary" className="px-6 font-semibold">
              Cancel
            </ButtonLink>
          )}
          <Button
            type="submit"
            loading={profile.saving}
            loadingText="Saving changes..."
            disabled={profile.busy}
            icon={<Save size={17} />}
            className="px-6 font-semibold"
          >
            Save changes
          </Button>
        </div>
      )}
    </form>
  );
}
