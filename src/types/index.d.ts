export interface ToolEntry {
    name: string;
    plan: string;
    seats: number;
    monthlySpend: number;
}

export interface SpendFormData {
    tools: ToolEntry[];
    teamSize: number;
    primaryUseCase: "coding" | "writing" | "data" | "research" | "mixed";
}