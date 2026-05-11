"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: "Features", href: "#features" },
  { label: "Audit", href: "#audit" },
  { label: "Preview", href: "#admin" },
];

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-fixed transition-all duration-normal ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-md border-b border-stone"
          : "bg-white border-b border-stone"
      }`}
      style={{ height: "var(--nav-height)" }}
    >
      <div className="container h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="text-h3 font-serif font-normal text-ink">
            SpendLens
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-body text-mid font-normal hover:text-ink transition-colors duration-fast"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button className="px-lg py-md text-body font-normal text-ink hover:text-accent transition-colors duration-fast">
            Sign in
          </button>
          <a
            href="#audit"
            className="px-lg py-md text-body font-normal text-white bg-ink rounded-pill hover:bg-accent transition-all duration-fast"
          >
            Start Audit →
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-md text-ink"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-stone">
          <div className="container py-lg flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-body text-mid hover:text-ink transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-md border-t border-stone">
              <button className="w-full px-lg py-md text-body font-normal text-ink border border-stone rounded-pill hover:bg-off transition-colors duration-fast">
                Sign in
              </button>
              <a
                href="#audit"
                onClick={() => setIsOpen(false)}
                className="w-full px-lg py-md text-center text-body font-normal text-white bg-ink rounded-pill hover:bg-accent transition-all duration-fast"
              >
                Start Audit →
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
