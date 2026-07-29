"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faShip,
  faFileContract,
  faTruckFast,
  faScaleBalanced,
  faBoxesStacked,
  faMapLocationDot,
  faClockRotateLeft,
  faCheckDouble,
  faEarthAsia,
  faHandshake,
  faUsers,
  faBars,
  faXmark,
  faShieldHalved,
  faBuilding,
  faMapPin,
  faPhone,
  faEnvelope,
  faLightbulb,
  faGem,
  faCertificate,
  faHeadset
} from "@fortawesome/free-solid-svg-icons";

const services = [
  { icon: faScaleBalanced, title: "Customs Clearing & Forwarding", desc: "Expert navigation of customs regulations ensuring swift clearance." },
  { icon: faFileContract, title: "Trade Documentation", desc: "Meticulous management of all essential import and export paperwork." },
  { icon: faBoxesStacked, title: "Cargo Handling Coordination", desc: "Secure and efficient handling of goods at every port and terminal." },
  { icon: faShip, title: "Freight Forwarding Support", desc: "Reliable coordination of sea, air, and land freight movements." },
  { icon: faShieldHalved, title: "Regulatory Compliance", desc: "Complete adherence to local and international trade laws." },
  { icon: faClockRotateLeft, title: "Shipment Monitoring", desc: "Real-time tracking and proactive management of your cargo." },
  { icon: faTruckFast, title: "Transportation Coordination", desc: "Seamless inland logistics and final-mile delivery solutions." },
  { icon: faEarthAsia, title: "End-to-End Logistics", desc: "Comprehensive supply chain management from origin to destination." }
];

const features = [
  { icon: faClockRotateLeft, title: "40+ Years Experience", desc: "Four decades of proven excellence in Bangladesh's trade sector." },
  { icon: faHandshake, title: "Trusted Industry Partner", desc: "Generations of businesses rely on our dependable services." },
  { icon: faMapLocationDot, title: "Nationwide Operations", desc: "Strategic presence in all major commercial hubs and gateways." },
  { icon: faUsers, title: "Experienced Professionals", desc: "A dedicated team of logistics and customs experts at your service." },
  { icon: faScaleBalanced, title: "Regulatory Expertise", desc: "Deep understanding of evolving customs and trade policies." },
  { icon: faCheckDouble, title: "Reliable Service", desc: "Consistent, transparent, and timely execution of all operations." }
];

