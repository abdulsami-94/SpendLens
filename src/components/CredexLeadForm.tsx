"use client";

import { startTransition, useState } from "react";

interface CredexLeadFormProps {
  auditId: string;
  monthlySavings: number;
}

export default function CredexLeadForm({
  auditId,
  monthlySavings,
}: CredexLeadFormProps) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(() => {
      setStatus("submitting");
      setMessage("");
    });

    const response = await fetch("/api/credex", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        auditId,
        email,
        company,
        monthlySavings,
      }),
    });

    const payload = (await response.json()) as { message?: string };

    startTransition(() => {
      if (response.ok) {
        setStatus("success");
        setMessage(payload.message ?? "Credex will follow up with pricing options.");
        setEmail("");
        setCompany("");
        return;
      }

      setStatus("error");
      setMessage(payload.message ?? "We could not save your Credex request.");
    });
  };

  return (
    <form className="mt-6 grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]" onSubmit={handleSubmit}>
      <input
        className="rounded-xl border border-emerald-300 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-emerald-500"
        type="email"
        name="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Work email"
        required
      />
      <input
        className="rounded-xl border border-emerald-300 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-emerald-500"
        type="text"
        name="company"
        value={company}
        onChange={(event) => setCompany(event.target.value)}
        placeholder="Company name"
        required
      />
      <button
        className="whitespace-nowrap rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
        type="submit"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Submitting..." : "Get Credex Credits"}
      </button>
      {message ? (
        <p
          className={`text-sm md:col-span-3 ${
            status === "success" ? "text-emerald-800" : "text-rose-700"
          }`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
