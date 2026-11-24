"use client";

import { LoaderCircle } from "lucide-react";
import { useSyncExternalStore } from "react";
import {
  getApiLoadingSnapshot,
  subscribeToApiLoading,
} from "@/lib/api";

export default function GlobalApiLoader() {
  const isLoading = useSyncExternalStore(
    subscribeToApiLoading,
    getApiLoadingSnapshot,
    () => false,
  );

  if (!isLoading) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#173F35]/20 p-6 backdrop-blur-[2px]"
    >
      <div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-4 text-sm font-medium text-[#173F35] shadow-xl">
        <LoaderCircle
          size={20}
          aria-hidden="true"
          className="animate-spin motion-reduce:animate-none"
        />
        Loading, please wait...
      </div>
    </div>
  );
}
