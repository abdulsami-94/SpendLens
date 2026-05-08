"use client";

import { startTransition, useState } from "react";

interface NotifySignupFormProps {
  auditId: string;
}

export default function NotifySignupForm({ auditId }: NotifySignupFormProps) {
  const [email, setEmail] = useState("");
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

    const response = await fetch("/api/notify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ auditId, email }),
    });

    const payload = (await response.json()) as { message?: string };

    startTransition(() => {
      if (response.ok) {
        setStatus("success");
        setMessage(payload.message ?? "You are on the notify list.");
        setEmail("");
        return;
      }

      setStatus("error");
      setMessage(payload.message ?? "We could not save your signup.");
    });
  };

  return (
    <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
      <input
        className="flex-1 rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-500"
        type="email"
        name="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Enter your email"
        required
      />
      <button
        className="rounded-xl bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
        type="submit"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Saving..." : "Notify Me"}
      </button>
      {message ? (
        <p
          className={`text-sm ${
            status === "success" ? "text-emerald-700" : "text-rose-700"
          } sm:basis-full`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
