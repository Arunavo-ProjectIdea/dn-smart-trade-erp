"use client"

import { PageHeader } from "@/components/erp/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search, Book, Truck, FileText, HelpCircle, MessageCircle } from "lucide-react"
import { toast } from "sonner"

export default function HelpPage() {
  const handleCategoryClick = (category: string) => {
    toast.info(`Opening "${category}" documentation...`)
  }

  const handleContactSupport = () => {
    toast.success("Support ticket initiated! A representative will contact you shortly.")
  }

  return (
    <div className="flex flex-col gap-8 pb-10 max-w-5xl mx-auto w-full animate-in fade-in duration-500">
      <PageHeader 
        title="Documentation & Help"
        description="Learn how to use DN Smart Trade ERP effectively."
      />
      
      {/* Search Section */}
      <div className="relative max-w-2xl mx-auto w-full mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search documentation, articles, and FAQs..." 
            className="pl-10 h-12 text-base rounded-full bg-background border-muted-foreground/30 shadow-sm"
          />
        </div>
      </div>

      {/* Categories / Documentation layout */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Categories</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card onClick={() => handleCategoryClick("Getting Started")} className="rounded-xl border-border/60 shadow-sm hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group">
            <CardHeader>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Book className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>Basic concepts and navigation.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Learn how to navigate the dashboard, set up your profile, and understand the core features of the platform.
            </CardContent>
          </Card>
          
          <Card onClick={() => handleCategoryClick("Managing Shipments")} className="rounded-xl border-border/60 shadow-sm hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group">
            <CardHeader>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Managing Shipments</CardTitle>
              <CardDescription>Create and track shipments.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Step-by-step guide on creating new shipments, updating statuses, and tracking cargo across the globe.
            </CardContent>
          </Card>
          
          <Card onClick={() => handleCategoryClick("Document Management")} className="rounded-xl border-border/60 shadow-sm hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group">
            <CardHeader>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Document Management</CardTitle>
              <CardDescription>Upload and organize files.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              How to upload Commercial Invoices, Packing Lists, and link them to specific Clients and Shipments.
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ Layout */}
      <div className="space-y-4 mt-8">
        <h2 className="text-2xl font-semibold tracking-tight">Frequently Asked Questions</h2>
        <Card className="px-6 py-2 rounded-xl border-border/60 shadow-sm">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-base hover:no-underline">How do I reset my password?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                You can reset your password by going to the Settings page or clicking &quot;Forgot Password&quot; on the login screen.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-base hover:no-underline">Can I export shipment reports?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes, navigate to the Reports module where you can export all your shipment and customs data in CSV or PDF formats.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-base hover:no-underline">How is customs duty calculated?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Duty is calculated based on the HS code of the goods and the destination country&apos;s current tariff rates. Use the Duty Calculator tool for exact estimates.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      </div>

      {/* Support Cards */}
      <div className="mt-8 p-6 bg-muted rounded-xl flex flex-col sm:flex-row items-center justify-between gap-6 border">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center shrink-0 shadow-sm">
            <HelpCircle className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Still need help?</h3>
            <p className="text-sm text-muted-foreground">Our support team is available 24/7 to assist you with any queries.</p>
          </div>
        </div>
        <Button size="lg" className="shrink-0 gap-2" onClick={handleContactSupport}>
          <MessageCircle className="h-4 w-4" />
          Contact Support
        </Button>
      </div>

    </div>
  )
}
