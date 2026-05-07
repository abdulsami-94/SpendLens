"use client";

import SpendForm from "@/components/SpendForm";
import { SpendFormData } from "@/types";
import { useState } from "react";

export default function Home() {
  const [, setSubmittedFormData] = useState<SpendFormData | null>(null);

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <SpendForm onSubmit={setSubmittedFormData} />
      </div>
    </main>
  );
}
