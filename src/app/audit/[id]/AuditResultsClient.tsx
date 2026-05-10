"use client";

import CredexLeadForm from "@/components/CredexLeadForm";
import NotifySignupForm from "@/components/NotifySignupForm";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import type { PublicAuditResult } from "@/lib/auditStore.server";
import { useParams, useRouter } from "next/navigation";
import { startTransition, useEffect, useState } from "react";

type LoadState =
  | { status: "loading" }
  | { status: "not-found" }
  | { status: "ready"; result: PublicAuditResult };

function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`;
}

export default function AuditResultsPage() {
  const params = useParams<{ id: string }>();
  const auditId = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadAuditResult() {
      const response = await fetch(`/api/audits/${auditId}`, {
        cache: "no-store",
      });

      if (!isMounted) {
        return;
      }

      startTransition(() => {
        if (!response.ok) {
          setLoadState({ status: "not-found" });
          return;
        }

        void response.json().then((result: PublicAuditResult) => {
          if (!isMounted) {
            return;
          }

          startTransition(() => {
            setLoadState({ status: "ready", result });
            
            // Show lead modal after a short delay
            setTimeout(() => {
              setShowLeadModal(true);
            }, 2000);
          });
        });
      });
    }

    void loadAuditResult();

    return () => {
      isMounted = false;
    };
  }, [auditId]);

  if (loadState.status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <p className="text-zinc-500">Loading audit results...</p>
      </div>
    );
  }

  if (loadState.status === "not-found") {
    return (
      <main className="min-h-screen bg-zinc-50 px-6 py-12 sm:px-10">
        <div className="mx-auto max-w-2xl rounded-3xl border border-zinc-200 bg-white p-8 text-center shadow-sm sm:p-12">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
            Audit not found
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-950">
            We could not find audit {auditId}.
          </h1>
          <p className="mt-3 text-zinc-600">
            Audit results now come from durable app storage instead of browser-only
            local storage. If this ID came from an older browser-only run, generate a
            fresh audit from the home page.
          </p>
          <button
            className="mt-8 rounded-full bg-zinc-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
            type="button"
            onClick={() => router.push("/")}
          >
            Create a new audit
          </button>
        </div>
      </main>
    );
  }

  const { result } = loadState;

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-3xl bg-zinc-900 p-8 text-white shadow-xl sm:p-12">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Your AI Audit</h1>
              <p className="mt-2 text-zinc-400">Audit ID: {auditId}</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-sm font-medium uppercase tracking-wider text-emerald-400">
                Monthly Savings
              </p>
              <p className="text-5xl font-black text-emerald-400">
                {formatCurrency(result.totalSavingsMonthly)}
              </p>
              <p className="mt-1 text-sm font-medium uppercase tracking-wider text-zinc-400">
                Annual: {formatCurrency(result.totalSavingsAnnual)}
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-6 border-t border-zinc-800 pt-10 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-zinc-400">Current Monthly Spend</p>
              <p className="text-2xl font-semibold">
                {formatCurrency(result.totalCurrentSpend)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-400">Optimized Monthly Spend</p>
              <p className="text-2xl font-semibold text-emerald-400">
                {formatCurrency(result.totalRecommendedSpend)}
              </p>
            </div>
          </div>
        </div>

        {summary && (
          <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-blue-950">AI Summary</h2>
            <p className="mt-3 text-blue-900">{summary}</p>
          </div>
        )}

        {summaryLoading && (
          <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-zinc-500">Generating personalized summary...</p>
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          {result.aiSummary && (
            <div className="mb-8 rounded-2xl border border-blue-100 bg-blue-50 p-6">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white">
                  AI
                </div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-blue-900">
                  Executive Summary
                </h2>
              </div>
              <p className="mt-3 text-lg leading-relaxed text-blue-950">
                {result.aiSummary}
              </p>
            </div>
          )}

          {result.isOptimal ? (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-zinc-950">You are already close to optimal.</h2>
                <p className="mt-1 text-zinc-600">
                  We did not find large immediate savings. Leave an email if you want a
                  heads-up when pricing changes.
                </p>
              </div>
              <NotifySignupForm auditId={auditId} />
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-bold text-zinc-950">Savings opportunities identified</h2>
              <p className="mt-1 text-zinc-600">
                We found {formatCurrency(result.totalSavingsMonthly)} in monthly optimizations
                after checking seat fit, same-vendor downgrades, annual billing, API
                discounts, and cheaper alternatives.
              </p>
            </div>
          )}
        </div>

        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-bold text-zinc-950">Per-Tool Audit Chain</h2>
          {result.recommendations.map((recommendation) => (
            <div
              key={recommendation.toolName}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="text-lg font-bold text-zinc-950">
                    {recommendation.toolName}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-zinc-500">
                    Selected strategy: {recommendation.strategyLabel}
                  </p>
                </div>
                <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                  Save {formatCurrency(recommendation.savings)}/mo
                </span>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-4">
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Current spend
                  </p>
                  <p className="mt-2 text-xl font-semibold text-zinc-950">
                    {formatCurrency(recommendation.currentSpend)}
                  </p>
                  <p className="mt-1 text-sm text-zinc-600">{recommendation.currentPlan}</p>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Recommendation
                  </p>
                  <p className="mt-2 text-base font-semibold text-zinc-950">
                    {recommendation.recommendedPlan}
                  </p>
                  <p className="mt-1 text-sm text-zinc-600">{recommendation.strategyLabel}</p>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    New spend
                  </p>
                  <p className="mt-2 text-xl font-semibold text-zinc-950">
                    {formatCurrency(recommendation.recommendedSpend)}
                  </p>
                </div>
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    Savings
                  </p>
                  <p className="mt-2 text-xl font-semibold text-emerald-900">
                    {formatCurrency(recommendation.savings)}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm text-zinc-700">{recommendation.reason}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {recommendation.consideredOptions
                  .filter((option) => option.kind !== "current")
                  .map((option) => (
                    <span
                      key={`${recommendation.toolName}-${option.kind}-${option.label}`}
                      className="inline-flex rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-600"
                    >
                      {option.kind}: {option.label} {formatCurrency(option.spend)}
                    </span>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {result.showCredexCTA ? (
          <div className="mt-12 rounded-3xl border-2 border-emerald-200 bg-emerald-50 p-8 shadow-sm">
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-2xl font-bold text-emerald-950">
                  Save even more with Credex
                </h2>
                <p className="mt-2 text-emerald-900">
                  This audit cleared the Credex lead threshold. Submit a work email and
                  company name to route this audit into the bulk-credit follow-up path.
                </p>
              </div>
              <CredexLeadForm
                auditId={auditId}
                monthlySavings={result.totalSavingsMonthly}
              />
            </div>
          </div>
        ) : null}

        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="text-sm font-medium text-zinc-500 underline underline-offset-4 transition hover:text-zinc-950"
          >
            {"<-"} Edit your data
          </button>
        </div>
      </div>

      <LeadCaptureModal
        isOpen={showLeadModal}
        onClose={() => setShowLeadModal(false)}
        auditId={auditId}
      />
    </main>
  );
}
