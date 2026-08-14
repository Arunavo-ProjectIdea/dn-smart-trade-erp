"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ArrowRight,
  Ship,
  FileText,
  Truck,
  Scale,
  Package,
  MapPin,
  History,
  CheckCheck,
  Globe,
  Handshake,
  Users,
  Menu,
  X,
  Shield,
  Building,
  Phone,
  Mail,
  Lightbulb,
  Award,
  Headphones,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

const services = [
  { icon: Scale, title: "Customs Clearing & Forwarding", desc: "Expert navigation of customs regulations ensuring swift clearance." },
  { icon: FileText, title: "Trade Documentation", desc: "Meticulous management of all essential import and export paperwork." },
  { icon: Package, title: "Cargo Handling Coordination", desc: "Secure and efficient handling of goods at every port and terminal." },
  { icon: Ship, title: "Freight Forwarding Support", desc: "Reliable coordination of sea, air, and land freight movements." },
  { icon: Shield, title: "Regulatory Compliance", desc: "Complete adherence to local and international trade laws." },
  { icon: History, title: "Shipment Monitoring", desc: "Real-time tracking and proactive management of your cargo." },
  { icon: Truck, title: "Transportation Coordination", desc: "Seamless inland logistics and final-mile delivery solutions." },
  { icon: Globe, title: "End-to-End Logistics", desc: "Comprehensive supply chain management from origin to destination." }
];

const features = [
  { icon: History, title: "40+ Years Experience", desc: "Four decades of proven excellence in Bangladesh's trade sector." },
  { icon: Handshake, title: "Trusted Industry Partner", desc: "Generations of businesses rely on our dependable services." },
  { icon: MapPin, title: "Nationwide Operations", desc: "Strategic presence in all major commercial hubs and gateways." },
  { icon: Users, title: "Experienced Professionals", desc: "A dedicated team of logistics and customs experts at your service." },
  { icon: Scale, title: "Regulatory Expertise", desc: "Deep understanding of evolving customs and trade policies." },
  { icon: CheckCheck, title: "Reliable Service", desc: "Consistent, transparent, and timely execution of all operations." }
];

const values = [
  { title: "Integrity", icon: Shield },
  { title: "Professionalism", icon: Building },
  { title: "Reliability", icon: Handshake },
  { title: "Innovation", icon: Lightbulb },
  { title: "Excellence", icon: Award },
  { title: "Customer Focus", icon: Headphones }
];

const locations = [
  { name: "Dhaka", desc: "Corporate HQ & Central Operations" },
  { name: "Chattogram", desc: "Primary Seaport Logistics" },
  { name: "Benapole", desc: "Major Land Port Operations" },
  { name: "Narayanganj", desc: "River Port & Inland Hub" }
];

