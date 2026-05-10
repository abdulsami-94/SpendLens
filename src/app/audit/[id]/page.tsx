import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAuditResult, sanitizeAuditResult } from "@/lib/auditStore.server";
import AuditResultsClient from "./AuditResultsClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const result = await getAuditResult(id);

    if (!result) {
      return {
        title: "AI Spend Audit - Not Found",
        description: "The requested audit could not be found.",
        openGraph: {
          title: "AI Spend Audit - Not Found",
          description: "The requested audit could not be found.",
          type: "website",
          images: [{ url: "/og-default.png" }],
        },
        twitter: {
          card: "summary_large_image",
          title: "AI Spend Audit - Not Found",
          description: "The requested audit could not be found.",
          images: ["/og-default.png"],
        },
      };
    }

    const sanitizedResult = sanitizeAuditResult(result);

    // Get the top recommendation for the description
    const topRecommendation = sanitizedResult.recommendations
      .sort((a, b) => b.savings - a.savings)[0];

    const title = `AI Spend Audit — Saves $${sanitizedResult.totalSavingsMonthly.toFixed(0)}/month`;
    const description = topRecommendation
      ? `Top recommendation: ${topRecommendation.toolName} - Save $${topRecommendation.savings.toFixed(0)}/month with ${topRecommendation.strategyLabel.toLowerCase()}.`
      : `AI-powered audit showing potential monthly savings of $${sanitizedResult.totalSavingsMonthly.toFixed(0)}.`;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const url = `${baseUrl}/audit/${id}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url,
        type: "website",
        images: [{ url: "/og-default.png" }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: ["/og-default.png"],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "AI Spend Audit",
      description: "Analyze your AI tool spending and find savings opportunities.",
      openGraph: {
        title: "AI Spend Audit",
        description: "Analyze your AI tool spending and find savings opportunities.",
        type: "website",
        images: [{ url: "/og-default.png" }],
      },
      twitter: {
        card: "summary_large_image",
        title: "AI Spend Audit",
        description: "Analyze your AI tool spending and find savings opportunities.",
        images: ["/og-default.png"],
      },
    };
  }
}

export default async function AuditResultsPage({ params }: PageProps) {
  const { id } = await params;

  // Check if audit exists (for notFound handling)
  const result = await getAuditResult(id);
  if (!result) {
    notFound();
  }

  return <AuditResultsClient />;
}