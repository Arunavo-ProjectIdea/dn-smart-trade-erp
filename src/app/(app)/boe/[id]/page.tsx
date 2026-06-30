"use client"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { 
  Building2, 
  MapPin, 
  FileText, 
  ArrowLeft, 
  Pencil, 
  Printer, 
  Compass, 
  Anchor,
  UserCheck,
  CheckCircle2,
  AlertCircle
} from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getBOEById, saveBOE, BillOfEntry, BOEStatus } from "@/lib/mock-data/boe"

export default function BOEDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [boe, setBoe] = useState<BillOfEntry | null>(null)
  const [currentStatus, setCurrentStatus] = useState<BOEStatus>("Draft")

  // Load BOE details
  useEffect(() => {
    const initData = async () => {
      const item = getBOEById(id)
      if (item) {
        setBoe(item)
        setCurrentStatus(item.status)
      }
    }
    initData()
  }, [id])

  if (boe === null) {
    // loading or not found
    return <div className="p-8 text-center text-muted-foreground">Loading Bill of Entry...</div>
  }

  // Handle status update
  const handleStatusChange = (newStatus: BOEStatus) => {
    if (boe) {
      const updated = { ...boe, status: newStatus }
      saveBOE(updated)
      setBoe(updated)
      setCurrentStatus(newStatus)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  // Visual status steps
  const steps = [
    { label: "Create / Draft", status: "Draft" as BOEStatus },
    { label: "Submitted", status: "Submitted" as BOEStatus },
    { label: "Verification", status: "Under Verification" as BOEStatus },
    { label: "Approved", status: "Approved" as BOEStatus }
  ]

  const getStepIndex = (status: BOEStatus) => {
    if (status === "Rejected") return 2 // Rejected shows alert in verification stage
    return steps.findIndex(s => s.status === status)
  }

  const activeStepIdx = getStepIndex(currentStatus)
  const isEditable = currentStatus === "Draft" || currentStatus === "Rejected"

  const getStatusBadge = (status: BOEStatus) => {
    switch (status) {
      case "Approved":
        return <Badge className="bg-success/10 text-success hover:bg-success/20 border-success/20 font-medium" variant="outline">Approved</Badge>
      case "Submitted":
        return <Badge className="bg-warning/10 text-warning hover:bg-warning/20 border-warning/20 font-medium" variant="outline">Submitted</Badge>
      case "Under Verification":
        return <Badge className="bg-info/10 text-info hover:bg-info/20 border-info/20 font-medium" variant="outline">Under Verification</Badge>
      case "Rejected":
        return <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20 font-medium" variant="outline">Rejected</Badge>
      case "Draft":
      default:
        return <Badge className="bg-muted text-muted-foreground hover:bg-muted/80 font-medium" variant="outline">Draft</Badge>
    }
  }

  return (
    <div className="flex flex-col gap-8 pb-10">
      
      {/* Print Specific Stylesheet */}
      <style jsx global>{`
        @media print {
          /* Hide sidebar, page headers, buttons */
          nav, header, aside, .no-print, button, .button-variants, footer {
            display: none !important;
          }
          
          /* Main container resets */
          main, .flex-1, .app-layout {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
            width: 100% !important;
            background: white !important;
            color: black !important;
          }
          
          /* Hide parent margins */
          body {
            background: white !important;
            color: black !important;
            font-size: 12px !important;
          }
          
          /* Card resets */
          .card, .shadow-sm, border {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          .print-full-width {
            width: 100% !important;
            max-width: 100% !important;
            display: block !important;
          }

          /* Force grid columns to look nice or use custom layout */
          .print-grid {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 15px !important;
          }

          .print-title {
            font-size: 24px !important;
            font-weight: bold !important;
            margin-bottom: 20px !important;
          }
          
          .print-section {
            border: 1px solid #ddd !important;
            padding: 10px !important;
            margin-bottom: 15px !important;
            border-radius: 4px !important;
            page-break-inside: avoid;
          }
        }
      `}</style>

      {/* Header (No print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push("/boe")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">{boe.boeNumber}</h1>
              {getStatusBadge(currentStatus)}
            </div>
            <p className="text-muted-foreground mt-1">
              Filing Date: {new Date(boe.boeDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditable ? (
            <Link href={`/boe/${boe.id}/edit`} className={buttonVariants({ variant: "default" })}>
              <Pencil className="mr-2 h-4 w-4" /> Edit BOE
            </Link>
          ) : (
            <span className="text-xs text-muted-foreground bg-muted p-2 rounded-md border">
              Document locked (Approved/Submitted)
            </span>
          )}
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" /> Print / Save PDF
          </Button>
        </div>
      </div>

      {/* WORKFLOW TRACKER (No print) */}
      <Card className="no-print">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Filing Workflow Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Background Line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-muted -translate-y-1/2 hidden md:block z-0" />
            
            {steps.map((step, idx) => {
              const isCompleted = activeStepIdx >= idx && currentStatus !== "Rejected"
              const isCurrent = activeStepIdx === idx
              const isError = currentStatus === "Rejected" && idx === 2

              return (
                <div key={idx} className="flex flex-col items-center relative z-10 w-full md:w-auto">
                  <div className={`h-10 w-10 rounded-full border-2 flex items-center justify-center font-bold text-sm ${
                    isCompleted 
                      ? "bg-primary border-primary text-primary-foreground" 
                      : isError 
                      ? "bg-destructive border-destructive text-destructive-foreground"
                      : isCurrent
                      ? "bg-card border-primary text-primary shadow"
                      : "bg-card border-muted text-muted-foreground"
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : isError ? (
                      <AlertCircle className="h-5 w-5" />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <span className={`text-xs font-semibold mt-2 ${isCurrent ? "text-primary font-bold" : isError ? "text-destructive" : "text-muted-foreground"}`}>
                    {step.label}
                  </span>
                  {isError && isCurrent && (
                    <span className="text-[10px] text-destructive italic font-bold">Filing Rejected</span>
                  )}
                </div>
              )
            })}
          </div>

          <Separator className="my-6" />

          {/* SIMULATOR CONTROLS */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/30 p-3 rounded-md border">
            <div>
              <div className="font-semibold text-xs text-primary">C&F Agent / Customs Inspector Simulator</div>
              <div className="text-xs text-muted-foreground">Simulate changing status of this Bill of Entry in LocalStorage.</div>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-xs font-semibold shrink-0">Transition to:</Label>
              <Select value={currentStatus} onValueChange={(val) => handleStatusChange(val as BOEStatus)}>
                <SelectTrigger className="w-[180px] h-8 bg-card text-xs">
                  <SelectValue placeholder="Change Status" />
                </SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Submitted">Submitted</SelectItem>
                  <SelectItem value="Under Verification">Under Verification</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

        </CardContent>
      </Card>

      {/* PRINT AREA CONTAINER */}
      <div id="print-area" className="grid grid-cols-1 lg:grid-cols-3 gap-8 print-full-width">
        
        {/* Left 2 Columns: Main Details */}
        <div className="lg:col-span-2 space-y-6 print-full-width">
          
          {/* Printable Header */}
          <div className="hidden print:block print-section border-b pb-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">BILL OF ENTRY DECLARATION</h1>
                <p className="text-sm font-semibold text-primary">{boe.boeNumber}</p>
                <p className="text-xs text-muted-foreground">Filing Date: {boe.boeDate}</p>
              </div>
              <div className="text-right">
                <h2 className="text-sm font-bold">C&F MANAGEMENT SYSTEM</h2>
                <p className="text-xs text-muted-foreground">Customs Clearance Record</p>
                <div className="mt-1 text-xs font-bold uppercase">{boe.status}</div>
              </div>
            </div>
          </div>

          {/* Section 1: General Info & Shipment */}
          <div className="print-section">
            <Card className="border-none shadow-none">
              <CardHeader className="pb-3 border-b print:pb-1">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-primary">
                  <Compass className="h-5 w-5 print:h-4 print:w-4" />
                  Section 1: General & Shipment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 print-grid print:pt-2">
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground block">Port of Entry</span>
                  <span className="text-sm font-medium flex items-center gap-1.5">
                    <Anchor className="h-3.5 w-3.5 text-muted-foreground" />
                    {boe.port}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground block">Custom House</span>
                  <span className="text-sm font-medium">{boe.customHouse}</span>
                </div>
                
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground block">Declaration Type (Entry Type)</span>
                  <span className="text-sm font-medium">{boe.entryType}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground block">Import Type</span>
                  <span className="text-sm font-medium">{boe.importType}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground block">L/C Details</span>
                  <span className="text-sm font-medium">
                    {boe.lcNumber ? `${boe.lcNumber} (${boe.lcDate})` : "N/A"}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground block">Origin / Export Countries</span>
                  <span className="text-sm font-medium">
                    Origin: {boe.countryOfOrigin || "N/A"} • Exported: {boe.countryOfExport || "N/A"}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground block">Vessel & Voyage No</span>
                  <span className="text-sm font-medium">
                    {boe.vesselName || "N/A"} (Voyage: {boe.voyageNo || "N/A"})
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground block">IGM Number / Date</span>
                  <span className="text-sm font-medium">
                    {boe.igmNumber ? `${boe.igmNumber} (${boe.igmDate})` : "N/A"}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground block">Bill of Lading (B/L) Details</span>
                  <span className="text-sm font-medium">
                    {boe.blNumber ? `${boe.blNumber} (${boe.blDate})` : "N/A"}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground block">Weights (Gross / Net)</span>
                  <span className="text-sm font-medium">
                    Gross: {boe.grossWeight} KG • Net: {boe.netWeight} KG
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Section 2 & 3: Importer & Supplier */}
          <div className="print-section">
            <Card className="border-none shadow-none">
              <CardContent className="p-0 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x print-grid">
                
                {/* Importer Side */}
                <div className="p-6 pt-4 space-y-3 print:p-2">
                  <h3 className="text-sm font-bold flex items-center gap-1.5 text-primary border-b pb-1">
                    <Building2 className="h-4 w-4" />
                    Importer Details
                  </h3>
                  <div className="space-y-1">
                    <span className="text-sm font-semibold">{boe.importerName}</span>
                    <p className="text-xs text-muted-foreground flex items-start gap-1">
                      <MapPin className="h-3 w-3 shrink-0 mt-0.5" />
                      {boe.address || "No address specified."}
                    </p>
                    <div className="flex flex-col gap-0.5 text-xs text-muted-foreground pt-1.5">
                      <span><strong>BIN Number:</strong> {boe.binNumber || "N/A"}</span>
                      <span><strong>TIN Number:</strong> {boe.tinNumber || "N/A"}</span>
                    </div>
                  </div>
                </div>

                {/* Supplier Side */}
                <div className="p-6 pt-4 space-y-3 print:p-2 md:pl-6">
                  <h3 className="text-sm font-bold flex items-center gap-1.5 text-primary border-b pb-1">
                    <UserCheck className="h-4 w-4" />
                    Supplier / Exporter Details
                  </h3>
                  <div className="space-y-1">
                    <span className="text-sm font-semibold">{boe.supplierName || "N/A"}</span>
                    <p className="text-xs text-muted-foreground flex items-start gap-1">
                      <MapPin className="h-3 w-3 shrink-0 mt-0.5" />
                      {boe.supplierAddress || "No address specified."}
                    </p>
                    <div className="text-xs text-muted-foreground pt-1.5">
                      <span><strong>Country:</strong> {boe.supplierCountry || "N/A"}</span>
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>

          {/* Section 4: Invoice Information */}
          <div className="print-section">
            <Card className="border-none shadow-none">
              <CardHeader className="pb-3 border-b print:pb-1">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-primary">
                  <FileText className="h-5 w-5 print:h-4 print:w-4" />
                  Section 2: Invoice & Valuation
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-4 print-grid print:pt-2">
                <div className="space-y-0.5">
                  <span className="text-xs text-muted-foreground">Invoice Number</span>
                  <span className="text-sm font-medium font-mono">{boe.invoiceNumber || "N/A"}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs text-muted-foreground">Invoice Date</span>
                  <span className="text-sm font-medium">
                    {boe.invoiceDate ? new Date(boe.invoiceDate).toLocaleDateString() : "N/A"}
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs text-muted-foreground">Currency</span>
                  <span className="text-sm font-medium">{boe.currency}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs text-muted-foreground">Exchange Rate</span>
                  <span className="text-sm font-medium font-mono">BDT {boe.exchangeRate}</span>
                </div>

                <div className="space-y-0.5 pt-2">
                  <span className="text-xs text-muted-foreground">Invoice Value ({boe.currency})</span>
                  <span className="text-sm font-semibold font-mono">
                    {boe.invoiceValue.toLocaleString()}
                  </span>
                </div>
                <div className="space-y-0.5 pt-2">
                  <span className="text-xs text-muted-foreground">Freight Charges ({boe.currency})</span>
                  <span className="text-sm font-semibold font-mono">
                    {boe.freight.toLocaleString()}
                  </span>
                </div>
                <div className="space-y-0.5 pt-2">
                  <span className="text-xs text-muted-foreground">Insurance ({boe.currency})</span>
                  <span className="text-sm font-semibold font-mono">
                    {boe.insurance.toLocaleString()}
                  </span>
                </div>
                <div className="space-y-0.5 pt-2 bg-primary/5 p-2 rounded print:p-0 print:bg-transparent">
                  <span className="text-xs text-primary font-bold">CIF Value ({boe.currency})</span>
                  <span className="text-sm font-bold text-primary font-mono block">
                    {boe.cifValue.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Section 5: Goods Information Table */}
          <div className="print-section">
            <Card className="border-none shadow-none">
              <CardHeader className="pb-3 border-b print:pb-1">
                <CardTitle className="text-base font-bold text-primary">
                  Section 3: Declared Goods Items
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 p-0 print:pt-2">
                {boe.items.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground text-xs">No goods itemized in this BOE.</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="text-xs">
                        <TableHead className="w-[100px]">HS Code</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead className="text-right">Unit Price ({boe.currency})</TableHead>
                        <TableHead className="text-right">Total ({boe.currency})</TableHead>
                        <TableHead className="text-right">Duty Rate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {boe.items.map((item, idx) => (
                        <TableRow key={item.id || idx} className="text-xs">
                          <TableCell className="font-mono font-semibold">{item.hsCode}</TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell className="text-right font-mono">{item.qty}</TableCell>
                          <TableCell>{item.unit}</TableCell>
                          <TableCell className="text-right font-mono">{item.unitPrice.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-mono font-semibold">{item.value.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-mono">{item.dutyRate}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Section 7: Documents Checklist */}
          <div className="print-section page-break-avoid">
            <Card className="border-none shadow-none">
              <CardHeader className="pb-3 border-b print:pb-1">
                <CardTitle className="text-base font-bold text-primary">
                  Section 5: Attached Documents Check
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 grid grid-cols-2 md:grid-cols-3 gap-2 print:pt-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className={boe.documents?.commercialInvoice ? "text-success font-bold" : "text-muted-foreground"}>
                    {boe.documents?.commercialInvoice ? "[✓]" : "[ ]"}
                  </span>
                  <span>Commercial Invoice</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className={boe.documents?.packingList ? "text-success font-bold" : "text-muted-foreground"}>
                    {boe.documents?.packingList ? "[✓]" : "[ ]"}
                  </span>
                  <span>Packing List</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className={boe.documents?.billOfLading ? "text-success font-bold" : "text-muted-foreground"}>
                    {boe.documents?.billOfLading ? "[✓]" : "[ ]"}
                  </span>
                  <span>Bill of Lading (B/L)</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className={boe.documents?.insurance ? "text-success font-bold" : "text-muted-foreground"}>
                    {boe.documents?.insurance ? "[✓]" : "[ ]"}
                  </span>
                  <span>Insurance Certificate</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className={boe.documents?.lcCopy ? "text-success font-bold" : "text-muted-foreground"}>
                    {boe.documents?.lcCopy ? "[✓]" : "[ ]"}
                  </span>
                  <span>L/C Copy</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className={boe.documents?.certificateOfOrigin ? "text-success font-bold" : "text-muted-foreground"}>
                    {boe.documents?.certificateOfOrigin ? "[✓]" : "[ ]"}
                  </span>
                  <span>Certificate of Origin</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Section 8: Remarks */}
          {boe.remarks && (
            <div className="print-section page-break-avoid">
              <Card className="border-none shadow-none">
                <CardHeader className="pb-1">
                  <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Section 6: Remarks / Auditing Notes</CardTitle>
                </CardHeader>
                <CardContent className="text-sm italic">{boe.remarks}</CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Right 1 Column: Duty Calculations */}
        <div className="print-section page-break-avoid">
          <Card className="border-primary/20 bg-muted/10">
            <CardHeader className="border-b bg-muted/30 print:pb-1">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-primary">
                Section 4: Customs Duty & Tax Calculations
              </CardTitle>
              <CardDescription className="no-print">Auto-generated duty breakdown (BDT).</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4 print:pt-2">
              
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Assessable Value (AV):</span>
                <span className="font-mono font-semibold">৳ {boe.assessableValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Customs Duty (CD):</span>
                <span className="font-mono font-semibold">৳ {boe.customDuty.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Supplementary Duty (SD):</span>
                <span className="font-mono font-semibold">৳ {boe.supplementaryDuty.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Value Added Tax (VAT):</span>
                <span className="font-mono font-semibold">৳ {boe.vat.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Advance Income Tax (AIT):</span>
                <span className="font-mono font-semibold">৳ {boe.ait.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Advance Tax (AT):</span>
                <span className="font-mono font-semibold">৳ {boe.at.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
              </div>

              <Separator />

              <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-sm">Grand Total (BDT):</span>
                <span className="font-mono font-extrabold text-base text-primary">
                  ৳ {boe.grandTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="bg-primary/5 p-3 rounded-lg border border-primary/10 text-[10px] space-y-1 no-print">
                <div className="font-semibold text-primary">Customs Tariff Info:</div>
                <div>AV = CIF Value * Exchange Rate</div>
                <div>Calculated using standard 2026 tariff rules for C&F clearing.</div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
