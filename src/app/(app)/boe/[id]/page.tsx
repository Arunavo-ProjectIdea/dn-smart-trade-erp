"use client";

import { use, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BillOfEntry, BOEProduct } from "@/lib/types/boe";
import { getBOEById, deleteBOE, createBOEProduct, updateBOEProduct, deleteBOEProduct } from "@/app/(app)/boe/actions";
import { getUserProfile } from "@/actions/auth.actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
} from "@fortawesome/free-solid-svg-icons";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataTable } from "@/components/erp/data-table";
import { mockDocumentsList } from "@/lib/mock-data/document";
import { useToast } from "@/components/ui/use-toast";
import { PageHeader } from "@/components/erp/page-header";
import { StatusBadge, type StatusType } from "@/components/erp/status-badge";

export default function BOEDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { toast } = useToast();
  const router = useRouter();
  const resolvedParams = use(params);

  const [boe, setBoe] = useState<BillOfEntry | null>(null);
  const [userRole, setUserRole] = useState<string>("Admin");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    const res = await getBOEById(resolvedParams.id);
    if (res.error || !res.data) {
      setErrorMessage(res.error || "Bill of Entry not found.");
      setBoe(null);
    } else {
      setBoe(res.data);
    }
    setIsLoading(false);
  }, [resolvedParams.id]);

  useEffect(() => {
    getUserProfile().then((res) => {
      if (res.success && res.data?.role) setUserRole(res.data.role as string);
    });

    getBOEById(resolvedParams.id).then((res) => {
      if (res.error || !res.data) {
        setErrorMessage(res.error || "Bill of Entry not found.");
        setBoe(null);
      } else {
        setBoe(res.data);
      }
      setIsLoading(false);
    });
  }, [resolvedParams.id]);

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
            <Link href={`/boe/${boe.id}/edit`} className={buttonVariants({ variant: "outline", size: "sm" })}>
              <FontAwesomeIcon icon={faPen} className="mr-2 h-4 w-4" /> Edit
            </Link>
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
                        <TableCell>{product.hsCode}</TableCell>
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
            <CardHeader>
              <CardTitle>Duty Calculation Breakdown</CardTitle>
              <CardDescription>Detailed breakdown of applicable taxes and duties.</CardDescription>
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
            <CardHeader>
              <CardTitle>Approval History & Timeline</CardTitle>
              <CardDescription>Track the lifecycle of this document.</CardDescription>
            </CardHeader>
            <CardContent>
              {boe.timeline.length > 0 ? (
                <div className="relative border-l border-muted ml-3 space-y-8 pb-4">
                  {boe.timeline.map((event) => (
                    <div key={event.id} className="relative pl-8">
                      <div className="absolute -left-3.5 top-1 h-7 w-7 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                        <FontAwesomeIcon icon={faCircleCheck} className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold">{event.status}</span>
                          <span className="text-xs text-muted-foreground">{new Date(event.date).toLocaleString()}</span>
                        </div>
                        <p className="text-sm">{event.note}</p>
                        <p className="text-xs text-muted-foreground mt-1">by {event.author}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">No history events recorded yet.</div>
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
                <Label htmlFor="prodHsCode">HS Code</Label>
                <Input
                  id="prodHsCode"
                  value={prodHsCode}
                  onChange={(e) => setProdHsCode(e.target.value)}
                  placeholder="e.g. 8452.29.00"
                />
              </div>

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
