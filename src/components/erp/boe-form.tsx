"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { BillOfEntry, BOEStatus } from "@/lib/types/boe";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faCircleCheck, faSave } from "@fortawesome/free-solid-svg-icons";
import { createBOE, updateBOE, createBOEProduct } from "@/app/(app)/boe/actions";

interface AvailableShipment {
  id: string;
  shipmentNumber: string;
  clientName: string;
}

interface BOEFormProps {
  initialData?: BillOfEntry | null;
  availableShipments?: AvailableShipment[];
}

const steps = [
  { id: 1, title: "BOE & Shipment", description: "BOE details and shipment reference" },
  { id: 2, title: "Customs Details", description: "Status and customs notes" },
  { id: 3, title: "Duty Calculation", description: "Taxes & duty breakdown" },
  { id: 4, title: "Review & Submit", description: "Final verification" },
];

export function BOEForm({ initialData, availableShipments = [] }: BOEFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isEditing = !!initialData?.id;

  // Form State
  const [boeNumber, setBoeNumber] = useState(
    initialData?.boeNumber || "BOE-2026-001"
  );
  const [selectedShipmentId, setSelectedShipmentId] = useState<string>(
    initialData?.shipment?.shipmentId || availableShipments[0]?.id || ""
  );
  const [status, setStatus] = useState<BOEStatus>(initialData?.status || "Draft");
  const [notes, setNotes] = useState<string>(initialData?.notes || "");

  // Duties
  const [importDuty, setImportDuty] = useState<number>(initialData?.duties?.importDuty || 0);
  const [vat, setVat] = useState<number>(initialData?.duties?.vat || 0);
  const [ait, setAit] = useState<number>(initialData?.duties?.ait || 0);
  const [at, setAt] = useState<number>(initialData?.duties?.at || 0);
  const [otherCharges, setOtherCharges] = useState<number>(initialData?.duties?.otherCharges || 0);

  const grandTotal = useMemo(() => {
    return importDuty + vat + ait + at + otherCharges;
  }, [importDuty, vat, ait, at, otherCharges]);

  const selectedShipmentInfo = useMemo(() => {
    return availableShipments.find((s) => s.id === selectedShipmentId);
  }, [availableShipments, selectedShipmentId]);

  const handleNext = () => {
    setErrorMessage(null);
    if (currentStep === 1) {
      if (!boeNumber.trim()) {
        setErrorMessage("BOE Number is required.");
        return;
      }
      if (!isEditing && !selectedShipmentId) {
        setErrorMessage("Please select an existing Shipment reference.");
        return;
      }
    }
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setErrorMessage(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (submitStatus?: BOEStatus) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const finalStatus = submitStatus || status;

    try {
      if (isEditing && initialData?.id) {
        const res = await updateBOE(initialData.id, {
          boeNumber: boeNumber.trim(),
          status: finalStatus,
          notes: notes.trim() || null,
          importDuty,
          vat,
          ait,
          at,
          otherCharges,
          grandTotal,
        });

        if (!res.success) {
          setErrorMessage(res.error || "Failed to update Bill of Entry.");
          setIsSubmitting(false);
          return;
        }

        toast({
          title: "BOE Updated",
          description: `Bill of Entry ${boeNumber} updated successfully.`,
        });
        router.push(`/boe/${initialData.id}`);
      } else {
        const res = await createBOE({
          boeNumber: boeNumber.trim(),
          shipmentId: selectedShipmentId,
          status: finalStatus,
          notes: notes.trim() || null,
          importDuty,
          vat,
          ait,
          at,
          otherCharges,
          grandTotal,
        });

        if (!res.success || !res.data) {
          setErrorMessage(res.error || "Failed to create Bill of Entry.");
          setIsSubmitting(false);
          return;
        }

        // Save products if added
        if (res.data.id && initialData?.products) {
          for (const prod of initialData.products) {
            if (prod.productName && prod.productName.trim()) {
              await createBOEProduct({
                boeId: res.data.id,
                productName: prod.productName,
                hsCode: prod.hsCode || null,
                quantity: prod.quantity > 0 ? prod.quantity : 1,
                unit: prod.unit || "Pieces",
                declaredValue: prod.declaredValue > 0 ? prod.declaredValue : 1,
                currency: prod.currency || "USD",
              });
            }
          }
        }

        toast({
          title: "BOE Created",
          description: `Bill of Entry ${boeNumber} has been successfully created.`,
        });
        router.push("/boe");
      }
    } catch (err) {
      console.error("Error submitting BOE form:", err);
      setErrorMessage(err instanceof Error ? err.message : "An unexpected error occurred.");
      setIsSubmitting(false);
    }
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
                    ${
                      isCompleted
                        ? "bg-primary border-primary text-primary-foreground"
                        : isCurrent
                        ? "border-primary text-primary bg-background"
                        : "border-muted bg-background text-muted-foreground"
                    }`}
                >
                  {isCompleted ? <FontAwesomeIcon icon={faCircleCheck} className="h-5 w-5" /> : step.id}
                </div>
                <div className="text-center hidden sm:block">
                  <div className={`text-sm font-medium ${isCurrent || isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                    {step.title}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-destructive/15 border border-destructive/30 text-destructive rounded-lg text-sm font-medium">
          {errorMessage}
        </div>
      )}

      <Card className="border-2 shadow-sm">
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
          <CardDescription>{steps[currentStep - 1].description}</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[350px]">
          {/* Step 1: BOE & Shipment */}
          {currentStep === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <Label htmlFor="boeNumber">BOE Number *</Label>
                <Input
                  id="boeNumber"
                  className="bg-background shadow-sm"
                  value={boeNumber}
                  onChange={(e) => setBoeNumber(e.target.value)}
                  placeholder="e.g. BOE-2026-001"
                />
              </div>

              {!isEditing ? (
                <div className="space-y-2">
                  <Label htmlFor="shipmentSelect">Target Shipment *</Label>
                  {availableShipments.length > 0 ? (
                    <Select value={selectedShipmentId} onValueChange={(val) => setSelectedShipmentId(val || "")}>
                      <SelectTrigger className="bg-background shadow-sm">
                        <SelectValue placeholder="Select a shipment..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableShipments.map((shp) => (
                          <SelectItem key={shp.id} value={shp.id}>
                            {shp.shipmentNumber} ({shp.clientName})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="p-3 bg-muted rounded-md text-sm text-muted-foreground">
                      No unassigned shipments available. All shipments already have a BOE or none exist.
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>Associated Shipment</Label>
                  <Input
                    className="bg-background shadow-sm"
                    disabled
                    value={initialData?.shipment?.shipmentId || "Assigned"}
                  />
                </div>
              )}
            </div>
          )}

          {/* Step 2: Customs Details */}
          {currentStep === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <Label htmlFor="statusSelect">BOE Status</Label>
                <Select value={status} onValueChange={(val) => setStatus((val || "Draft") as BOEStatus)}>
                  <SelectTrigger className="bg-background shadow-sm">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Submitted">Submitted</SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Customs Notes / Remarks</Label>
                <textarea
                  id="notes"
                  rows={4}
                  className="w-full p-3 rounded-md border bg-background text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter customs office, filing remarks, or special instructions..."
                />
              </div>
            </div>
          )}

          {/* Step 3: Duties */}
          {currentStep === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <Label htmlFor="importDuty">Import Duty (ID)</Label>
                <Input
                  id="importDuty"
                  type="number"
                  className="bg-background shadow-sm"
                  value={importDuty || ""}
                  onChange={(e) => setImportDuty(Number(e.target.value))}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vat">Value Added Tax (VAT)</Label>
                <Input
                  id="vat"
                  type="number"
                  className="bg-background shadow-sm"
                  value={vat || ""}
                  onChange={(e) => setVat(Number(e.target.value))}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ait">Advance Income Tax (AIT)</Label>
                <Input
                  id="ait"
                  type="number"
                  className="bg-background shadow-sm"
                  value={ait || ""}
                  onChange={(e) => setAit(Number(e.target.value))}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="at">Advance Tax (AT)</Label>
                <Input
                  id="at"
                  type="number"
                  className="bg-background shadow-sm"
                  value={at || ""}
                  onChange={(e) => setAt(Number(e.target.value))}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="otherCharges">Other Charges / Fees</Label>
                <Input
                  id="otherCharges"
                  type="number"
                  className="bg-background shadow-sm"
                  value={otherCharges || ""}
                  onChange={(e) => setOtherCharges(Number(e.target.value))}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="grandTotal">Grand Total (BDT)</Label>
                <Input
                  id="grandTotal"
                  type="number"
                  className="border-primary font-bold bg-background shadow-sm"
                  value={grandTotal}
                  readOnly
                />
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-muted/30 p-6 rounded-lg border space-y-4">
                <h3 className="text-lg font-bold">Review Bill of Entry Summary</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-muted-foreground">BOE Number:</span>
                    <p className="font-medium text-foreground">{boeNumber}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-muted-foreground">Status:</span>
                    <p className="font-medium text-foreground">{status}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-muted-foreground">Shipment Reference:</span>
                    <p className="font-medium text-foreground">
                      {selectedShipmentInfo ? `${selectedShipmentInfo.shipmentNumber} (${selectedShipmentInfo.clientName})` : initialData?.shipment?.shipmentId || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-muted-foreground">Customs Notes:</span>
                    <p className="font-medium text-foreground">{notes || "None"}</p>
                  </div>
                </div>

                <div className="pt-4 border-t bg-primary/5 p-4 rounded-md flex justify-between items-center">
                  <span className="font-bold text-lg">Total Duties Payable:</span>
                  <span className="font-bold text-xl text-primary">
                    BDT {grandTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between border-t bg-muted/10 py-4">
          <Button variant="outline" onClick={handlePrev} disabled={currentStep === 1 || isSubmitting}>
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2 h-4 w-4" /> Previous
          </Button>

          {currentStep < steps.length ? (
            <Button onClick={handleNext}>
              Next <FontAwesomeIcon icon={faArrowRight} className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleSubmit("Draft")} disabled={isSubmitting}>
                <FontAwesomeIcon icon={faSave} className="mr-2 h-4 w-4" /> Save as Draft
              </Button>
              <Button onClick={() => handleSubmit("Submitted")} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : isEditing ? "Update BOE" : "Submit BOE"}
                {!isSubmitting && <FontAwesomeIcon icon={faCircleCheck} className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
