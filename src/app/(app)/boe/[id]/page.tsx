"use client";

import { use, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BillOfEntry, BOEProduct, BOETimelineEvent, BOEStatus } from "@/lib/types/boe";
import {
  getBOEById,
  deleteBOE,
  createBOEProduct,
  updateBOEProduct,
  deleteBOEProduct,
  getHSCodes,
  calculateDuty,
  updateCalculatedAmounts,
  getBOETimeline,
  updateBOEStatus,
  HSCodeItem,
  DutyCalculationResult,
} from "@/app/(app)/boe/actions";
import { getUserProfile } from "@/actions/auth.actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faPen,
  faDownload,
  faCircle,
  faFileLines,
  faCircleCheck,
  faBox,
  faLocationDot,
  faBuilding,
  faTrash,
  faPlus,
  faTimes,
  faCalculator,
  faRotate,
} from "@fortawesome/free-solid-svg-icons";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataTable } from "@/components/erp/data-table";
import { mockDocumentsList } from "@/lib/mock-data/document";
import { useToast } from "@/components/ui/use-toast";
import { PageHeader } from "@/components/erp/page-header";
import { StatusBadge, type StatusType } from "@/components/erp/status-badge";

const STATUS_OPTIONS: BOEStatus[] = ["Draft", "Submitted", "Under Review", "Approved", "Rejected", "Completed"];

