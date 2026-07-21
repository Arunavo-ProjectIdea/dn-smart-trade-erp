"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  Globe,
  Shield,
  Zap,
  Package,
  FileText,
  Users,
  TrendingUp,
  CheckCircle2,
  ChevronRight,
  Star,
  Menu,
  X,
} from "lucide-react";

const stats = [
  { label: "Active Shipments", value: "12,400+", icon: Package },
  { label: "Global Clients", value: "3,200+", icon: Users },
  { label: "Documents Processed", value: "98,000+", icon: FileText },
  { label: "Ports Connected", value: "180+", icon: Globe },
];

const features = [
  {
    icon: Globe,
    title: "Global Shipment Tracking",
    description:
      "Monitor cargo movements across all ports in real-time with interactive timelines and live status updates.",
    color: "from-blue-500/20 to-cyan-500/20",
    border: "border-blue-500/30",
    iconColor: "text-blue-400",
  },
  {
    icon: Zap,
    title: "AI Customs Processing",
    description:
      "Automate HS Code classification and duty calculations. Reduce errors and processing time by up to 80%.",
    color: "from-amber-500/20 to-orange-500/20",
    border: "border-amber-500/30",
    iconColor: "text-amber-400",
  },
  {
    icon: Shield,
    title: "Secure Document Vault",
    description:
      "Store and manage sensitive trade documents with enterprise-grade security and granular role-based access control.",
    color: "from-emerald-500/20 to-green-500/20",
    border: "border-emerald-500/30",
    iconColor: "text-emerald-400",
  },
  {
    icon: TrendingUp,
    title: "Advanced Analytics",
    description:
      "Get deep insights into your trade operations with visual reports, KPI dashboards, and predictive intelligence.",
    color: "from-purple-500/20 to-violet-500/20",
    border: "border-purple-500/30",
    iconColor: "text-purple-400",
  },
  {
    icon: FileText,
    title: "BOE Management",
    description:
      "Streamline Bill of Entry filing and management. Track duty status and automate compliance documentation.",
    color: "from-rose-500/20 to-pink-500/20",
    border: "border-rose-500/30",
    iconColor: "text-rose-400",
  },
  {
    icon: Users,
    title: "Multi-Role Access",
    description:
      "Role-based access for Admins, Employees, and Clients. Each role sees exactly what they need — nothing more.",
    color: "from-sky-500/20 to-indigo-500/20",
    border: "border-sky-500/30",
    iconColor: "text-sky-400",
  },
];

const plans = [
  {
    name: "Starter",
    price: "$299",
    period: "/mo",
    description: "Perfect for small import/export businesses.",
    features: ["Up to 5 users", "100 shipments/month", "Basic analytics", "Document vault (10GB)", "Email support"],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Business",
    price: "$799",
    period: "/mo",
    description: "For growing freight and logistics companies.",
    features: [
      "Up to 25 users",
      "Unlimited shipments",
      "AI customs processing",
      "Document vault (100GB)",
      "Priority support",
      "Advanced analytics",
    ],
    cta: "Start Free Trial",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large-scale international trade operations.",
    features: [
      "Unlimited users",
      "Unlimited shipments",
      "Custom AI models",
      "Unlimited storage",
      "Dedicated account manager",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    highlight: false,
  },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* ── HEADER ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-background/95 backdrop-blur-md border-b shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link className="flex items-center gap-2" href="/">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/30">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">DN Smart Trade</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#stats" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Stats</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/login">
              <Button size="sm" className="gap-1">
                Access Portal <ChevronRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-md"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background border-b px-4 py-4 flex flex-col gap-4">
            <a href="#features" className="text-sm" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#pricing" className="text-sm" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full">Access Portal</Button>
            </Link>
          </div>
        )}
      </header>

      <main className="flex-1 pt-16">
        {/* ── HERO ── */}
        <section className="relative overflow-hidden py-24 md:py-36 lg:py-44">
          {/* Gradient background blobs */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary mb-8">
              <Star className="h-3.5 w-3.5 fill-primary" />
              <span>AI-Powered Trade ERP Platform — 2026</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
              Smarter Global Trade,{" "}
              <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                Powered by AI
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground mb-10">
              DN Smart Trade ERP unifies shipment tracking, customs processing, BOE management, and document handling —
              all in one intelligent platform built for modern international trade.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login">
                <Button size="lg" className="gap-2 text-base px-8 shadow-lg shadow-primary/30">
                  Access ERP Portal <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="gap-2 text-base px-8">
                  Try Demo Free
                </Button>
              </Link>
            </div>

            {/* Hero trust line */}
            <p className="mt-8 text-xs text-muted-foreground">
              No credit card required · Admin, Employee & Client roles · Fully functional demo
            </p>
          </div>
        </section>

        {/* ── STATS ── */}
        <section id="stats" className="py-16 border-y bg-muted/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center text-center gap-2">
                  <stat.icon className="h-7 w-7 text-primary mb-1" />
                  <div className="text-3xl font-extrabold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section id="features" className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Everything You Need to{" "}
                <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                  Trade Globally
                </span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                A comprehensive suite of tools purpose-built for importers, exporters, freight forwarders, and customs agents.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f) => (
                <div
                  key={f.title}
                  className={`relative rounded-2xl border ${f.border} bg-gradient-to-br ${f.color} p-6 hover:scale-[1.02] transition-transform duration-200`}
                >
                  <div className={`inline-flex p-3 rounded-xl bg-background/60 mb-4 ${f.iconColor}`}>
                    <f.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section id="pricing" className="py-24 bg-muted/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Start free, scale as you grow. No hidden fees. Cancel anytime.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 items-start">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-2xl border p-8 flex flex-col gap-6 ${
                    plan.highlight
                      ? "border-primary bg-primary/5 shadow-xl shadow-primary/10 relative"
                      : "border-border bg-card"
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-xl mb-1">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-extrabold">{plan.price}</span>
                    <span className="text-muted-foreground mb-1">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 flex-1">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <Link href="/login">
                    <Button
                      className="w-full"
                      variant={plan.highlight ? "default" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="relative rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-background to-blue-500/10 p-12 overflow-hidden">
              <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
              <div className="relative">
                <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
                  Ready to Modernize Your Trade Operations?
                </h2>
                <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                  Join thousands of businesses using DN Smart Trade ERP to manage shipments, automate customs, and scale globally.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/login">
                    <Button size="lg" className="gap-2 px-8 shadow-lg shadow-primary/30">
                      Start Now — It&apos;s Free <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline" className="px-8">
                      View Live Demo
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                <BarChart3 className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-sm">DN Smart Trade ERP</span>
            </div>
            <p className="text-xs text-muted-foreground">
              &copy; 2026 DN Smart Trade. All rights reserved.
            </p>
            <nav className="flex gap-6">
              <Link className="text-xs text-muted-foreground hover:text-foreground transition-colors" href="#">
                Terms
              </Link>
              <Link className="text-xs text-muted-foreground hover:text-foreground transition-colors" href="#">
                Privacy
              </Link>
              <Link className="text-xs text-muted-foreground hover:text-foreground transition-colors" href="#">
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
