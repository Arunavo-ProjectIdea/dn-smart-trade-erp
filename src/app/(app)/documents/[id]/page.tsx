"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getMockDocumentById } from "@/lib/mock-data/document";
import { Card } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowLeft, Download, Replace, Archive, Trash2, 
  FileText, Building2, Anchor, FileSpreadsheet, 
  Clock, User, History, Tags, Eye
} from "lucide-react";
import { DocumentStatus } from "@/lib/types/document";
import { useToast } from "@/components/ui/use-toast";

const getStatusColor = (status: DocumentStatus) => {
  switch (status) {
    case 'Uploaded': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Pending Review': return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'Approved': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
    case 'Archived': return 'bg-gray-200 text-gray-800 border-gray-200';
    case 'Expired': return 'bg-orange-100 text-orange-800 border-orange-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getFileIconColor = (fileType: string) => {
  switch (fileType) {
    case 'PDF': return 'text-red-500 bg-red-50 border-red-200';
    case 'XLSX': return 'text-green-600 bg-green-50 border-green-200';
    case 'DOCX': return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'JPG':
    case 'JPEG':
    case 'PNG': return 'text-purple-500 bg-purple-50 border-purple-200';
    default: return 'text-gray-500 bg-gray-50 border-gray-200';
  }
};

export default function DocumentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { toast } = useToast();
  const resolvedParams = use(params);
  const document = getMockDocumentById(resolvedParams.id);

  if (!document) {
    notFound();
  }

  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto w-full h-[calc(100vh-8rem)]">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/documents" className={buttonVariants({ variant: "outline", size: "icon" })}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight truncate max-w-[400px]" title={document.name}>
                {document.name}
              </h1>
              <Badge className={getStatusColor(document.status)} variant="outline">
                {document.status}
              </Badge>
              <Badge variant="secondary" className="font-mono">v{document.currentVersion}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-4">
              <span className="flex items-center gap-1"><FileText className="h-3 w-3"/> {document.type}</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3"/> Uploaded {new Date(document.uploadedAt).toLocaleString()}</span>
              <span className="flex items-center gap-1"><User className="h-3 w-3"/> By {document.uploadedBy}</span>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="default" size="sm" onClick={() => toast({ title: "Download", description: "Downloading document..." })}>
            <Download className="mr-2 h-4 w-4" /> Download
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast({ title: "Replace", description: "Replace feature coming soon." })}>
            <Replace className="mr-2 h-4 w-4" /> Replace
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast({ title: "Archive", description: "Archive feature coming soon." })}>
            <Archive className="mr-2 h-4 w-4" /> Archive
          </Button>
          <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => toast({ title: "Delete", description: "Delete feature coming soon." })}>
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        
        {/* Left Column: Preview Area */}
        <div className="lg:col-span-2 flex flex-col min-h-0 border rounded-xl overflow-hidden bg-muted/20 shadow-sm relative">
          <div className="p-3 border-b bg-muted/40 flex justify-between items-center shrink-0">
            <span className="text-sm font-medium flex items-center gap-2">
               <Eye className="h-4 w-4" /> Document Preview
            </span>
            <span className="text-xs text-muted-foreground">{formatBytes(document.fileSize)} • {document.fileType}</span>
          </div>
          
          <div className="flex-1 overflow-auto p-8 flex items-center justify-center">
             {/* Mock Preview Content */}
             <div className="w-full max-w-2xl bg-background border shadow-lg aspect-[1/1.4] rounded p-12 flex flex-col items-center justify-center text-center opacity-80">
                <div className={`h-24 w-24 rounded-2xl border-4 flex items-center justify-center font-bold text-3xl mb-6 ${getFileIconColor(document.fileType)}`}>
                  {document.fileType}
                </div>
                <h3 className="text-xl font-bold mb-2 break-all">{document.name}</h3>
                <p className="text-muted-foreground mb-8 max-w-md">
                  Preview is limited for mock data. In production, this area will render the PDF, Image, or Office document directly in the browser.
                </p>
                <Button onClick={() => toast({ title: "Download", description: "Downloading document..." })}>
                  <Download className="mr-2 h-4 w-4" /> Download to View
                </Button>
             </div>
          </div>
        </div>

        {/* Right Column: Metadata & History */}
        <div className="flex flex-col min-h-0">
          <Card className="flex-1 flex flex-col min-h-0 shadow-sm border-muted">
            <Tabs defaultValue="details" className="flex flex-col flex-1 min-h-0">
              <div className="px-6 pt-4 shrink-0">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="versions">Versions</TabsTrigger>
                  <TabsTrigger value="audit">Audit Log</TabsTrigger>
                </TabsList>
              </div>

              {/* Details Tab */}
              <TabsContent value="details" className="flex-1 overflow-auto m-0">
                <ScrollArea className="h-full px-6 py-4">
                  <div className="space-y-6">
                    {document.description && (
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Description</h4>
                        <p className="text-sm">{document.description}</p>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Associations</h4>
                      <div className="space-y-3">
                        {document.clientId && (
                          <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/20">
                            <Building2 className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">Client</p>
                              <Link href={`/clients/${document.clientId}`} className="text-sm font-medium hover:underline text-primary">{document.clientName || document.clientId}</Link>
                            </div>
                          </div>
                        )}
                        {document.shipmentId && (
                          <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/20">
                            <Anchor className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">Shipment</p>
                              <Link href={`/shipments/${document.shipmentId}`} className="text-sm font-medium hover:underline text-primary">{document.shipmentId}</Link>
                            </div>
                          </div>
                        )}
                        {document.boeId && (
                          <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/20">
                            <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">Bill of Entry</p>
                              <Link href={`/boe/${document.boeId}`} className="text-sm font-medium hover:underline text-primary">{document.boeId}</Link>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {document.tags && document.tags.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                           <Tags className="h-4 w-4" /> Tags
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {document.tags.map(tag => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* Versions Tab */}
              <TabsContent value="versions" className="flex-1 overflow-auto m-0">
                <ScrollArea className="h-full px-6 py-4">
                  <div className="space-y-4">
                    {document.versions.map((version, index) => (
                      <div key={version.id} className="relative pl-6 pb-6 border-l last:border-0 last:pb-0">
                        <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-primary ring-4 ring-background"></div>
                        <div className="flex flex-col gap-1 -mt-1.5">
                          <div className="flex justify-between items-start">
                            <span className="font-semibold text-sm">Version {version.versionNumber} {index === document.versions.length - 1 && "(Current)"}</span>
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">Restore</Button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Uploaded by {version.uploadedBy} on {new Date(version.uploadedAt).toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Size: {formatBytes(version.fileSize)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* Audit Trail Tab */}
              <TabsContent value="audit" className="flex-1 overflow-auto m-0">
                <ScrollArea className="h-full px-6 py-4">
                  <div className="space-y-4">
                    {document.auditTrail.map((audit) => (
                      <div key={audit.id} className="flex gap-3 text-sm">
                        <div className="mt-0.5">
                          <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                            <History className="h-3 w-3 text-muted-foreground" />
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">{audit.action}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {new Date(audit.date).toLocaleString()} • By {audit.user}
                          </p>
                          {audit.details && (
                            <p className="text-xs mt-1 bg-muted/50 p-2 rounded border">{audit.details}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}
