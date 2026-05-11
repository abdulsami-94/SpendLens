"use client";

import React, { useState, useEffect, startTransition } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Playfair_Display, DM_Sans } from "next/font/google";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import type { SpendFormData } from "@/types";

// Dynamic import for SpendForm to handle hydration correctly
const SpendForm = dynamic(() => import("@/components/SpendForm"), {
  ssr: true,
  loading: () => (
    <div className="h-[600px] w-full animate-pulse rounded-3xl border border-zinc-200 bg-white p-8">
      <div className="h-8 w-1/3 rounded bg-zinc-100" />
      <div className="mt-2 h-4 w-2/3 rounded bg-zinc-50" />
      <div className="mt-12 space-y-6">
        <div className="h-20 w-full rounded-2xl bg-zinc-50" />
        <div className="h-20 w-full rounded-2xl bg-zinc-50" />
      </div>
    </div>
  ),
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

export default function Home() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAuditSubmit = async (data: SpendFormData) => {
    const response = await fetch("/api/audits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      return;
    }

    const payload = (await response.json()) as { id: string };

    startTransition(() => {
      router.push(`/audit/${payload.id}`);
    });
  };

  return (
    <div className={`${dmSans.className} bg-white text-zinc-950 min-h-screen selection:bg-blue-100 selection:text-blue-900 scroll-smooth`}>
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/80 backdrop-blur-md border-b border-zinc-100 py-3" : "bg-transparent py-5"}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            SpendLens
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            <a href="#how-it-works" className="text-sm font-medium text-zinc-600 hover:text-blue-600 transition-colors">How it works</a>
            <a href="#features" className="text-sm font-medium text-zinc-600 hover:text-blue-600 transition-colors">Features</a>
          </div>

          <div className="hidden md:block">
            <a href="#audit" className="bg-zinc-950 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-zinc-800 transition-all">
              Get started
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 text-zinc-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-zinc-100 p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4">
            <a href="#how-it-works" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>How it works</a>
            <a href="#features" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#audit" className="bg-zinc-950 text-white px-5 py-3 rounded-xl text-center font-medium" onClick={() => setMobileMenuOpen(false)}>Get started</a>
          </div>
        )}
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-20 px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className={`${playfair.className} text-6xl md:text-8xl font-bold leading-[1.1] mb-8 tracking-tight text-black`}>
              Your AI spend,<br />
              <span className="italic text-blue-600">finally</span> visible.
            </h1>
            <p className="text-xl md:text-2xl text-zinc-500 max-w-2xl mx-auto mb-12 leading-relaxed">
              Track your AI tools, audit your stack, and cut costs — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#how-it-works" className="w-full sm:w-auto px-8 py-4 bg-zinc-950 text-white rounded-full font-medium text-lg hover:bg-zinc-800 transition-all text-center">
                See how it works
              </a>
              <a href="#audit" className="w-full sm:w-auto px-8 py-4 text-zinc-600 rounded-full font-medium text-lg hover:text-zinc-900 group transition-all flex items-center justify-center gap-2">
                Get started <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronDown size={32} className="text-zinc-300" />
          </div>
        </section>

        {/* Audit Section */}
        <section id="audit" className="py-24 px-6 bg-zinc-50 border-t border-zinc-100">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className={`${playfair.className} text-4xl font-bold mb-4`}>Start your audit</h2>
              <p className="text-zinc-500 max-w-xl mx-auto">Enter your team&apos;s AI tool usage below to see how much you could save.</p>
            </div>
            <SpendForm onSubmit={handleAuditSubmit} />
          </div>
        </section>

        {/* How it Works / Features Placeholder Sections to fulfill Nav links */}
        <section id="how-it-works" className="py-24 px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
            <div>
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 text-xl font-bold">1</div>
              <h3 className="text-xl font-bold mb-3">Connect your tools</h3>
              <p className="text-zinc-500">List all the AI subscriptions your team is currently paying for across engineering and product.</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 text-xl font-bold">2</div>
              <h3 className="text-xl font-bold mb-3">Analyze usage</h3>
              <p className="text-zinc-500">Our engine identifies seat overlaps, unused licenses, and better tier options based on team size.</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 text-xl font-bold">3</div>
              <h3 className="text-xl font-bold mb-3">Cut costs</h3>
              <p className="text-zinc-500">Get a personalized report with actionable steps to reduce your monthly AI bill by up to 30%.</p>
            </div>
          </div>
        </section>

        <section id="features" className="py-24 px-6 bg-zinc-50">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className={`${playfair.className} text-4xl font-bold mb-6`}>Built for teams that move fast.</h2>
                <p className="text-lg text-zinc-500 mb-8">Stop guessing where your AI budget is going. SpendLens gives you a clear view of your entire stack in minutes.</p>
                <ul className="space-y-4">
                  {[
                    "Multi-vendor cost tracking",
                    "Seat consolidation heuristics",
                    "Annual billing savings analysis",
                    "Public shareable audit reports"
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-xl">
                <div className="space-y-4">
                  <div className="h-4 w-1/3 bg-zinc-100 rounded" />
                  <div className="h-8 w-2/3 bg-zinc-950 rounded" />
                  <div className="pt-8 space-y-3">
                    <div className="h-12 w-full bg-zinc-50 rounded-xl border border-zinc-100" />
                    <div className="h-12 w-full bg-zinc-50 rounded-xl border border-zinc-100" />
                    <div className="h-12 w-full bg-zinc-50 rounded-xl border border-zinc-100" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 px-6 border-t border-zinc-100 text-center">
        <p className="text-zinc-400 text-sm">© {new Date().getFullYear()} SpendLens. All rights reserved.</p>
      </footer>
    </div>
  );
}