const timeline = [
  "Documentation",
  "Customs Clearance",
  "Cargo Handling",
  "Transportation",
  "Delivery"
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
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      
      {/* ── HEADER ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-background/95 backdrop-blur-md border-b shadow-sm" : "bg-transparent py-2"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/">
            <BrandLogo withText={true} />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">About Us</a>
            <a href="#services" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Services</a>
            <a href="#presence" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Our Presence</a>
            <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Contact</a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login">
              <Button size="sm" className="gap-2 rounded-full px-5 shadow-md hover:shadow-lg transition-all">
                Login <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-background border-b px-4 py-6 flex flex-col gap-6 animate-in slide-in-from-top-2">
            <a href="#about" className="text-base font-medium" onClick={() => setMobileMenuOpen(false)}>About Us</a>
            <a href="#services" className="text-base font-medium" onClick={() => setMobileMenuOpen(false)}>Services</a>
            <a href="#presence" className="text-base font-medium" onClick={() => setMobileMenuOpen(false)}>Our Presence</a>
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full rounded-full">Login</Button>
            </Link>
          </div>
        )}
      </header>

      <main className="flex-1">
        
        {/* ── HERO ── */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-8 border border-primary/20">
              <Award className="h-4 w-4" />
              Est. 1980
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-6 max-w-4xl leading-[1.1]">
              Trusted Trade, Customs & Logistics Solutions for <span className="text-primary">Over 40 Years</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
              We simplify international trade and deliver reliable logistics solutions through professionalism, expertise, and decades of innovation in Bangladesh.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="#contact" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto rounded-full px-8 text-base h-14 shadow-xl shadow-primary/20">
                  Contact Us
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8 text-base h-14 bg-background/50 backdrop-blur-sm border-2">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── ABOUT COMPANY ── */}
        <section id="about" className="py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
                <div>
                  <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-3">About D.N Trade International</h2>
                  <h3 className="text-3xl md:text-4xl font-bold leading-tight">A Foundation of Integrity and Operational Excellence.</h3>
                </div>
                <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
                  <p>
                    For more than four decades, D.N Trade International has stood as a trusted partner in Bangladesh&apos;s trade, logistics, customs clearance, and supply chain industry. 
                  </p>
                  <p>
                    Established over 40 years ago, we have grown alongside Bangladesh&apos;s expanding economy. We continuously adapt to changing customs regulations, evolving global trade practices, and emerging logistics challenges, enabling us to deliver dependable solutions across diverse industries.
                  </p>
                  <p>
                    Our longevity reflects not only our experience but also the trust and confidence that generations of businesses have placed in our services. We are more than a service provider—we are a partner in your business success.
                  </p>
                </div>
              </div>
              <div className="relative aspect-square lg:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border bg-card">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-muted flex flex-col items-center justify-center p-8 text-center border-8 border-background">
                  <Ship className="h-32 w-32 text-primary/20 mb-8" />
                  <div className="text-2xl font-bold text-foreground/50">Bridging Borders Since 1980</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SERVICES ── */}
        <section id="services" className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-3">Our Core Services</h2>
              <h3 className="text-3xl md:text-4xl font-bold">Comprehensive Solutions for Global Trade</h3>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((srv) => {
                const IconComp = srv.icon;
                return (
                  <div key={srv.title} className="bg-card border rounded-3xl p-8 hover:border-primary/50 transition-all hover:shadow-xl group flex flex-col justify-between">
                    <div>
                      <div className="p-4 rounded-2xl bg-primary/10 w-fit text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <IconComp className="h-7 w-7" />
                      </div>
                      <h4 className="font-bold text-xl mb-3">{srv.title}</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">{srv.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── LOCATIONS & PRESENCE ── */}
        <section id="presence" className="py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-3">Strategic Network</h2>
              <h3 className="text-3xl md:text-4xl font-bold mb-4">Our Operational Presence</h3>
              <p className="text-muted-foreground max-w-xl mx-auto">Positioned across Bangladesh&apos;s key trade hubs to serve you efficiently.</p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {locations.map((loc) => (
                <div key={loc.name} className="bg-card border rounded-2xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h4 className="font-bold text-lg">{loc.name}</h4>
                  </div>
                  <p className="text-muted-foreground text-sm">{loc.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROCESS TIMELINE ── */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-3">Seamless Workflow</h2>
              <h3 className="text-3xl md:text-4xl font-bold">How We Facilitate Your Trade</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {timeline.map((step, idx) => (
                <div key={step} className="relative flex flex-col items-center p-6 bg-card border rounded-2xl text-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center mb-4">
                    {idx + 1}
                  </div>
                  <h5 className="font-bold text-center bg-background px-2">{step}</h5>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY CHOOSE US ── */}
        <section className="py-24 bg-muted/50 border-y">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us</h2>
              <p className="text-muted-foreground">The D.N Trade International Advantage</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feat) => {
                const IconComp = feat.icon;
                return (
                  <div key={feat.title} className="flex gap-4">
                    <div className="mt-1 shrink-0">
                      <IconComp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-2">{feat.title}</h4>
                      <p className="text-muted-foreground text-sm">{feat.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── MISSION & VISION ── */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="rounded-3xl bg-card border p-10 lg:p-12 shadow-sm hover:shadow-lg transition-shadow">
                <h3 className="text-sm font-bold tracking-widest text-primary uppercase mb-6">Our Vision</h3>
                <p className="text-2xl md:text-3xl font-medium leading-snug">
                  To become one of Bangladesh&apos;s most reliable and respected trade facilitation and logistics companies.
                </p>
              </div>
              <div className="rounded-3xl bg-primary text-primary-foreground p-10 lg:p-12 shadow-md">
                <h3 className="text-sm font-bold tracking-widest text-primary-foreground/80 uppercase mb-6">Our Mission</h3>
                <p className="text-2xl md:text-3xl font-medium leading-snug">
                  To simplify international trade while delivering reliable logistics solutions through professionalism, expertise, and innovation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── COMPANY VALUES ── */}
        <section className="py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {values.map((val) => {
                const IconComp = val.icon;
                return (
                  <div key={val.title} className="bg-card border rounded-2xl p-6 text-center hover:border-primary/50 transition-colors flex flex-col items-center">
                    <IconComp className="h-8 w-8 text-primary mb-4" />
                    <h4 className="font-bold">{val.title}</h4>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── CTA / CONTACT ── */}
        <section id="contact" className="py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="rounded-[3rem] bg-gradient-to-br from-primary/10 via-background to-muted border p-12 md:p-20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10"></div>
              
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
                Ready to Work With a Trusted Trade Partner?
              </h2>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Discover how our four decades of experience can streamline your trade operations today. Reach out to our team.
              </p>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-10">
                <div className="flex items-center gap-4 bg-background px-6 py-4 rounded-2xl shadow-sm border">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-muted-foreground font-medium">Call Us</p>
                    <p className="text-lg font-bold">+880 1234-567890</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 bg-background px-6 py-4 rounded-2xl shadow-sm border">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-muted-foreground font-medium">Email Us</p>
                    <p className="text-lg font-bold">contact@dntrade.com</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Link href="/login">
                  <Button size="lg" className="rounded-full px-10 h-14 text-base shadow-lg shadow-primary/20">
                    Go to Client Portal
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-muted pt-16 pb-8 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <Link className="flex items-center gap-2 mb-6" href="/">
                <BrandLogo width={32} height={32} withText={true} />
              </Link>
              <p className="text-muted-foreground text-sm max-w-sm mb-6 leading-relaxed">
                A trusted partner in trade, logistics, and business success for over 40 years.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 uppercase tracking-wider text-xs">Office Locations</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary/70" /> Dhaka (HQ)</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary/70" /> Chattogram</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary/70" /> Benapole</li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary/70" /> Narayanganj</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 uppercase tracking-wider text-xs">Contact Us</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
                  <Phone className="w-4 h-4 text-primary/70" /> +880 1234-567890
                </li>
                <li className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
                  <Mail className="w-4 h-4 text-primary/70" /> contact@dntrade.com
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} D.N Trade International. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
              <Link href="/login" className="hover:text-foreground transition-colors">Employee Portal</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
