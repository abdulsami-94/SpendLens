import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AuditResult } from "./auditEngine";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateAuditSummary(result: AuditResult): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    return "Audit completed. Review your personalized savings below.";
  }

  const prompt = `
    You are a startup financial optimization expert. 
    Analyze the following AI tool audit results and provide a punchy, 3-sentence "Executive Summary".
    
    Context:
    - Total Monthly Savings: $${result.totalSavingsMonthly.toFixed(2)}
    - Total Annual Savings: $${result.totalSavingsAnnual.toFixed(2)}
    - Primary Use Case: ${result.inputData.primaryUseCase}
    - Team Size: ${result.inputData.teamSize}
    
    Recommendations:
    ${result.recommendations.map(r => `- ${r.toolName}: ${r.strategyLabel} (Save $${r.savings.toFixed(2)}/mo)`).join("\n")}
    
    Guidelines:
    1. Be professional but persuasive.
    2. Focus on the most significant saving first.
    3. End with a call to action or a strong statement about the efficiency gain.
    4. Keep it exactly 3 sentences.
  `;

  try {
    const aiResult = await model.generateContent(prompt);
    const response = await aiResult.response;
    return response.text().trim();
  } catch (error) {
    console.error("Gemini AI generation failed:", error);
    return "We've identified significant savings in your AI stack. Check the breakdown below to see how to optimize your monthly spend.";
  }
}
