"use client";

import type { AuditResult } from "@/lib/auditEngine";

interface Props {
  oldResult: AuditResult;
  newResult: AuditResult;
  changedTools: string[];
  oldSnapshot: { version: string } | null;
  currentSnapshot: { version: string };
  auditId: string;
  createdAt: string;
}

export default function DiffClient({
  oldResult,
  newResult,
  changedTools,
  oldSnapshot,
  currentSnapshot,
  createdAt,
}: Props) {
  const savingsDelta = newResult.totalSavingsMonthly - oldResult.totalSavingsMonthly;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }}>
      {/* Headline */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "0.5rem" }}>
          Audit re-run — pricing has changed
        </h1>
        <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>
          Original audit: {new Date(createdAt).toLocaleDateString()} (pricing v{oldSnapshot?.version ?? "unknown"})
          {" → "}Current pricing v{currentSnapshot.version}
        </p>
        {changedTools.length > 0 && (
          <p style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
            Changed tools: <strong>{changedTools.join(", ")}</strong>
          </p>
        )}
      </div>

      {/* Savings delta headline */}
      <div style={{
        background: savingsDelta >= 0 ? "#f0fdf4" : "#fef2f2",
        border: `1px solid ${savingsDelta >= 0 ? "#86efac" : "#fca5a5"}`,
        borderRadius: 8,
        padding: "1rem 1.5rem",
        marginBottom: "2rem",
      }}>
        <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: 4 }}>
          Savings delta
        </p>
        <p style={{ fontSize: "1.75rem", fontWeight: 700, color: savingsDelta >= 0 ? "#16a34a" : "#dc2626" }}>
          {savingsDelta >= 0 ? "+" : ""}${savingsDelta.toFixed(0)}/month
        </p>
        <p style={{ fontSize: "0.85rem", color: "#6b7280", marginTop: 4 }}>
          Was ${oldResult.totalSavingsMonthly.toFixed(0)}/month → Now ${newResult.totalSavingsMonthly.toFixed(0)}/month
        </p>
      </div>

      {/* Side by side recommendations */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        {/* Old */}
        <div>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.75rem", color: "#6b7280" }}>
            Previous recommendations
          </h2>
          {oldResult.recommendations.map((rec) => {
            const newRec = newResult.recommendations.find(
              (r) => r.toolName === rec.toolName
            );
            const changed = newRec && newRec.recommendedPlan !== rec.recommendedPlan;

            return (
              <div
                key={rec.toolName}
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  marginBottom: "0.5rem",
                  background: changed ? "#fef9c3" : "white",
                  opacity: changed ? 1 : 0.6,
                }}
              >
                <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>{rec.toolName}</p>
                <p style={{ fontSize: "0.85rem", color: "#374151" }}>{rec.recommendedPlan ?? rec.strategyLabel}</p>
                <p style={{ fontSize: "0.8rem", color: "#6b7280" }}>${rec.savings.toFixed(0)}/mo savings</p>
              </div>
            );
          })}
        </div>

        {/* New */}
        <div>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.75rem", color: "#111827" }}>
            Updated recommendations
          </h2>
          {newResult.recommendations.map((rec) => {
            const oldRec = oldResult.recommendations.find(
              (r) => r.toolName === rec.toolName
            );
            const changed = oldRec && oldRec.recommendedPlan !== rec.recommendedPlan;

            return (
              <div
                key={rec.toolName}
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: 8,
                  border: `1px solid ${changed ? "#3b82f6" : "#e5e7eb"}`,
                  marginBottom: "0.5rem",
                  background: changed ? "#eff6ff" : "white",
                }}
              >
                <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>{rec.toolName}</p>
                <p style={{ fontSize: "0.85rem", color: "#374151" }}>{rec.recommendedPlan ?? rec.strategyLabel}</p>
                <p style={{ fontSize: "0.8rem", color: "#6b7280" }}>${rec.savings.toFixed(0)}/mo savings</p>
                {changed && (
                  <span style={{ fontSize: "0.75rem", color: "#2563eb", fontWeight: 500 }}>
                    ↑ changed
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Unchanged rows note */}
      <p style={{ fontSize: "0.8rem", color: "#9ca3af", marginTop: "1rem" }}>
        Highlighted rows changed. Muted rows are unchanged.
      </p>
    </div>
  );
}