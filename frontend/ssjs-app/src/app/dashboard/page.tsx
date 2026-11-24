"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("userToken");

    if (!token) {
      router.replace("/");
    }
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F6F5EF] p-6">
      <div className="max-w-lg rounded-3xl bg-white p-10 text-center shadow-xl">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E8F0E7] text-3xl">
          ✨
        </div>

        <h1 className="text-3xl font-semibold text-[#173F35]">
          Welcome to Mosaic!
        </h1>

        <p className="mt-3 text-gray-500">
          Your login was successful. We'll build your membership dashboard next.
        </p>

        <button
          onClick={() => {
            localStorage.removeItem("userToken");
            router.replace("/");
          }}
          className="mt-8 rounded-xl bg-[#173F35] px-6 py-3 text-white hover:bg-[#245747]"
        >
          Logout
        </button>
      </div>
    </main>
  );
}
