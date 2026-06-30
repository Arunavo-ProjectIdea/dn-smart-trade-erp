"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronRight, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shipment } from "@/lib/types/shipment";
import { mockClients } from "@/lib/mock-data/clients";
import { mockShipmentsList } from "@/lib/mock-data/shipment";
import { useToast } from "@/components/ui/use-toast";

interface ShipmentFormProps {
  initialData?: Shipment;
}

export function ShipmentForm({ initialData }: ShipmentFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  const isEditing = !!initialData;

  const [formData, setFormData] = useState<Partial<Shipment>>(initialData || {
    clientId: "",
    clientName: "",
    importer: "",
    exporter: "",
    consignee: "",
    shipmentNumber: "",
    containerNumber: "",
    containerSize: "20ft",
    containerType: "Standard",
    shippingLine: "",
    vesselName: "",
    voyageNumber: "",
    originCountry: "",
    destinationCountry: "",
    loadingPort: "",
    dischargePort: "",
    arrivalPort: "",
    departureDate: "",
    eta: "",
    etd: "",
    incoterms: "FOB",
    transportType: "Sea",
    products: [],
    hsCodes: [],
    grossWeight: 0,
    netWeight: 0,
    packageCount: 0,
    packageType: "Cartons",
    description: "",
    boeId: "",
    boeNumber: "",
    dutyAmount: 0,
    customsStatus: "Pending",
    clearanceStatus: "Pending",
    status: "Draft",
  });

  const updateField = (field: keyof Shipment, value: Shipment[keyof Shipment] | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    if (isEditing && initialData) {
      const index = mockShipmentsList.findIndex(s => s.id === initialData.id);
      if (index !== -1) {
        mockShipmentsList[index] = { ...mockShipmentsList[index], ...(formData as Shipment) };
      }
    } else {
      mockShipmentsList.unshift({
        ...(formData as Shipment),
        id: `shp-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    
    toast({ 
      title: isEditing ? "Shipment Updated" : "Shipment Created", 
      description: isEditing ? "The shipment details have been successfully updated." : "A new shipment has been successfully created." 
    });
    router.push("/shipments");
    router.refresh();
  };

  const stepTitles = [
    "Client Information",
    "Shipment Details",
    "Cargo Information",
    "Customs",
    "Documents",
    "Review & Submit"
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar Progress */}
      <div className="w-full lg:w-64 shrink-0">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Steps</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="flex flex-col space-y-1 p-2">
              {stepTitles.map((title, index) => {
                const stepNum = index + 1;
                const isActive = currentStep === stepNum;
                const isCompleted = currentStep > stepNum;
                
                return (
                  <li key={stepNum}>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(stepNum)}
                      disabled={!isEditing && stepNum > currentStep + 1}
                      className={`w-full flex items-center justify-between p-3 rounded-md text-left transition-colors ${
                        isActive 
                          ? "bg-primary text-primary-foreground font-medium" 
                          : isCompleted 
                            ? "hover:bg-muted text-foreground" 
                            : "text-muted-foreground cursor-not-allowed opacity-60"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span className={`flex items-center justify-center h-6 w-6 rounded-full text-xs font-semibold ${
                          isActive ? "bg-primary-foreground text-primary" : "bg-muted-foreground/20"
                        }`}>
                          {isCompleted ? <Check className="h-3 w-3" /> : stepNum}
                        </span>
                        {title}
                      </span>
                      {isActive && <ChevronRight className="h-4 w-4" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Main Form Area */}
      <div className="flex-1">
        <Card className="min-h-[500px] flex flex-col">
          <CardHeader>
            <CardTitle>{stepTitles[currentStep - 1]}</CardTitle>
            <CardDescription>
              Step {currentStep} of {totalSteps}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            
            {/* STEP 1: Client Information */}
            {currentStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label>Select Client</Label>
                  <Select 
                    value={formData.clientId} 
                    onValueChange={(val) => {
                      const client = mockClients.find(c => c.id === val);
                      updateField("clientId", val as string);
                      if (client) updateField("clientName", client.companyName);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a client..." />
                    </SelectTrigger>
                    <SelectContent>
                      {mockClients.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.companyName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Importer</Label>
                  <Input value={formData.importer} onChange={(e) => updateField("importer", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Exporter</Label>
                  <Input value={formData.exporter} onChange={(e) => updateField("exporter", e.target.value)} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Consignee</Label>
                  <Input value={formData.consignee} onChange={(e) => updateField("consignee", e.target.value)} />
                </div>
              </div>
            )}

            {/* STEP 2: Shipment Information */}
            {currentStep === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Shipment Number</Label>
                  <Input value={formData.shipmentNumber} onChange={(e) => updateField("shipmentNumber", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Container Number</Label>
                  <Input value={formData.containerNumber} onChange={(e) => updateField("containerNumber", e.target.value)} />
                </div>
                
                <div className="space-y-2 flex gap-4">
                  <div className="flex-1 space-y-2">
                    <Label>Container Size</Label>
                    <Select value={formData.containerSize} onValueChange={(val) => updateField("containerSize", val)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="20ft">20ft</SelectItem>
                        <SelectItem value="40ft">40ft</SelectItem>
                        <SelectItem value="LCL">LCL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label>Type</Label>
                    <Select value={formData.containerType} onValueChange={(val) => updateField("containerType", val)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Standard">Standard</SelectItem>
                        <SelectItem value="High Cube">High Cube</SelectItem>
                        <SelectItem value="Reefer">Reefer</SelectItem>
                        <SelectItem value="Air Cargo">Air Cargo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Shipping Line / Carrier</Label>
                  <Input value={formData.shippingLine} onChange={(e) => updateField("shippingLine", e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label>Vessel Name / Flight</Label>
                  <Input value={formData.vesselName} onChange={(e) => updateField("vesselName", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Voyage Number</Label>
                  <Input value={formData.voyageNumber} onChange={(e) => updateField("voyageNumber", e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label>Origin / Loading Port</Label>
                  <Input value={formData.loadingPort} onChange={(e) => updateField("loadingPort", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Destination / Discharge Port</Label>
                  <Input value={formData.dischargePort} onChange={(e) => updateField("dischargePort", e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label>Departure Date (ETD)</Label>
                  <Input type="date" value={formData.etd} onChange={(e) => updateField("etd", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Arrival Date (ETA)</Label>
                  <Input type="date" value={formData.eta} onChange={(e) => updateField("eta", e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label>Incoterms</Label>
                  <Select value={formData.incoterms} onValueChange={(val) => updateField("incoterms", val)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FOB">FOB (Free on Board)</SelectItem>
                      <SelectItem value="CIF">CIF (Cost, Insurance & Freight)</SelectItem>
                      <SelectItem value="EXW">EXW (Ex Works)</SelectItem>
                      <SelectItem value="DDP">DDP (Delivered Duty Paid)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Transport Type</Label>
                  <Select value={formData.transportType} onValueChange={(val) => updateField("transportType", val)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sea">Sea Freight</SelectItem>
                      <SelectItem value="Air">Air Freight</SelectItem>
                      <SelectItem value="Land">Land Transport</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* STEP 3: Cargo Information */}
            {currentStep === 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label>Cargo Description</Label>
                  <Textarea 
                    rows={3} 
                    value={formData.description} 
                    onChange={(e) => updateField("description", e.target.value)} 
                    placeholder="Brief description of the goods being shipped..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gross Weight (kg)</Label>
                  <Input type="number" value={formData.grossWeight || ''} onChange={(e) => updateField("grossWeight", Number(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label>Net Weight (kg)</Label>
                  <Input type="number" value={formData.netWeight || ''} onChange={(e) => updateField("netWeight", Number(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label>Package Count</Label>
                  <Input type="number" value={formData.packageCount || ''} onChange={(e) => updateField("packageCount", Number(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label>Package Type</Label>
                  <Input value={formData.packageType} onChange={(e) => updateField("packageType", e.target.value)} placeholder="e.g. Pallets, Cartons, Crates" />
                </div>
                {/* Note: Product dynamic list omitted for brevity, usually a complex sub-form */}
              </div>
            )}

            {/* STEP 4: Customs */}
            {currentStep === 4 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Linked BOE Number</Label>
                  <Input value={formData.boeNumber} onChange={(e) => updateField("boeNumber", e.target.value)} placeholder="Leave blank to generate later" />
                </div>
                <div className="space-y-2">
                  <Label>Estimated Duty Amount ($)</Label>
                  <Input type="number" value={formData.dutyAmount || ''} onChange={(e) => updateField("dutyAmount", Number(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label>Customs Status</Label>
                  <Select value={formData.customsStatus} onValueChange={(val) => updateField("customsStatus", val)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Not Started">Not Started</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Under Review">Under Review</SelectItem>
                      <SelectItem value="Cleared">Cleared</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Clearance Status</Label>
                  <Input value={formData.clearanceStatus} onChange={(e) => updateField("clearanceStatus", e.target.value)} />
                </div>
              </div>
            )}

            {/* STEP 5: Documents */}
            {currentStep === 5 && (
              <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg bg-muted/20">
                <p className="text-muted-foreground text-center mb-4">
                  Upload relevant shipping documents (Commercial Invoice, Packing List, Bill of Lading).<br/>
                  These can also be attached later from the Shipment Details page.
                </p>
                <Button variant="outline">Browse Files</Button>
              </div>
            )}

            {/* STEP 6: Review */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="bg-muted p-4 rounded-md">
                  <h4 className="font-semibold mb-2">Review Shipment Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-muted-foreground">Client:</span> {formData.clientName || "Not selected"}</div>
                    <div><span className="text-muted-foreground">Shipment No:</span> {formData.shipmentNumber || "Not provided"}</div>
                    <div><span className="text-muted-foreground">Route:</span> {formData.loadingPort || "?"} → {formData.dischargePort || "?"}</div>
                    <div><span className="text-muted-foreground">ETA:</span> {formData.eta || "Not provided"}</div>
                    <div><span className="text-muted-foreground">Carrier:</span> {formData.shippingLine || "Not provided"}</div>
                    <div><span className="text-muted-foreground">Status:</span> {formData.status}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 border p-4 rounded-md bg-warning/10 text-warning border-warning/20">
                  <p className="text-sm font-medium">Verify all information before final submission. Generating a shipment will update dashboard metrics and alert assigned personnel.</p>
                </div>
              </div>
            )}

          </CardContent>
          <CardFooter className="flex justify-between border-t p-6">
            <Button variant="outline" onClick={handlePrev} disabled={currentStep === 1}>
              Previous
            </Button>
            <div className="flex gap-2">
              <Button variant="outline">Save Draft</Button>
              {currentStep < totalSteps ? (
                <Button onClick={handleNext}>Next Step <ChevronRight className="ml-2 h-4 w-4" /></Button>
              ) : (
                <Button onClick={handleSubmit}><Save className="mr-2 h-4 w-4" /> {isEditing ? 'Save Changes' : 'Submit Shipment'}</Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