const values = [
  { title: "Integrity", icon: faShieldHalved },
  { title: "Professionalism", icon: faBuilding },
  { title: "Reliability", icon: faHandshake },
  { title: "Innovation", icon: faLightbulb },
  { title: "Excellence", icon: faGem },
  { title: "Customer Focus", icon: faHeadset }
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
          <Link className="flex items-center gap-2 group" href="/">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/30 transition-transform group-hover:scale-105">
              <span className="font-bold text-primary-foreground text-sm">DN</span>
            </div>
            <span className="font-bold text-lg tracking-tight">D.N Trade International</span>
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
                Employee Login <FontAwesomeIcon icon={faArrowRight} className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <FontAwesomeIcon icon={mobileMenuOpen ? faXmark : faBars} className="h-6 w-6" />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-background border-b px-4 py-6 flex flex-col gap-6 animate-in slide-in-from-top-2">
            <a href="#about" className="text-base font-medium" onClick={() => setMobileMenuOpen(false)}>About Us</a>
            <a href="#services" className="text-base font-medium" onClick={() => setMobileMenuOpen(false)}>Services</a>
            <a href="#presence" className="text-base font-medium" onClick={() => setMobileMenuOpen(false)}>Our Presence</a>
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full rounded-full">Employee Login</Button>
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
              <FontAwesomeIcon icon={faCertificate} className="h-4 w-4" />
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
                  Employee Login
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
                  <FontAwesomeIcon icon={faShip} className="h-32 w-32 text-primary/20 mb-8" />
                  <div className="text-2xl font-bold text-foreground/50">Bridging Borders Since 1980</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── OUR PRESENCE ── */}
        <section id="presence" className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-3">Strategic Network</h2>
              <h3 className="text-3xl md:text-4xl font-bold mb-4">Our Presence in Bangladesh</h3>
              <p className="text-muted-foreground text-lg">
                Operating through a strong nationwide network, we effectively manage trade and logistics across the most important commercial and transportation gateways.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {locations.map((loc) => (
                <div key={loc.name} className="group relative overflow-hidden rounded-2xl border bg-card p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10 transition-transform group-hover:scale-110"></div>
                  <FontAwesomeIcon icon={faMapPin} className="h-8 w-8 text-primary mb-6" />
                  <h4 className="text-xl font-bold mb-2">{loc.name}</h4>
                  <p className="text-sm text-muted-foreground">{loc.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── STATISTICS ── */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-x divide-primary-foreground/20">
              <div className="text-center px-4">
                <div className="text-4xl md:text-5xl font-extrabold mb-2">40+</div>
                <div className="text-primary-foreground/80 font-medium">Years of Experience</div>
              </div>
              <div className="text-center px-4">
                <div className="text-4xl md:text-5xl font-extrabold mb-2">1,000s</div>
                <div className="text-primary-foreground/80 font-medium">Trade Operations</div>
              </div>
              <div className="text-center px-4">
                <div className="text-4xl md:text-5xl font-extrabold mb-2">4+</div>
                <div className="text-primary-foreground/80 font-medium">Major Operational Hubs</div>
              </div>
              <div className="text-center px-4">
                <div className="text-4xl md:text-5xl font-extrabold mb-2">100%</div>
                <div className="text-primary-foreground/80 font-medium">Professional Commitment</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── OUR SERVICES ── */}
        <section id="services" className="py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-3">What We Do</h2>
              <h3 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Trade Services</h3>
              <p className="text-muted-foreground text-lg">
                Delivering end-to-end solutions that simplify complex international trade and logistics requirements.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((svc) => (
                <div key={svc.title} className="bg-background rounded-2xl border p-6 hover:border-primary/50 hover:shadow-md transition-all duration-300">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    <FontAwesomeIcon icon={svc.icon} className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="text-lg font-bold mb-3 leading-snug">{svc.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{svc.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW WE WORK (TIMELINE) ── */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How We Work</h2>
              <p className="text-muted-foreground">A seamless, integrated process from start to finish.</p>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative">
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -z-10 -translate-y-1/2"></div>
              {timeline.map((step, idx) => (
                <div key={step} className="flex flex-col items-center group w-full md:w-1/5 relative">
                  <div className="md:hidden absolute left-[19px] top-10 bottom-[-40px] w-0.5 bg-border -z-10"></div>
                  <div className="h-10 w-10 rounded-full bg-background border-2 border-primary flex items-center justify-center font-bold text-primary shadow-sm mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors z-10">
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
              {features.map((feat) => (
                <div key={feat.title} className="flex gap-4">
                  <div className="mt-1 shrink-0">
                    <FontAwesomeIcon icon={faCheckDouble} className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2">{feat.title}</h4>
                    <p className="text-muted-foreground text-sm">{feat.desc}</p>
                  </div>
                </div>
              ))}
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
              {values.map((val) => (
                <div key={val.title} className="bg-card border rounded-2xl p-6 text-center hover:border-primary/50 transition-colors">
                  <FontAwesomeIcon icon={val.icon} className="h-8 w-8 text-primary mb-4" />
                  <h4 className="font-bold">{val.title}</h4>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section id="contact" className="py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="rounded-[3rem] bg-gradient-to-br from-primary/10 via-background to-muted border p-12 md:p-20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10"></div>
              
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
                Ready to Work With a Trusted Trade Partner?
              </h2>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Discover how our four decades of experience can streamline your trade operations today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="rounded-full px-10 h-14 text-base shadow-xl shadow-primary/20">
                  <FontAwesomeIcon icon={faEnvelope} className="mr-2 h-4 w-4" /> Contact Us
                </Button>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="rounded-full px-10 h-14 text-base bg-background">
                    Employee Login
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
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <span className="font-bold text-primary-foreground text-xs">DN</span>
                </div>
                <span className="font-bold text-lg">D.N Trade International</span>
              </Link>
              <p className="text-muted-foreground text-sm max-w-sm mb-6 leading-relaxed">
                A trusted partner in trade, logistics, and business success for over 40 years.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 uppercase tracking-wider text-xs">Office Locations</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><FontAwesomeIcon icon={faMapPin} className="w-4 h-4 text-primary/70" /> Dhaka (HQ)</li>
                <li className="flex items-center gap-2"><FontAwesomeIcon icon={faMapPin} className="w-4 h-4 text-primary/70" /> Chattogram</li>
                <li className="flex items-center gap-2"><FontAwesomeIcon icon={faMapPin} className="w-4 h-4 text-primary/70" /> Benapole</li>
                <li className="flex items-center gap-2"><FontAwesomeIcon icon={faMapPin} className="w-4 h-4 text-primary/70" /> Narayanganj</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 uppercase tracking-wider text-xs">Contact Us</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
                  <FontAwesomeIcon icon={faPhone} className="w-4 h-4 text-primary/70" /> +880 1234-567890
                </li>
                <li className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
                  <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4 text-primary/70" /> contact@dntrade.com
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
