"use client";

import { useCallback, useState } from "react";
import { getErrorMessage } from "@/lib/errors";
import { normalizeProfile, validateProfileForm } from "@/lib/profile-form";
import { validateDocuments, validatePhoto } from "@/lib/upload-rules";
import { userService } from "@/services/user.service";
import type { ProfilePayload, UserAddress } from "@/types/user";

type TextField = "fullName" | "email" | "dateOfBirth" | "gender";

/** State, uploads and submission for the create/edit profile forms. */
export function useProfileForm(initialValues: ProfilePayload) {
  const [form, setForm] = useState(initialValues);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingDocuments, setUploadingDocuments] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const setField = useCallback(
    <K extends TextField>(field: K, value: ProfilePayload[K]) => {
      setForm((current) => ({ ...current, [field]: value }));
    },
    [],
  );

  const setAddressField = useCallback(
    (field: keyof UserAddress, value: string) => {
      setForm((current) => ({
        ...current,
        address: { ...current.address, [field]: value },
      }));
    },
    [],
  );

  const uploadPhoto = useCallback(async (file?: File) => {
    if (!file) return;

    setError("");
    const problem = validatePhoto(file);
    if (problem) return setError(problem);

    setUploadingPhoto(true);
    try {
      const result = await userService.uploadFile(file, "photo");
      setForm((current) => ({ ...current, profilePhoto: result.fileUrl }));
    } catch (uploadError) {
      setError(getErrorMessage(uploadError, "Photo upload failed."));
    } finally {
      setUploadingPhoto(false);
    }
  }, []);

  const removePhoto = useCallback(() => {
    setForm((current) => ({ ...current, profilePhoto: "" }));
  }, []);

  const uploadDocuments = useCallback(async (fileList: FileList | null) => {
    if (!fileList?.length) return;

    const files = Array.from(fileList);
    setError("");
    const problem = validateDocuments(files);
    if (problem) return setError(problem);

    setUploadingDocuments(true);
    try {
      const results = await Promise.all(
        files.map((file) => userService.uploadFile(file, "document")),
      );
      const urls = results.map((result) => result.fileUrl);
      setForm((current) => ({
        ...current,
        documents: [...current.documents, ...urls],
      }));
    } catch (uploadError) {
      setError(getErrorMessage(uploadError, "Document upload failed."));
    } finally {
      setUploadingDocuments(false);
    }
  }, []);

  const removeDocument = useCallback((index: number) => {
    setForm((current) => ({
      ...current,
      documents: current.documents.filter((_, i) => i !== index),
    }));
  }, []);

  /** Validates, then runs `save`. Resolves true when the save succeeded. */
  const submit = useCallback(
    async (save: (payload: ProfilePayload) => Promise<unknown>) => {
      setError("");
      setSuccess("");

      const problem = validateProfileForm(form);
      if (problem) {
        setError(problem);
        return false;
      }

      setSaving(true);
      try {
        await save(normalizeProfile(form));
        return true;
      } catch (saveError) {
        setError(getErrorMessage(saveError, "Unable to save your profile."));
        return false;
      } finally {
        setSaving(false);
      }
    },
    [form],
  );

  return {
    form,
    error,
    success,
    setSuccess,
    saving,
    uploadingPhoto,
    uploadingDocuments,
    busy: saving || uploadingPhoto || uploadingDocuments,
    setField,
    setAddressField,
    uploadPhoto,
    removePhoto,
    uploadDocuments,
    removeDocument,
    submit,
  };
}
