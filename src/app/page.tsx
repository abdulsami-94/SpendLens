"use client";

import dynamic from "next/dynamic";
const SpendForm = dynamic(() => import("@/components/SpendForm"), {
  ssr: true,
  loading: () => (
    <div className="h-[600px] w-full animate-pulse rounded-3xl border border-zinc-200 bg-white p-8">
      <div className="h-8 w-1/3 rounded bg-zinc-100" />
      <div className="mt-2 h-4 w-2/3 rounded bg-zinc-50" />
      <div className="mt-12 space-y-6">
        <div className="h-20 w-full rounded-2xl bg-zinc-50" />
        <div className="h-20 w-full rounded-2xl bg-zinc-50" />
      </div>
    </div>
  ),
});
import type { SpendFormData } from "@/types";
import { useRouter } from "next/navigation";
import { startTransition } from "react";

export default function Home() {
  const router = useRouter();

  const handleAuditSubmit = async (data: SpendFormData) => {
    console.log("handleAuditSubmit triggered with data:", data);
    const response = await fetch("/api/audits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      return;
    }

    const payload = (await response.json()) as { id: string };

    startTransition(() => {
      router.push(`/audit/${payload.id}`);
    });
  };

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <SpendForm onSubmit={handleAuditSubmit} />
      </div>
    </main>
  );
}
