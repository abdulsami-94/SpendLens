"use client";

import { ToolEntry, SpendFormData } from "@/types";
import {
    calculateTotalMonthlySpend,
    createInitialFormData,
    getToolPlans,
    restoreSpendFormData,
    SPEND_FORM_STORAGE_KEY,
    TOOLS_CONFIG,
} from "@/lib/spend-form-state.mjs";
import { startTransition, useEffect, useRef, useState } from "react";

export default function SpendForm({ onSubmit }: { onSubmit: (data: SpendFormData) => void }) {

    const [formData, setFormData] = useState<SpendFormData>(() => createInitialFormData());
    const hasHydrated = useRef(false);
    const [addingTool, setAddingTool] = useState(false);
    const [selectedAddTool, setSelectedAddTool] = useState<string>("");

    useEffect(() => {
        startTransition(() => {
            setFormData(restoreSpendFormData(window.localStorage.getItem(SPEND_FORM_STORAGE_KEY)));
            hasHydrated.current = true;
        });
    }, []);

    useEffect(() => {
        if (!hasHydrated.current) {
            return;
        }

        window.localStorage.setItem(SPEND_FORM_STORAGE_KEY, JSON.stringify(formData));
    }, [formData]);

    const updateTool = (index: number, field: keyof ToolEntry, value: string | number) => {
        const updatedTools = formData.tools.map((tool, i) => 
        i === index ? {...tool, [field]: value } : tool
        );
        setFormData({...formData, tools: updatedTools});
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        console.log("handleSubmit triggered");
        event.preventDefault();
        onSubmit(formData);
    };

    const totalMonthlySpend = calculateTotalMonthlySpend(formData.tools);

    return (
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">Calculate Your AI Spend</h1>
            <p className="mt-2 text-sm text-zinc-600">Capture team size, use case, seats, and monthly spend for each tool.</p>
            <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
                {/* Section 1: Global Fields */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <label className="flex flex-col gap-2 text-sm font-medium text-zinc-800">
                        Team Size:
                        <input
                            className="rounded-xl border border-zinc-300 px-4 py-3 text-base text-zinc-950 outline-none transition focus:border-zinc-500"
                            type="number"
                            min="1"
                            value={formData.teamSize}
                            onChange={(e) => setFormData({ ...formData, teamSize: parseInt(e.target.value, 10) || 1 })}
                        />
                    </label>
                    <label className="flex flex-col gap-2 text-sm font-medium text-zinc-800">
                        Primary Use Case:
                        <select
                            className="rounded-xl border border-zinc-300 bg-white px-4 py-3 text-base text-zinc-950 outline-none transition focus:border-zinc-500"
                            value={formData.primaryUseCase}
                            onChange={(e) => setFormData({ ...formData, primaryUseCase: e.target.value as SpendFormData["primaryUseCase"] })}
                        >
                            <option value="coding">Coding</option>
                            <option value="writing">Writing</option>
                            <option value="data">Data</option>
                            <option value="research">Research</option>
                            <option value="mixed">Mixed</option>
                        </select>
                    </label>
                </div>

                <fieldset className="space-y-4">
                    <legend className="text-lg font-semibold text-zinc-950">Tools</legend>
                    <div className="space-y-4">
                        {formData.tools.map((tool, index) => {
                            const plans = getToolPlans(tool.name);
                            const toolId = tool.name.toLowerCase().replace(/\s+/g, "-");

                            return (
                                <div
                                    key={tool.name}
                                    className="grid gap-4 rounded-2xl border border-zinc-200 p-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_120px] md:items-end"
                                >
                                    <div>
                                        <p className="mt-1 text-base font-semibold text-zinc-950">{tool.name}</p>
                                    </div>
                                    <label className="flex flex-col gap-2 text-sm font-medium text-zinc-800" htmlFor={`${toolId}-plan`}>
                                        Plan
                                        <select
                                            id={`${toolId}-plan`}
                                            className="rounded-xl border border-zinc-300 bg-white px-4 py-3 text-base text-zinc-950 outline-none transition focus:border-zinc-500"
                                            value={tool.plan}
                                            onChange={(e) => updateTool(index, "plan", e.target.value)}
                                        >
                                            {plans.map((plan) => (
                                                <option key={plan} value={plan}>
                                                    {plan}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                    <label className="flex flex-col gap-2 text-sm font-medium text-zinc-800" htmlFor={`${toolId}-seats`}>
                                        Seats
                                        <input
                                            id={`${toolId}-seats`}
                                            className="rounded-xl border border-zinc-300 px-4 py-3 text-base text-zinc-950 outline-none transition focus:border-zinc-500"
                                            type="number"
                                            min="1"
                                            value={tool.seats}
                                            onChange={(e) => updateTool(index, "seats", Math.max(1, parseInt(e.target.value, 10) || 1))}
                                        />
                                    </label>

                                </div>
                            );
                        })}
                    </div>
                </fieldset>

                <div className="mt-4">
                    {(() => {
                        const availableTools = TOOLS_CONFIG.map((t) => t.name).filter((n) => !formData.tools.some((ft) => ft.name === n));
                        if (availableTools.length === 0) {
                            return null;
                        }

                        return (
                            <div className="flex items-center gap-3">
                                {!addingTool ? (
                                    <button
                                        type="button"
                                        className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700"
                                        onClick={() => {
                                            setAddingTool(true);
                                            setSelectedAddTool(availableTools[0]);
                                        }}
                                    >
                                        + Add Tool
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <select
                                            className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 outline-none"
                                            value={selectedAddTool}
                                            onChange={(e) => setSelectedAddTool(e.target.value)}
                                        >
                                            {availableTools.map((name) => (
                                                <option key={name} value={name}>{name}</option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-medium text-white"
                                            onClick={() => {
                                                if (!selectedAddTool) return;
                                                const plans = getToolPlans(selectedAddTool);
                                                const newTool = {
                                                    name: selectedAddTool,
                                                    plan: plans[0] ?? "Unknown",
                                                    seats: 1,
                                                    monthlySpend: 0,
                                                };
                                                setFormData({ ...formData, tools: [...formData.tools, newTool] });
                                                setAddingTool(false);
                                                setSelectedAddTool("");
                                            }}
                                        >
                                            Add
                                        </button>
                                        <button
                                            type="button"
                                            className="text-sm text-zinc-500"
                                            onClick={() => { setAddingTool(false); setSelectedAddTool(""); }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })()}
                </div>

                <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-medium text-zinc-500">Total Monthly Spend</p>
                        <p className="mt-1 text-3xl font-semibold tracking-tight text-zinc-950">
                            ${totalMonthlySpend.toFixed(2)}
                        </p>
                    </div>
                    <button
                        className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
                        type="submit"
                    >
                        Save spend data
                    </button>
                </div>
            </form>
        </div>
    );
}
