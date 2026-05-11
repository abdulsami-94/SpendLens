"use client";

import { ToolEntry, SpendFormData } from "@/types";
import {
    calculateTotalMonthlySpend,
    createInitialFormData,
    getToolPlans,
    getToolMonthlySpend,
    restoreSpendFormData,
    SPEND_FORM_STORAGE_KEY,
    TOOLS_CONFIG,
} from "@/lib/spend-form-state.mjs";
import { startTransition, useEffect, useRef, useState } from "react";

export default function SpendForm({ onSubmit }: { onSubmit: (data: SpendFormData) => void }) {

    const [formData, setFormData] = useState<SpendFormData>(() => createInitialFormData());
    const hasHydrated = useRef(false);
    const [visibleToolNames, setVisibleToolNames] = useState<string[]>(["Cursor", "GitHub Copilot", "Claude"]);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        startTransition(() => {
            const raw = window.localStorage.getItem(SPEND_FORM_STORAGE_KEY);
            const restored = restoreSpendFormData(raw);
            setFormData(restored);
            
            if (raw && restored.tools) {
                // Determine which tools should be visible based on saved data
                // We show the defaults + any tool that was modified from its default state
                const defaultNames = ["Cursor", "GitHub Copilot", "Claude"];
                const customizedNames = restored.tools
                    .filter(t => !defaultNames.includes(t.name) && (t.seats > 1 || t.monthlySpend > 0))
                    .map(t => t.name);
                
                setVisibleToolNames([...new Set([...defaultNames, ...customizedNames])]);
            }
            
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
        const updatedTools = formData.tools.map((tool, i) => {
            if (i !== index) {
                return tool;
            }

            const updatedTool = {
                ...tool,
                [field]: value,
            };

            return {
                ...updatedTool,
                monthlySpend: getToolMonthlySpend(updatedTool),
            };
        });

        setFormData({ ...formData, tools: updatedTools });
    };

    const addTool = (name: string) => {
        if (!visibleToolNames.includes(name)) {
            setVisibleToolNames(prev => [...prev, name]);
        }
        setIsAdding(false);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Only submit data for visible tools
        const visibleData = {
            ...formData,
            tools: formData.tools.filter(t => visibleToolNames.includes(t.name))
        };
        onSubmit(visibleData);
    };

    const totalMonthlySpend = calculateTotalMonthlySpend(
        formData.tools.filter(t => visibleToolNames.includes(t.name))
    );

    const availableToHide = formData.tools.filter(t => !visibleToolNames.includes(t.name));

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
                            if (!visibleToolNames.includes(tool.name)) return null;

                            const plans = getToolPlans(tool.name);
                            const toolId = tool.name.toLowerCase().replace(/\s+/g, "-");

                            return (
                                <div
                                    key={tool.name}
                                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-zinc-200 px-4 py-3 animate-in fade-in slide-in-from-top-2 duration-300"
                                >
                                    {/* Left Side: Name and Spend */}
                                    <div className="flex flex-col">
                                        <p className="text-base font-semibold text-zinc-950">{tool.name}</p>
                                        <p className="text-sm font-medium text-zinc-500">
                                            ${getToolMonthlySpend(tool).toFixed(2)} /mo
                                        </p>
                                    </div>

                                    {/* Right Side: Inputs */}
                                    <div className="flex flex-col sm:flex-row items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-600" htmlFor={`${toolId}-plan`}>
                                                Plan
                                            </label>
                                            <select
                                                id={`${toolId}-plan`}
                                                className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-950 outline-none transition focus:border-zinc-400"
                                                value={tool.plan}
                                                onChange={(e) => updateTool(index, "plan", e.target.value)}
                                            >
                                                {plans.map((plan) => (
                                                    <option key={plan} value={plan}>
                                                        {plan}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-600" htmlFor={`${toolId}-seats`}>
                                                Seats
                                            </label>
                                            <input
                                                id={`${toolId}-seats`}
                                                className="w-20 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-950 outline-none transition focus:border-zinc-400"
                                                type="number"
                                                min="1"
                                                value={tool.seats}
                                                onChange={(e) => updateTool(index, "seats", Math.max(1, parseInt(e.target.value, 10) || 1))}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </fieldset>

                <div className="mt-4">
                    {availableToHide.length > 0 && (
                        <div className="flex flex-col gap-2">
                            {!isAdding ? (
                                <button
                                    type="button"
                                    className="inline-flex items-center w-fit rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-900"
                                    onClick={() => setIsAdding(true)}
                                >
                                    + Add Tool
                                </button>
                            ) : (
                                <div className="flex flex-wrap items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-200">
                                    <span className="text-sm font-medium text-zinc-500 mr-2">Select tool:</span>
                                    {availableToHide.map((tool) => (
                                        <button
                                            key={tool.name}
                                            type="button"
                                            className="rounded-full bg-zinc-100 px-4 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-900 hover:text-white transition-all"
                                            onClick={() => addTool(tool.name)}
                                        >
                                            {tool.name}
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        className="ml-2 text-sm text-zinc-600 hover:text-zinc-600 underline"
                                        onClick={() => setIsAdding(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
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
