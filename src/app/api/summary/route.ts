import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import type { AuditResult } from "@/lib/auditEngine";

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      auditResult: AuditResult;
      teamSize: string;
      primaryUseCase: string;
    };

    const { auditResult, teamSize, primaryUseCase } = body;

    const topRecommendation = auditResult.recommendations[0]?.toolName || "Review your setup";

    const prompt = `You are a financial analyst specializing in AI tool spend optimization. Given an audit of a team's AI tool expenses, write a concise, personalized 100-word summary.

Audit Data:
- Team Size: ${teamSize}
- Primary Use Case: ${primaryUseCase}
- Current Monthly Spend: $${auditResult.totalCurrentSpend}
- Recommended Monthly Spend: $${auditResult.totalRecommendedSpend}
- Monthly Savings: $${auditResult.totalSavingsMonthly}
- Annual Savings: $${auditResult.totalSavingsAnnual}
- Top Recommendation: ${topRecommendation}

Write a summary that:
1. Acknowledges their current spend
2. Highlights the biggest savings opportunity
3. Explains the recommendation in business terms
4. Ends with a clear call-to-action

Keep it under 100 words. Be direct and actionable.`;

    const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    return NextResponse.json({ summary }, { status: 200 });
  } catch (error) {
    console.error("Summary generation failed:", error);
    // Fallback templated summary
    const fallbackSummary = "Your audit is ready. Review the recommendations above to optimize your AI tool spend and identify potential savings opportunities.";
    return NextResponse.json({ summary: fallbackSummary }, { status: 200 });
  }
}
