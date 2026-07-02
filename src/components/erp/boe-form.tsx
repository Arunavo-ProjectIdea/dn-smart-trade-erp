"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BillOfEntry } from "@/lib/types/boe";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Save, CheckCircle2 } from "lucide-react";

interface BOEFormProps {
  initialData?: BillOfEntry | null;
}

const steps = [
  { id: 1, title: "Importer Info", description: "Client details" },
  { id: 2, title: "Shipment", description: "Arrival details" },
  { id: 3, title: "Products", description: "Declared items" },
  { id: 4, title: "Duty Calc", description: "Taxes & charges" },
  { id: 5, title: "Review", description: "Final check" },
];

export function BOEForm({ initialData }: BOEFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State (using initialData if editing, else empty strings/0s for mock purposes)
  const [formData, setFormData] = useState({
    importer: initialData?.importer || {
      clientName: "", companyName: "", bin: "", tin: "", address: ""
    },
    shipment: initialData?.shipment || {
      shipmentId: "", port: "", countryOfOrigin: "", carrier: "", containerNumber: "", arrivalDate: ""
    },
    products: initialData?.products || [
      { id: "new-prod", productName: "", hsCode: "", quantity: 0, unit: "Pieces", declaredValue: 0, currency: "USD" }
    ],
    duties: initialData?.duties || {
      importDuty: 0, vat: 0, ait: 0, at: 0, otherCharges: 0, grandTotal: 0
    }
  });

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Mock API call
    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/boe');
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-10">
      {/* Stepper */}
      <div className="w-full py-4">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted rounded-full -z-10"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full -z-10 transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          ></div>
          
          {steps.map((step) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            
            return (
              <div key={step.id} className="flex flex-col items-center gap-2 bg-background px-2">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-semibold transition-colors duration-300
                    ${isCompleted ? 'bg-primary border-primary text-primary-foreground' : 
                      isCurrent ? 'border-primary text-primary bg-background' : 
                      'border-muted bg-background text-muted-foreground'}`}
                >
                  {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : step.id}
                </div>
                <div className="text-center hidden sm:block">
                  <div className={`text-sm font-medium ${isCurrent || isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.title}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Card className="border-2 shadow-sm">
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
          <CardDescription>{steps[currentStep - 1].description}</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[400px]">
          
          {/* Step 1: Importer */}
          {currentStep === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <Label htmlFor="clientName">Client Name</Label>
                <Input id="clientName" className="bg-background shadow-sm" value={formData.importer.clientName} onChange={(e) => setFormData({...formData, importer: {...formData.importer, clientName: e.target.value}})} placeholder="e.g. Acme Corp" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyName">Registered Company Name</Label>
                <Input id="companyName" className="bg-background shadow-sm" value={formData.importer.companyName} onChange={(e) => setFormData({...formData, importer: {...formData.importer, companyName: e.target.value}})} placeholder="e.g. Acme International Ltd." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bin">Business Identification Number (BIN)</Label>
                <Input id="bin" className="bg-background shadow-sm" value={formData.importer.bin} onChange={(e) => setFormData({...formData, importer: {...formData.importer, bin: e.target.value}})} placeholder="BIN" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tin">Tax Identification Number (TIN)</Label>
                <Input id="tin" className="bg-background shadow-sm" value={formData.importer.tin} onChange={(e) => setFormData({...formData, importer: {...formData.importer, tin: e.target.value}})} placeholder="TIN" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Full Address</Label>
                <Input id="address" className="bg-background shadow-sm" value={formData.importer.address} onChange={(e) => setFormData({...formData, importer: {...formData.importer, address: e.target.value}})} placeholder="Street address, City, Country" />
              </div>
            </div>
          )}

          {/* Step 2: Shipment */}
          {currentStep === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <Label htmlFor="shipmentId">Shipment Reference ID</Label>
                <Input id="shipmentId" className="bg-background shadow-sm" value={formData.shipment.shipmentId} onChange={(e) => setFormData({...formData, shipment: {...formData.shipment, shipmentId: e.target.value}})} placeholder="e.g. SHP-1001" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="port">Port of Entry</Label>
                <Input id="port" className="bg-background shadow-sm" value={formData.shipment.port} onChange={(e) => setFormData({...formData, shipment: {...formData.shipment, port: e.target.value}})} placeholder="e.g. Chittagong Port" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="countryOfOrigin">Country of Origin</Label>
                <Input id="countryOfOrigin" className="bg-background shadow-sm" value={formData.shipment.countryOfOrigin} onChange={(e) => setFormData({...formData, shipment: {...formData.shipment, countryOfOrigin: e.target.value}})} placeholder="e.g. China" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="carrier">Carrier / Vessel Name</Label>
                <Input id="carrier" className="bg-background shadow-sm" value={formData.shipment.carrier} onChange={(e) => setFormData({...formData, shipment: {...formData.shipment, carrier: e.target.value}})} placeholder="e.g. Maersk" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="containerNumber">Container Number</Label>
                <Input id="containerNumber" className="bg-background shadow-sm" value={formData.shipment.containerNumber} onChange={(e) => setFormData({...formData, shipment: {...formData.shipment, containerNumber: e.target.value}})} placeholder="Container no." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="arrivalDate">Arrival Date</Label>
                <Input id="arrivalDate" type="date" className="bg-background shadow-sm" value={formData.shipment.arrivalDate.split('T')[0] || ''} onChange={(e) => setFormData({...formData, shipment: {...formData.shipment, arrivalDate: e.target.value}})} />
              </div>
            </div>
          )}

          {/* Step 3: Products */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              {formData.products.map((product, index) => (
                <div key={index} className="p-4 border rounded-lg bg-muted/20 relative">
                  <h4 className="font-semibold mb-4">Product #{index + 1}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Product Description</Label>
                      <Input className="bg-background shadow-sm" value={product.productName} onChange={(e) => {
                        const newProducts = [...formData.products];
                        newProducts[index].productName = e.target.value;
                        setFormData({...formData, products: newProducts});
                      }} placeholder="e.g. Industrial Sewing Machine" />
                    </div>
                    <div className="space-y-2">
                      <Label>HS Code</Label>
                      <Input className="bg-background shadow-sm" value={product.hsCode} onChange={(e) => {
                        const newProducts = [...formData.products];
                        newProducts[index].hsCode = e.target.value;
                        setFormData({...formData, products: newProducts});
                      }} placeholder="8452.29.00" />
                    </div>
                    <div className="space-y-2">
                      <Label>Quantity</Label>
                      <Input type="number" className="bg-background shadow-sm" value={product.quantity || ''} onChange={(e) => {
                        const newProducts = [...formData.products];
                        newProducts[index].quantity = Number(e.target.value);
                        setFormData({...formData, products: newProducts});
                      }} placeholder="0" />
                    </div>
                    <div className="space-y-2">
                      <Label>Unit</Label>
                      <Input className="bg-background shadow-sm" value={product.unit} onChange={(e) => {
                        const newProducts = [...formData.products];
                        newProducts[index].unit = e.target.value;
                        setFormData({...formData, products: newProducts});
                      }} placeholder="e.g. Pieces, Kg" />
                    </div>
                    <div className="space-y-2">
                      <Label>Declared Value</Label>
                      <div className="flex items-center gap-2">
                        <Input value={product.currency} className="w-20 bg-background shadow-sm" onChange={(e) => {
                          const newProducts = [...formData.products];
                          newProducts[index].currency = e.target.value;
                          setFormData({...formData, products: newProducts});
                        }} />
                        <Input type="number" className="flex-1 bg-background shadow-sm" value={product.declaredValue || ''} onChange={(e) => {
                          const newProducts = [...formData.products];
                          newProducts[index].declaredValue = Number(e.target.value);
                          setFormData({...formData, products: newProducts});
                        }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full border-dashed">
                + Add Another Product
              </Button>
            </div>
          )}

          {/* Step 4: Duties */}
          {currentStep === 4 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <Label htmlFor="importDuty">Import Duty (ID)</Label>
                <Input id="importDuty" type="number" className="bg-background shadow-sm" value={formData.duties.importDuty || ''} onChange={(e) => setFormData({...formData, duties: {...formData.duties, importDuty: Number(e.target.value)}})} placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vat">Value Added Tax (VAT)</Label>
                <Input id="vat" type="number" className="bg-background shadow-sm" value={formData.duties.vat || ''} onChange={(e) => setFormData({...formData, duties: {...formData.duties, vat: Number(e.target.value)}})} placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ait">Advance Income Tax (AIT)</Label>
                <Input id="ait" type="number" className="bg-background shadow-sm" value={formData.duties.ait || ''} onChange={(e) => setFormData({...formData, duties: {...formData.duties, ait: Number(e.target.value)}})} placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="at">Advance Tax (AT)</Label>
                <Input id="at" type="number" className="bg-background shadow-sm" value={formData.duties.at || ''} onChange={(e) => setFormData({...formData, duties: {...formData.duties, at: Number(e.target.value)}})} placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="otherCharges">Other Charges / Fees</Label>
                <Input id="otherCharges" type="number" className="bg-background shadow-sm" value={formData.duties.otherCharges || ''} onChange={(e) => setFormData({...formData, duties: {...formData.duties, otherCharges: Number(e.target.value)}})} placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="grandTotal">Grand Total</Label>
                <Input id="grandTotal" type="number" className="border-primary font-bold bg-background shadow-sm" value={formData.duties.grandTotal || ''} onChange={(e) => setFormData({...formData, duties: {...formData.duties, grandTotal: Number(e.target.value)}})} placeholder="0.00" />
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-muted/30 p-6 rounded-lg border">
                <h3 className="text-lg font-bold mb-4">Review Bill of Entry</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-primary mb-2 border-b pb-1">Importer Details</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-muted-foreground">Client:</span> {formData.importer.clientName || 'N/A'}</p>
                      <p><span className="text-muted-foreground">Company:</span> {formData.importer.companyName || 'N/A'}</p>
                      <p><span className="text-muted-foreground">BIN/TIN:</span> {formData.importer.bin} / {formData.importer.tin}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary mb-2 border-b pb-1">Shipment Summary</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-muted-foreground">Port:</span> {formData.shipment.port || 'N/A'}</p>
                      <p><span className="text-muted-foreground">Origin:</span> {formData.shipment.countryOfOrigin || 'N/A'}</p>
                      <p><span className="text-muted-foreground">Carrier:</span> {formData.shipment.carrier || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold text-primary mb-2 border-b pb-1">Products ({formData.products.length})</h4>
                  <div className="space-y-2 text-sm">
                    {formData.products.map((p, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{p.quantity} {p.unit} of {p.productName || 'Unnamed'} ({p.hsCode})</span>
                        <span className="font-medium">{p.currency} {p.declaredValue}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 bg-primary/5 p-4 rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">Total Payable Duties:</span>
                    <span className="font-bold text-xl text-primary">BDT {formData.duties.grandTotal.toLocaleString()}</span>
                  </div>
                </div>

              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t bg-muted/10 py-4">
          <Button 
            variant="outline" 
            onClick={handlePrev} 
            disabled={currentStep === 1 || isSubmitting}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          
          {currentStep < steps.length ? (
            <Button onClick={handleNext}>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="secondary" onClick={handleSubmit} disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" /> Save as Draft
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit BOE"}
                {!isSubmitting && <CheckCircle2 className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
