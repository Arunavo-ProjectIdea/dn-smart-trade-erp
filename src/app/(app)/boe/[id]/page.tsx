import { notFound } from "next/navigation";
import Link from "next/link";
import { getMockBOEById } from "@/lib/mock-data/boe";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Edit, Download, Printer, Copy, FileText, CheckCircle2, Package, MapPin, Building2, Anchor, Trash2 } from "lucide-react";
import { BOEStatus } from "@/lib/types/boe";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataTable } from "@/components/erp/data-table";
import { mockDocumentsList } from "@/lib/mock-data/document";
import { useToast } from "@/components/ui/use-toast";

import { PageHeader } from "@/components/erp/page-header";
import { StatusBadge } from "@/components/erp/status-badge";

export default async function BOEDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { toast } = useToast();
  const resolvedParams = await params;
  const boe = getMockBOEById(resolvedParams.id);

  if (!boe) {
    notFound();
  }

  const boeDocs = mockDocumentsList.filter(d => d.boeId === boe.id || d.boeId === boe.boeNumber)
  
  const documentColumns = [
    { 
      header: "Name", 
      accessorKey: "name" as keyof typeof boeDocs[0],
      cell: (item: typeof boeDocs[0]) => (
        <Link href={`/documents/${item.id}`} className="font-medium text-primary hover:underline max-w-[200px] truncate block">
          {item.name}
        </Link>
      )
    },
    { header: "Type", accessorKey: "type" as keyof typeof boeDocs[0] },
    { 
      header: "Status", 
      accessorKey: "status" as keyof typeof boeDocs[0],
      cell: (item: typeof boeDocs[0]) => (
          <StatusBadge status={item.status as any} />
      )
    },
    { 
      header: "Date", 
      accessorKey: "uploadedAt" as keyof typeof boeDocs[0],
      cell: (item: typeof boeDocs[0]) => new Date(item.uploadedAt).toLocaleDateString()
    }
  ]

  const formatCurrency = (amount: number, currency: string = "BDT") => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  };

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full pb-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/boe" className={buttonVariants({ variant: "outline", size: "icon" })}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <PageHeader 
                title={boe.boeNumber} 
                className="mb-0 gap-0"
              />
              <StatusBadge status={boe.status as any} className="mt-1" />
            </div>
            <p className="text-sm text-muted-foreground">
              Created on {new Date(boe.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/boe/${boe.id}/edit`} className={buttonVariants({ variant: "outline", size: "sm" })}>
             <Edit className="mr-2 h-4 w-4" /> Edit
          </Link>
          <Button variant="outline" size="sm" onClick={() => toast({ title: "Duplicate", description: "This feature is coming soon." })}>
            <Copy className="mr-2 h-4 w-4" /> Duplicate
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast({ title: "Download PDF", description: "PDF generation started." })}>
            <Download className="mr-2 h-4 w-4" /> PDF
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast({ title: "Print", description: "Sending to printer..." })}>
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
          <Button variant="destructive" size="sm" onClick={() => toast({ title: "Delete", description: "This feature is coming soon." })}>
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Building2 className="h-4 w-4" /> Importer
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
              <Anchor className="h-4 w-4" /> Shipment Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              <Link href={`/shipments/${boe.shipment.shipmentId}`} className="text-primary hover:underline">
                {boe.shipment.shipmentId}
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {boe.shipment.port}
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
              <FileText className="h-4 w-4" /> Total Duties & Taxes
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
            <CardHeader>
              <CardTitle>Declared Products</CardTitle>
              <CardDescription>Items declared in this Bill of Entry.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>HS Code</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Declared Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {boe.products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          {product.productName}
                        </div>
                      </TableCell>
                      <TableCell>{product.hsCode}</TableCell>
                      <TableCell className="text-right">
                        {product.quantity.toLocaleString()} {product.unit}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(product.declaredValue, product.currency)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
              <div className="relative border-l border-muted ml-3 space-y-8 pb-4">
                {boe.timeline.map((event) => (
                  <div key={event.id} className="relative pl-8">
                    <div className="absolute -left-3.5 top-1 h-7 w-7 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                       <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">{event.status}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(event.date).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm">{event.note}</p>
                      <p className="text-xs text-muted-foreground mt-1">by {event.author}</p>
                    </div>
                  </div>
                ))}
              </div>
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
    </div>
  );
}
