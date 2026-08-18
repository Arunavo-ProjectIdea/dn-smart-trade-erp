"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch, faInfoCircle, faLifeRing, faChevronDown, faChevronUp, faTicket, faBook, faRobot, faArrowRight } from "@fortawesome/free-solid-svg-icons"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { createSupportRequest, type SupportRequestFormValues } from "@/actions/support.actions"

type SupportRequest = {
  id: string
  subject: string
  category: string
  priority: string
  status: string
  created_at: string
}

const formSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  category: z.string().min(1, "Category is required"),
  priority: z.enum(["Low", "Medium", "High"], { required_error: "Priority is required" }),
  description: z.string().min(10, "Description must be at least 10 characters"),
})

export function HelpCenterClient({ initialSupportRequests, role }: { initialSupportRequests: SupportRequest[], role: string }) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const form = useForm<SupportRequestFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      category: "",
      description: "",
    },
  })

  async function onSubmit(values: SupportRequestFormValues) {
    setIsSubmitting(true)
    try {
      const res = await createSupportRequest(values)
      if (res.success) {
        toast.success("Support request submitted successfully")
        form.reset()
      } else {
        toast.error(res.error || "Failed to submit request")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const faqs = [
    { category: "Authentication", question: "How do I reset my password?", answer: "Navigate to the login screen and click 'Forgot Password'. Follow the email instructions." },
    { category: "Clients", question: "How do I add a new client?", answer: "Go to the Clients page and click 'Add Client'. Fill in the necessary details like company name and tax numbers." },
    { category: "Employees", question: "What are employee roles?", answer: "Roles define permissions. Admins have full access, while standard Employees have restricted views based on their assignments." },
    { category: "Shipments", question: "How can I track a shipment?", answer: "Open the Shipments page and click on a specific shipment to view its timeline and current status." },
    { category: "BOE", question: "How do I create a Bill of Entry?", answer: "Go to the BOE section, click 'New BOE', and link it to an existing shipment." },
    { category: "HS Codes", question: "Where do I search HS Codes?", answer: "Use the HS Codes module or the AI Assistant to quickly find product classifications and duty rates." },
    { category: "Duty Calculator", question: "Is the Duty Calculator accurate?", answer: "It provides an estimate based on the latest tariff rates in our system. Final customs assessment may vary slightly." },
    { category: "AI Companion", question: "What can the AI Assistant do?", answer: "It can answer questions about your data, classify products, and predict shipment timelines based on historical records." },
  ]

  const guides = [
    { title: "Create Client", desc: "Step-by-step guide to onboarding a new client.", content: "To onboard a new client, go to the 'Clients' module and click the 'Add Client' button. You'll need their company name, contact information, and billing details. If you'd like them to be able to login, make sure to check the 'Create Login Account' box. After creation, you'll be shown a temporary password to share with them." },
    { title: "Create Employee", desc: "How to set up accounts for your team members.", content: "Navigate to the 'Employees' section and click 'New Employee'. Fill out their name, role, department, and contact info. The system will auto-generate a temporary password. New employees will be required to change this password on their first login for security." },
    { title: "Create Shipment", desc: "Learn how to record a new import or export.", content: "Go to the 'Shipments' dashboard and select 'New Shipment'. Enter the origin, destination, shipping lines, and the linked client. You can also add products and their associated HS Codes directly from the shipment creation screen." },
    { title: "Upload Documents", desc: "Managing Commercial Invoices and Packing Lists.", content: "Open any Shipment or Bill of Entry and navigate to the 'Documents' tab. Click 'Upload' and select your files. Supported formats include PDF, JPG, and PNG. Documents can be tagged and categorized for easy retrieval." },
    { title: "Use HS Code Search", desc: "Tips for finding the correct product classification.", content: "Use the HS Codes module to browse the official tariff schedule. You can search by keywords or section. If you're unsure, ask the AI Assistant to recommend the most appropriate HS code based on a product description." },
    { title: "Use AI Duty Calculator", desc: "How to generate accurate tax estimates.", content: "The Duty Calculator uses the latest customs data. Enter the HS Code, declared value, and origin. The AI will compute CD, SD, VAT, AIT, and AT, giving you a comprehensive estimate of the total duties payable." },
  ]

  const filteredFaqs = faqs.filter(f => 
    f.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredGuides = guides.filter(g =>
    g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.desc.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Global Search */}
      <div className="relative max-w-2xl mx-auto w-full mb-8">
        <div className="relative">
          <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search FAQs, guides, and documentation..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 text-base rounded-2xl bg-background border-border shadow-sm focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
      </div>

      <Tabs defaultValue="faq" className="w-full">
        <TabsList className={`grid w-full mb-8 h-12 bg-muted/50 p-1 rounded-xl ${role === 'Client' ? 'grid-cols-4' : 'grid-cols-3'}`}>
          <TabsTrigger value="faq" className="rounded-lg">FAQ</TabsTrigger>
          <TabsTrigger value="guides" className="rounded-lg">User Guides</TabsTrigger>
          {role === 'Client' && <TabsTrigger value="support" className="rounded-lg">Support</TabsTrigger>}
          <TabsTrigger value="ai" className="rounded-lg">AI Assistant</TabsTrigger>
        </TabsList>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-4 outline-none">
          <Card className="border-border/60 shadow-sm rounded-xl">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Quick answers to common questions.</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No FAQs found matching your search.</div>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqs.map((faq, idx) => (
                    <AccordionItem key={idx} value={`item-${idx}`}>
                      <AccordionTrigger className="text-base hover:no-underline text-left">
                        <span className="flex items-center gap-3">
                          <Badge variant="secondary" className="font-normal">{faq.category}</Badge>
                          {faq.question}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Guides Tab */}
        <TabsContent value="guides" className="space-y-4 outline-none">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredGuides.length === 0 ? (
              <div className="col-span-full text-center py-8 text-muted-foreground">No guides found matching your search.</div>
            ) : (
              filteredGuides.map((guide, idx) => (
                <Sheet key={idx}>
                  <SheetTrigger className="w-full text-left appearance-none bg-transparent border-none p-0 m-0">
                    <Card className="border-border/60 shadow-sm hover:border-primary/50 transition-all cursor-pointer group rounded-xl">
                      <CardHeader>
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                          <FontAwesomeIcon icon={faBook} className="h-4 w-4 text-primary" />
                        </div>
                        <CardTitle className="text-lg">{guide.title}</CardTitle>
                        <CardDescription>{guide.desc}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button variant="ghost" className="w-full justify-between group-hover:text-primary p-0 h-auto" type="button">
                          Read Guide
                          <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3" />
                        </Button>
                      </CardContent>
                    </Card>
                  </SheetTrigger>
                  <SheetContent className="w-[400px] sm:w-[540px] p-6 overflow-y-auto">
                    <SheetHeader className="p-0 mb-6">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <FontAwesomeIcon icon={faBook} className="h-6 w-6 text-primary" />
                      </div>
                      <SheetTitle className="text-2xl">{guide.title}</SheetTitle>
                      <SheetDescription className="text-base">{guide.desc}</SheetDescription>
                    </SheetHeader>
                    <div className="space-y-4 text-base leading-relaxed text-foreground">
                      {guide.content}
                    </div>
                  </SheetContent>
                </Sheet>
              ))
            )}
          </div>
        </TabsContent>

        {/* Support Tab */}
        {role === 'Client' && (
        <TabsContent value="support" className="space-y-8 outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-border/60 shadow-sm rounded-xl">
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>Submit a ticket and we&apos;ll get back to you.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input placeholder="Brief summary of the issue" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Technical">Technical</SelectItem>
                                <SelectItem value="Billing">Billing</SelectItem>
                                <SelectItem value="General">General</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Priority</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Low">Low</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="High">High</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Please describe your issue in detail..." 
                              className="min-h-[120px] resize-none"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" disabled={isSubmitting} className="w-full">
                      {isSubmitting ? "Submitting..." : "Submit Request"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card className="border-border/60 shadow-sm rounded-xl">
              <CardHeader>
                <CardTitle>My Support Requests</CardTitle>
                <CardDescription>Track the status of your submitted tickets.</CardDescription>
              </CardHeader>
              <CardContent>
                {initialSupportRequests.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground flex flex-col items-center">
                    <FontAwesomeIcon icon={faTicket} className="h-8 w-8 mb-4 text-muted-foreground/50" />
                    <p>You haven&apos;t submitted any support requests yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {initialSupportRequests.map((req) => (
                      <div key={req.id} className="p-4 rounded-lg border border-border bg-muted/30">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-sm line-clamp-1 flex-1 pr-4">{req.subject}</h4>
                          <Badge variant={req.status === 'Open' ? 'default' : 'secondary'}>{req.status}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{req.category}</span>
                          <span>•</span>
                          <span className={
                            req.priority === 'High' ? 'text-destructive font-medium' : 
                            req.priority === 'Medium' ? 'text-amber-500 font-medium' : ''
                          }>{req.priority} Priority</span>
                          <span>•</span>
                          <span>{new Date(req.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        )}

        {/* AI Assistant Tab */}
        <TabsContent value="ai" className="outline-none">
          <Card className="border-border/60 shadow-sm rounded-xl overflow-hidden bg-primary/5 border-primary/20">
            <div className="flex flex-col md:flex-row items-center p-8 gap-8">
              <div className="h-32 w-32 shrink-0 rounded-full bg-primary/20 flex items-center justify-center relative">
                 <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-pulse" />
                 <FontAwesomeIcon icon={faRobot} className="h-12 w-12 text-primary" />
              </div>
              <div className="flex-1 text-center md:text-left space-y-4">
                <h3 className="text-2xl font-bold tracking-tight">AI Help Assistant</h3>
                <p className="text-muted-foreground max-w-lg">
                  Skip the documentation. Ask our Groq-powered AI Assistant about HS Codes, Shipments, Duties, or how to use any feature in the ERP.
                </p>
                <Button 
                  size="lg" 
                  className="gap-2" 
                  onClick={() => router.push('/ai-assistant')}
                >
                  <FontAwesomeIcon icon={faRobot} />
                  Open AI Companion
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
