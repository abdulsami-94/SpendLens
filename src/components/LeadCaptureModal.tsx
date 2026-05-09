"use client";

import { useState } from "react";

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditId: string;
}

export default function LeadCaptureModal({
  isOpen,
  onClose,
  auditId,
}: LeadCaptureModalProps) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          company,
          role,
          teamSize,
          auditId,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          onClose();
          setEmail("");
          setCompany("");
          setRole("");
          setTeamSize("");
          setSubmitted(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to capture lead:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="p-6 sm:p-8">
          {!submitted ? (
            <>
              <h2 className="text-2xl font-bold text-zinc-950">Get your audit report</h2>
              <p className="mt-2 text-sm text-zinc-600">
                Enter your details to receive a detailed report and follow-up
                recommendations.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
                    Work Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-zinc-950 focus:outline-none"
                    placeholder="you@company.com"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-zinc-700">
                    Company
                  </label>
                  <input
                    id="company"
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-zinc-950 focus:outline-none"
                    placeholder="Acme Inc"
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-zinc-700">
                    Your Role
                  </label>
                  <input
                    id="role"
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-zinc-950 focus:outline-none"
                    placeholder="Engineering Manager"
                  />
                </div>

                <div>
                  <label htmlFor="teamSize" className="block text-sm font-medium text-zinc-700">
                    Team Size
                  </label>
                  <select
                    id="teamSize"
                    value={teamSize}
                    onChange={(e) => setTeamSize(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-zinc-950 focus:outline-none"
                  >
                    <option value="">Select team size</option>
                    <option value="1-5">1-5</option>
                    <option value="6-20">6-20</option>
                    <option value="21-50">21-50</option>
                    <option value="50+">50+</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-zinc-950 py-2 text-sm font-medium text-white transition disabled:opacity-50 hover:bg-zinc-800"
                >
                  {loading ? "Saving..." : "Submit"}
                </button>
              </form>

              <button
                onClick={onClose}
                className="mt-4 w-full text-sm text-zinc-500 transition hover:text-zinc-700"
              >
                Skip for now
              </button>
            </>
          ) : (
            <div className="text-center">
              <p className="text-lg font-semibold text-emerald-600">✓ Thank you!</p>
              <p className="mt-2 text-sm text-zinc-600">
                We've sent a confirmation email to {email}. Check your inbox for the full
                report.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
