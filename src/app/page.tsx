"use client";

import SpendForm from "@/components/SpendForm";
import type { SpendFormData } from "@/types";
import { useRouter } from "next/navigation";
import { startTransition } from "react";

export default function Home() {
  const router = useRouter();

  const handleAuditSubmit = async (data: SpendFormData) => {
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