export default function BOEDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { toast } = useToast();
  const router = useRouter();
  const resolvedParams = use(params);

  const [boe, setBoe] = useState<BillOfEntry | null>(null);
  const [userRole, setUserRole] = useState<string>("Admin");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // HS Codes reference list
  const [hsCodesList, setHsCodesList] = useState<HSCodeItem[]>([]);

  // Timeline events state
  const [timelineList, setTimelineList] = useState<BOETimelineEvent[]>([]);

  // Product CRUD states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<BOEProduct | null>(null);
  const [isProductSubmitting, setIsProductSubmitting] = useState(false);
  const [productError, setProductError] = useState<string | null>(null);

  const [prodName, setProdName] = useState("");
  const [prodHsCode, setProdHsCode] = useState("");
  const [prodQty, setProdQty] = useState<number>(1);
  const [prodUnit, setProdUnit] = useState("Pieces");
  const [prodDeclaredVal, setProdDeclaredVal] = useState<number>(100);
  const [prodCurrency, setProdCurrency] = useState("USD");

  // Dynamic calculation preview state
  const [dutyPreview, setDutyPreview] = useState<DutyCalculationResult | null>(null);
  const [isRecalculating, setIsRecalculating] = useState(false);

  // Status transition modal state
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedNextStatus, setSelectedNextStatus] = useState<string>("");
  const [statusNote, setStatusNote] = useState("");
  const [isStatusSubmitting, setIsStatusSubmitting] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    const res = await getBOEById(resolvedParams.id);
    if (res.error || !res.data) {
      setErrorMessage(res.error || "Bill of Entry not found.");
      setBoe(null);
    } else {
      setBoe(res.data);
      const timelineRes = await getBOETimeline(res.data.id);
      if (timelineRes.data) {
        setTimelineList(timelineRes.data);
      }
    }
    setIsLoading(false);
  }, [resolvedParams.id]);

  useEffect(() => {
    getUserProfile().then((res) => {
      if (res.success && res.data?.role) setUserRole(res.data.role as string);
    });
    getHSCodes().then((res) => {
      if (res.data) setHsCodesList(res.data);
    });

    getBOEById(resolvedParams.id).then((res) => {
      if (res.error || !res.data) {
        setErrorMessage(res.error || "Bill of Entry not found.");
        setBoe(null);
      } else {
        setBoe(res.data);
        getBOETimeline(res.data.id).then((tRes) => {
          if (tRes.data) setTimelineList(tRes.data);
        });
      }
      setIsLoading(false);
    });
  }, [resolvedParams.id]);

  // Recalculate duty preview when form values change in modal
  useEffect(() => {
    let isCancelled = false;

    if (prodHsCode && prodQty > 0 && prodDeclaredVal > 0) {
      calculateDuty({
        hsCode: prodHsCode,
        quantity: prodQty,
        unitPrice: prodDeclaredVal / (prodQty || 1),
        currency: prodCurrency,
      }).then((res) => {
        if (!isCancelled) {
          setDutyPreview(res.success && res.data ? res.data : null);
        }
      });
    }

    return () => {
      isCancelled = true;
    };
  }, [prodHsCode, prodQty, prodDeclaredVal, prodCurrency]);

  const handleDeleteBOE = async () => {
    if (!boe) return;
    if (confirm("Are you sure you want to delete this Bill of Entry?")) {
      const res = await deleteBOE(boe.id);
      if (!res.success) {
        toast({
          variant: "destructive",
          title: "Deletion Restricted",
          description: res.error || "BOE deletion is disabled for audit compliance.",
        });
      } else {
        toast({
          title: "BOE Deleted",
          description: "Bill of Entry record deleted successfully.",
        });
        router.push("/boe");
      }
    }
  };

  // Status transition handler
  const openStatusModal = () => {
    if (!boe) return;
    setSelectedNextStatus("");
    setStatusNote("");
    setStatusError(null);
    setIsStatusModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!boe) return;
    if (!selectedNextStatus) {
      setStatusError("Please select the next target status.");
      return;
    }
    if (!statusNote.trim()) {
      setStatusError("Please enter a note/description for this status update.");
      return;
    }

    setIsStatusSubmitting(true);
    setStatusError(null);

    try {
      const res = await updateBOEStatus(boe.id, selectedNextStatus, statusNote.trim());
      if (!res.success) {
        setStatusError(res.error || "Failed to update BOE status.");
        setIsStatusSubmitting(false);
        return;
      }

      toast({
        title: "Status Updated",
        description: `BOE status updated to ${selectedNextStatus}.`,
      });

      setIsStatusModalOpen(false);
      loadData();
    } catch (err) {
      console.error("Error updating status:", err);
      setStatusError(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setIsStatusSubmitting(false);
    }
  };

  // Product actions
  const openAddModal = () => {
    setEditingProduct(null);
    setProdName("");
    setProdHsCode("");
    setProdQty(1);
    setProdUnit("Pieces");
    setProdDeclaredVal(100);
    setProdCurrency("USD");
    setProductError(null);
    setDutyPreview(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (product: BOEProduct) => {
    setEditingProduct(product);
    setProdName(product.productName);
    setProdHsCode(product.hsCode === "N/A" ? "" : product.hsCode);
    setProdQty(product.quantity);
    setProdUnit(product.unit);
    setProdDeclaredVal(product.declaredValue);
    setProdCurrency(product.currency);
    setProductError(null);
    setDutyPreview(null);
    setIsAddModalOpen(true);
  };

  const handleSaveProduct = async () => {
    if (!boe) return;
    setIsProductSubmitting(true);
    setProductError(null);

    try {
      if (editingProduct) {
        const res = await updateBOEProduct(editingProduct.id, {
          productName: prodName.trim(),
          hsCode: prodHsCode.trim() || null,
          quantity: prodQty,
          unit: prodUnit.trim() || "Pieces",
          declaredValue: prodDeclaredVal,
          currency: prodCurrency.trim() || "USD",
        });

        if (!res.success) {
          setProductError(res.error || "Failed to update product.");
          setIsProductSubmitting(false);
          return;
        }

        toast({
          title: "Product Updated",
          description: `Product ${prodName} updated successfully.`,
        });
      } else {
        const res = await createBOEProduct({
          boeId: boe.id,
          productName: prodName.trim(),
          hsCode: prodHsCode.trim() || null,
          quantity: prodQty,
          unit: prodUnit.trim() || "Pieces",
          declaredValue: prodDeclaredVal,
          currency: prodCurrency.trim() || "USD",
        });

        if (!res.success) {
          setProductError(res.error || "Failed to add product.");
          setIsProductSubmitting(false);
          return;
        }

        toast({
          title: "Product Added",
          description: `Product ${prodName} added to Bill of Entry.`,
        });
      }

      setIsAddModalOpen(false);
      loadData();
    } catch (err) {
      console.error("Error saving BOE product:", err);
      setProductError(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setIsProductSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!boe) return;
    if (confirm(`Are you sure you want to remove product "${productName}" from this BOE?`)) {
      const res = await deleteBOEProduct(productId, boe.id);
      if (!res.success) {
        toast({
          variant: "destructive",
          title: "Failed to delete product",
          description: res.error || "Could not delete product.",
        });
      } else {
        toast({
          title: "Product Removed",
          description: `Product "${productName}" has been removed from this BOE.`,
        });
        loadData();
      }
    }
  };

  // Recalculate duties for all products on BOE
  const handleRecalculateBOEDuties = async () => {
    if (!boe) return;
    setIsRecalculating(true);

    try {
      let totalCD = 0;
      let totalVAT = 0;
      let totalAIT = 0;

      for (const prod of boe.products) {
        if (prod.hsCode && prod.hsCode !== "N/A") {
          const res = await calculateDuty({
            hsCode: prod.hsCode,
            quantity: prod.quantity,
            unitPrice: prod.declaredValue / (prod.quantity || 1),
            currency: prod.currency,
          });
          if (res.success && res.data) {
            totalCD += res.data.cdAmount;
            totalVAT += res.data.vatAmount;
            totalAIT += res.data.aitAmount;
          }
        }
      }

      const totalAT = (totalCD + totalVAT) * 0.05;
      const totalOther = 500;
      const grandTotal = totalCD + totalVAT + totalAIT + totalAT + totalOther;

      const updateRes = await updateCalculatedAmounts(boe.id, {
        importDuty: totalCD,
        vat: totalVAT,
        ait: totalAIT,
        at: totalAT,
        otherCharges: totalOther,
        grandTotal: grandTotal,
      });

      if (!updateRes.success) {
        toast({
          variant: "destructive",
          title: "Recalculation Failed",
          description: updateRes.error || "Failed to update duties.",
        });
      } else {
        toast({
          title: "Duties Recalculated",
          description: "BOE Duty calculations updated successfully in database.",
        });
        loadData();
      }
    } catch (err) {
      console.error("Error recalculating BOE duties:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred during recalculation.",
      });
    } finally {
      setIsRecalculating(false);
    }
  };

  if (isLoading) {
    return <div className="p-12 text-center text-muted-foreground">Loading Bill of Entry details...</div>;
  }

  if (errorMessage || !boe) {
    return (
      <div className="p-8 text-center max-w-xl mx-auto my-12 bg-destructive/10 text-destructive rounded-lg space-y-4">
        <h2 className="text-xl font-bold">Bill of Entry Not Found</h2>
        <p className="text-sm">{errorMessage}</p>
        <Link href="/boe" className={buttonVariants({ variant: "outline" })}>
          Back to Bills of Entry
        </Link>
      </div>
    );
  }

  const boeDocs = mockDocumentsList.filter((d) => d.boeId === boe.id || d.boeId === boe.boeNumber);

  const documentColumns = [
    {
      header: "Name",
      accessorKey: "name" as keyof (typeof boeDocs)[0],
      cell: (item: (typeof boeDocs)[0]) => (
        <Link href={`/documents/${item.id}`} className="font-medium text-primary hover:underline max-w-[200px] truncate block">
          {item.name}
        </Link>
      ),
    },
    { header: "Type", accessorKey: "type" as keyof (typeof boeDocs)[0] },
    {
      header: "Status",
      accessorKey: "status" as keyof (typeof boeDocs)[0],
      cell: (item: (typeof boeDocs)[0]) => <StatusBadge status={item.status as StatusType} />,
    },
    {
      header: "Date",
      accessorKey: "uploadedAt" as keyof (typeof boeDocs)[0],
      cell: (item: (typeof boeDocs)[0]) => new Date(item.uploadedAt).toLocaleDateString(),
    },
  ];

  const formatCurrency = (amount: number, currency: string = "BDT") => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  };

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full pb-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/boe" className={buttonVariants({ variant: "outline", size: "icon" })}>
            <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <PageHeader title={boe.boeNumber} className="mb-0 gap-0" />
              <StatusBadge status={boe.status as StatusType} className="mt-1" />
            </div>
            <p className="text-sm text-muted-foreground">Created on {new Date(boe.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {userRole !== "Client" && (
            <>
              <Button variant="default" size="sm" onClick={openStatusModal}>
                <FontAwesomeIcon icon={faRotate} className="mr-2 h-4 w-4" /> Update Status
              </Button>
              <Link href={`/boe/${boe.id}/edit`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                <FontAwesomeIcon icon={faPen} className="mr-2 h-4 w-4" /> Edit
              </Link>
            </>
          )}
          <Button variant="outline" size="sm" onClick={() => toast({ title: "Duplicate", description: "This feature is coming soon." })}>
            <FontAwesomeIcon icon={faCircle} className="mr-2 h-4 w-4" /> Duplicate
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast({ title: "Download PDF", description: "PDF generation started." })}>
            <FontAwesomeIcon icon={faDownload} className="mr-2 h-4 w-4" /> PDF
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast({ title: "Print", description: "Sending to printer..." })}>
            <FontAwesomeIcon icon={faCircle} className="mr-2 h-4 w-4" /> Print
          </Button>
          {userRole !== "Client" && (
            <Button variant="destructive" size="sm" onClick={handleDeleteBOE}>
              <FontAwesomeIcon icon={faTrash} className="mr-2 h-4 w-4" /> Delete
            </Button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FontAwesomeIcon icon={faBuilding} className="h-4 w-4" /> Importer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{boe.importer.clientName}</div>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{boe.importer.companyName}</p>
            <div className="mt-4 flex flex-col gap-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">BIN:</span>
                <span className="font-medium">{boe.importer.bin}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">TIN:</span>
                <span className="font-medium">{boe.importer.tin}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FontAwesomeIcon icon={faCircle} className="h-4 w-4" /> Shipment Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              <span className="text-primary">{boe.shipment.shipmentId}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
              <FontAwesomeIcon icon={faLocationDot} className="h-3 w-3" /> {boe.shipment.port}
            </p>
            <div className="mt-4 flex flex-col gap-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Carrier:</span>
                <span className="font-medium">{boe.shipment.carrier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Arrival:</span>
                <span className="font-medium">{new Date(boe.shipment.arrivalDate).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary flex items-center gap-2">
              <FontAwesomeIcon icon={faFileLines} className="h-4 w-4" /> Total Duties & Taxes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{formatCurrency(boe.duties.grandTotal)}</div>
            <div className="mt-4 flex flex-col gap-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Import Duty:</span>
                <span>{formatCurrency(boe.duties.importDuty)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">VAT:</span>
                <span>{formatCurrency(boe.duties.vat)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="duties">Duty Breakdown</TabsTrigger>
          <TabsTrigger value="timeline">History & Timeline</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Declared Products</CardTitle>
                <CardDescription>Items declared in this Bill of Entry.</CardDescription>
              </div>
              {userRole !== "Client" && (
                <Button onClick={openAddModal} size="sm">
                  <FontAwesomeIcon icon={faPlus} className="mr-2 h-4 w-4" /> Add Product
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {boe.products.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead>HS Code</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Declared Value</TableHead>
                      {userRole !== "Client" && <TableHead className="text-right">Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {boe.products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faBox} className="h-4 w-4 text-muted-foreground" />
                            {product.productName}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono bg-muted px-2 py-0.5 rounded text-xs">{product.hsCode}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          {product.quantity.toLocaleString()} {product.unit}
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(product.declaredValue, product.currency)}</TableCell>
                        {userRole !== "Client" && (
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditModal(product)}>
                                <FontAwesomeIcon icon={faPen} className="h-3.5 w-3.5 text-muted-foreground" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => handleDeleteProduct(product.id, product.productName)}
                              >
                                <FontAwesomeIcon icon={faTrash} className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-8 text-center text-muted-foreground">No declared products recorded for this BOE.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Duties Tab */}
        <TabsContent value="duties" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Duty Calculation Breakdown</CardTitle>
                <CardDescription>Detailed breakdown of applicable taxes and duties.</CardDescription>
              </div>
              {userRole !== "Client" && (
                <Button size="sm" variant="outline" onClick={handleRecalculateBOEDuties} disabled={isRecalculating}>
                  <FontAwesomeIcon icon={faCalculator} className="mr-2 h-4 w-4 text-primary" />
                  {isRecalculating ? "Calculating..." : "Recalculate & Save Duties"}
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-w-2xl">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium text-muted-foreground">Import Duty (ID)</span>
                  <span className="font-medium">{formatCurrency(boe.duties.importDuty)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium text-muted-foreground">Value Added Tax (VAT)</span>
                  <span className="font-medium">{formatCurrency(boe.duties.vat)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium text-muted-foreground">Advance Income Tax (AIT)</span>
                  <span className="font-medium">{formatCurrency(boe.duties.ait)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium text-muted-foreground">Advance Tax (AT)</span>
                  <span className="font-medium">{formatCurrency(boe.duties.at)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium text-muted-foreground">Other Charges</span>
                  <span className="font-medium">{formatCurrency(boe.duties.otherCharges)}</span>
                </div>
                <div className="flex justify-between items-center py-4 bg-muted/50 px-4 rounded-lg mt-4">
                  <span className="font-bold text-lg">Grand Total Payable</span>
                  <span className="font-bold text-xl text-primary">{formatCurrency(boe.duties.grandTotal)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Approval History & Audit Timeline</CardTitle>
                <CardDescription>Track the lifecycle events and status transitions of this Bill of Entry.</CardDescription>
              </div>
              {userRole !== "Client" && (
                <Button size="sm" variant="outline" onClick={openStatusModal}>
                  <FontAwesomeIcon icon={faPlus} className="mr-2 h-4 w-4" /> Add Event
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {timelineList.length > 0 ? (
                <div className="relative border-l-2 border-primary/30 ml-4 space-y-8 pb-4 pt-2">
                  {timelineList.map((event) => (
                    <div key={event.id} className="relative pl-8">
                      <div className="absolute -left-[17px] top-0.5 h-8 w-8 rounded-full bg-background border-2 border-primary flex items-center justify-center shadow-sm">
                        <FontAwesomeIcon icon={faCircleCheck} className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex flex-col gap-1.5 bg-muted/30 p-4 rounded-lg border border-border/60">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <StatusBadge status={event.status as StatusType} />
                            <span className="text-xs font-mono text-muted-foreground">
                              {new Date(event.date).toLocaleString()}
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded">
                            By {event.author}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-foreground mt-1">{event.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-muted-foreground">No timeline audit events recorded yet.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Attached Documents</CardTitle>
                <CardDescription>Supporting documents for this BOE.</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/documents/upload?boeId=${boe.id}`} className={buttonVariants({ variant: "outline" })}>
                  Upload
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={documentColumns}
                data={boeDocs}
                emptyStateTitle="No documents"
                emptyStateDescription="There are no documents attached to this Bill of Entry."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Status Update Modal */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-background rounded-lg border shadow-lg p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold">Update BOE Lifecycle Status</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsStatusModalOpen(false)}>
                <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
              </Button>
            </div>

            {statusError && (
              <div className="p-3 bg-destructive/15 border border-destructive/30 text-destructive rounded-md text-sm">
                {statusError}
              </div>
            )}

            <div className="space-y-4 text-sm">
              <div className="space-y-1">
                <Label>Current Status</Label>
                <div className="p-2.5 bg-muted rounded-md font-semibold text-foreground flex items-center gap-2">
                  <StatusBadge status={boe.status as StatusType} />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="nextStatus">Target Status *</Label>
                <Select value={selectedNextStatus} onValueChange={(val) => setSelectedNextStatus(val || "")}>
                  <SelectTrigger id="nextStatus" className="h-10">
                    <SelectValue placeholder="Select next status..." />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.filter((s) => s !== boe.status).map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="statusNote">Transition Note / Reason *</Label>
                <Textarea
                  id="statusNote"
                  rows={3}
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="Provide audit notes or reasons for this status update..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsStatusModalOpen(false)} disabled={isStatusSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleUpdateStatus} disabled={isStatusSubmitting}>
                {isStatusSubmitting ? "Updating..." : "Update Status"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg bg-background rounded-lg border shadow-lg p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold">{editingProduct ? "Edit BOE Product" : "Add Product to BOE"}</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsAddModalOpen(false)}>
                <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
              </Button>
            </div>

            {productError && (
              <div className="p-3 bg-destructive/15 border border-destructive/30 text-destructive rounded-md text-sm">
                {productError}
              </div>
            )}

            <div className="space-y-4 text-sm">
              <div className="space-y-1">
                <Label htmlFor="prodName">Product Name *</Label>
                <Input
                  id="prodName"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="e.g. Industrial Sewing Machine"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="prodHsCode">HS Code (Supabase Reference)</Label>
                <Select value={prodHsCode} onValueChange={(val) => setProdHsCode(val || "")}>
                  <SelectTrigger id="prodHsCode" className="h-10 font-mono text-sm">
                    <SelectValue placeholder="Select HS Code..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {hsCodesList.map((code) => (
                      <SelectItem key={code.code} value={code.code} className="font-mono text-xs">
                        <span className="font-bold text-primary mr-2">{code.code}</span>
                        <span className="text-muted-foreground font-sans truncate">{code.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Duty Calculation Preview inside Modal */}
              {dutyPreview && (
                <div className="p-3 bg-primary/5 border border-primary/20 rounded-md text-xs space-y-1">
                  <div className="flex justify-between font-semibold text-primary">
                    <span>Tax Assessment Preview</span>
                    <span>{formatCurrency(dutyPreview.grandTotalAmount)}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] text-muted-foreground">
                    <div>CD: {formatCurrency(dutyPreview.cdAmount)}</div>
                    <div>VAT: {formatCurrency(dutyPreview.vatAmount)}</div>
                    <div>AIT: {formatCurrency(dutyPreview.aitAmount)}</div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="prodQty">Quantity *</Label>
                  <Input
                    id="prodQty"
                    type="number"
                    min={1}
                    value={prodQty}
                    onChange={(e) => setProdQty(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="prodUnit">Unit *</Label>
                  <Input
                    id="prodUnit"
                    value={prodUnit}
                    onChange={(e) => setProdUnit(e.target.value)}
                    placeholder="Pieces, Kg, Sets"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="prodValue">Declared Value *</Label>
                  <Input
                    id="prodValue"
                    type="number"
                    min={1}
                    value={prodDeclaredVal}
                    onChange={(e) => setProdDeclaredVal(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="prodCurrency">Currency *</Label>
                  <Input
                    id="prodCurrency"
                    value={prodCurrency}
                    onChange={(e) => setProdCurrency(e.target.value)}
                    placeholder="USD, BDT, EUR"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)} disabled={isProductSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleSaveProduct} disabled={isProductSubmitting}>
                {isProductSubmitting ? "Saving..." : editingProduct ? "Update Product" : "Add Product"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
