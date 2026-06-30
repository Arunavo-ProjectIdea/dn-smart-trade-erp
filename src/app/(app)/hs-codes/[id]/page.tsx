"use client"

import { notFound, useRouter, useParams } from "next/navigation"
import { Calculator, ArrowLeft, CheckCircle2, ShieldAlert, FileText } from "lucide-react"

import { PageHeader } from "@/components/erp/page-header"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { mockHSCodes } from "@/lib/mock-data/hs-codes"

export default function HSCodeDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const hsCodeData = mockHSCodes.find((c) => c.code === id)
  
  if (!hsCodeData && id) {
    notFound()
  }

  if (!hsCodeData) return null

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/hs-codes")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <PageHeader 
          title={`HS Code: ${hsCodeData.code}`}
          description={hsCodeData.category}
          action={
            <Button variant="default" onClick={() => router.push(`/duty-calculator?hsCode=${hsCodeData.code}`)}>
              <Calculator className="mr-2 h-4 w-4" /> Calculate Duty
            </Button>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Product Info & Taxes */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Product Name</p>
                <p className="text-lg font-semibold">{hsCodeData.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Description</p>
                <p className="text-sm text-foreground/90 leading-relaxed">{hsCodeData.description}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Unit of Measurement (UOM)</p>
                <p className="text-sm font-medium bg-muted w-max px-2 py-1 rounded">{hsCodeData.uom}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Applicable Tax Rates</CardTitle>
              <CardDescription>Current duty and tax percentages applicable for import.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-card border rounded-lg p-4 flex flex-col items-center justify-center text-center">
                  <p className="text-xs text-muted-foreground font-medium mb-1">Customs Duty (CD)</p>
                  <p className="text-2xl font-bold text-foreground">{hsCodeData.cd}%</p>
                </div>
                <div className="bg-card border rounded-lg p-4 flex flex-col items-center justify-center text-center">
                  <p className="text-xs text-muted-foreground font-medium mb-1">Supp. Duty (SD)</p>
                  <p className="text-2xl font-bold text-warning">{hsCodeData.sd}%</p>
                </div>
                <div className="bg-card border rounded-lg p-4 flex flex-col items-center justify-center text-center">
                  <p className="text-xs text-muted-foreground font-medium mb-1">VAT</p>
                  <p className="text-2xl font-bold text-primary">{hsCodeData.vat}%</p>
                </div>
                <div className="bg-card border rounded-lg p-4 flex flex-col items-center justify-center text-center">
                  <p className="text-xs text-muted-foreground font-medium mb-1">Adv. Inc. Tax (AIT)</p>
                  <p className="text-2xl font-bold text-foreground">{hsCodeData.ait}%</p>
                </div>
                <div className="bg-card border rounded-lg p-4 flex flex-col items-center justify-center text-center">
                  <p className="text-xs text-muted-foreground font-medium mb-1">Reg. Duty (RD)</p>
                  <p className="text-2xl font-bold text-foreground">{hsCodeData.rd}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Policy & Docs */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-warning" />
                Import Policy Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {hsCodeData.policyNotes}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Required Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {hsCodeData.requiredDocuments.map((doc, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
