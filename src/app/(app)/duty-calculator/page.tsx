"use client"

import { useState, useEffect, useMemo, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Calculator, RefreshCcw } from "lucide-react"

import { PageHeader } from "@/components/erp/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { mockHSCodes } from "@/lib/mock-data/hs-codes"

function DutyCalculatorInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialHsCode = searchParams?.get("hsCode") || ""

  const [selectedHsCodeStr, setSelectedHsCodeStr] = useState<string>(initialHsCode)
  const [assessableValue, setAssessableValue] = useState<string>("")
  const [quantity, setQuantity] = useState<string>("1")
  const [currency, setCurrency] = useState<"BDT" | "USD">("USD")
  const [exchangeRate, setExchangeRate] = useState<string>("120.00") // Mock default USD to BDT
  
  // Calculate whenever inputs change
  const selectedCode = useMemo(() => mockHSCodes.find(c => c.code === selectedHsCodeStr), [selectedHsCodeStr])

  // Formula logic
  const results = useMemo(() => {
    if (!selectedCode) return null

    const val = parseFloat(assessableValue) || 0
    const qty = parseFloat(quantity) || 1
    const exRate = currency === "USD" ? (parseFloat(exchangeRate) || 120) : 1

    const baseValueBDT = val * exRate * qty
    
    // Customs Duty = Base Value * CD Rate
    const cdAmount = baseValueBDT * (selectedCode.cd / 100)
    
    // Supplementary Duty = (Base Value + CD) * SD Rate
    const sdAmount = (baseValueBDT + cdAmount) * (selectedCode.sd / 100)
    
    // VAT = (Base Value + CD + SD) * VAT Rate
    const vatAmount = (baseValueBDT + cdAmount + sdAmount) * (selectedCode.vat / 100)
    
    // AIT = Base Value * AIT Rate
    const aitAmount = baseValueBDT * (selectedCode.ait / 100)
    
    // Regulatory Duty = Base Value * RD Rate
    const rdAmount = baseValueBDT * (selectedCode.rd / 100)
    
    const totalTaxAmount = cdAmount + sdAmount + vatAmount + aitAmount + rdAmount
    const grandTotalAmount = baseValueBDT + totalTaxAmount

    return {
      baseValueBDT,
      cdAmount,
      sdAmount,
      vatAmount,
      aitAmount,
      rdAmount,
      totalTaxAmount,
      grandTotalAmount
    }
  }, [selectedCode, assessableValue, quantity, currency, exchangeRate])

  const handleReset = () => {
    setSelectedHsCodeStr("")
    setAssessableValue("")
    setQuantity("1")
    setCurrency("USD")
    setExchangeRate("120.00")
    router.push("/duty-calculator") // Clear query params
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT' }).format(amount)
  }

  return (
    <div className="flex flex-col gap-8 pb-10">
      <PageHeader 
        title="Duty Calculator" 
        description="Estimate import duties and taxes dynamically based on HS code tariffs."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Input Form */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Calculation Inputs</CardTitle>
              <CardDescription>Enter the shipment values to calculate taxes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="space-y-2">
                <Label htmlFor="hsCode">HS Code *</Label>
                <Select value={selectedHsCodeStr} onValueChange={(val) => setSelectedHsCodeStr(val || "")}>
                  <SelectTrigger id="hsCode" className="w-full">
                    <SelectValue placeholder="Search HS Code..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockHSCodes.map(code => (
                      <SelectItem key={code.code} value={code.code}>
                        {code.code} - {code.name.substring(0, 30)}...
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedCode && (
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Selected Product</p>
                  <p className="text-sm font-medium">{selectedCode.name}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded font-mono">CD: {selectedCode.cd}%</span>
                    <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded font-mono">VAT: {selectedCode.vat}%</span>
                    <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded font-mono">SD: {selectedCode.sd}%</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assessableValue">Assessable Value / Unit *</Label>
                  <Input 
                    id="assessableValue" 
                    type="number" 
                    min="0" 
                    value={assessableValue}
                    onChange={(e) => setAssessableValue(e.target.value)}
                    placeholder="e.g. 5000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input 
                    id="quantity" 
                    type="number" 
                    min="1" 
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency *</Label>
                  <Select value={currency} onValueChange={(val) => setCurrency(val as "BDT" | "USD")}>
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="BDT">BDT (৳)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {currency === "USD" && (
                  <div className="space-y-2">
                    <Label htmlFor="exchangeRate">Exchange Rate (BDT) *</Label>
                    <Input 
                      id="exchangeRate" 
                      type="number" 
                      step="0.01"
                      value={exchangeRate}
                      onChange={(e) => setExchangeRate(e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div className="pt-4 flex gap-3">
                <Button variant="outline" className="w-full" onClick={handleReset}>
                  <RefreshCcw className="mr-2 h-4 w-4" /> Reset
                </Button>
                <Button className="w-full">
                  <Calculator className="mr-2 h-4 w-4" /> Calculate
                </Button>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* Right Column: Breakdown */}
        <div className="lg:col-span-7">
          <Card className="h-full border-primary/20 shadow-lg shadow-primary/5">
            <CardHeader className="bg-muted/50 border-b border-border pb-6">
              <CardTitle>Calculation Breakdown</CardTitle>
              <CardDescription>Comprehensive view of applicable taxes and duties.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {results ? (
                <div className="flex flex-col">
                  {/* Base Value */}
                  <div className="flex justify-between items-center p-6 border-b border-border">
                    <div>
                      <p className="font-semibold">Assessable Base Value</p>
                      <p className="text-xs text-muted-foreground mt-1">Converted to BDT</p>
                    </div>
                    <p className="text-xl font-mono">{formatCurrency(results.baseValueBDT)}</p>
                  </div>

                  {/* Taxes List */}
                  <div className="p-6 space-y-4 border-b border-border bg-muted/20">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">Customs Duty (CD)</p>
                      <p className="font-mono text-sm">{formatCurrency(results.cdAmount)}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">Supplementary Duty (SD)</p>
                      <p className="font-mono text-sm">{formatCurrency(results.sdAmount)}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">Value Added Tax (VAT)</p>
                      <p className="font-mono text-sm">{formatCurrency(results.vatAmount)}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">Advance Income Tax (AIT)</p>
                      <p className="font-mono text-sm">{formatCurrency(results.aitAmount)}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">Regulatory Duty (RD)</p>
                      <p className="font-mono text-sm">{formatCurrency(results.rdAmount)}</p>
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-warning">Total Taxes & Duties</p>
                      <p className="text-lg font-mono font-semibold text-warning">{formatCurrency(results.totalTaxAmount)}</p>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-border">
                      <div>
                        <p className="text-2xl font-bold text-primary">Grand Total</p>
                        <p className="text-xs text-muted-foreground mt-1">Base Value + Total Taxes</p>
                      </div>
                      <p className="text-3xl font-mono font-bold text-primary">{formatCurrency(results.grandTotalAmount)}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 flex flex-col items-center justify-center text-center h-[400px]">
                  <Calculator className="h-16 w-16 text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground">No HS Code Selected</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mt-2">
                    Please select an HS Code and enter the assessable values to generate a duty breakdown.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}

export default function DutyCalculatorPage() {
  return (
    <Suspense fallback={<div>Loading calculator...</div>}>
      <DutyCalculatorInner />
    </Suspense>
  )
}
