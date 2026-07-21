"use client"

import { use, useState } from "react"
import Link from "next/link"
import { 
  ArrowLeft, 
  Download, 
  Check, 
  X, 
  Archive, 
  Pencil, 
  FileText, 
  Calendar, 
  User, 
  Building2, 
  Package, 
  Tag, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Maximize2, 
  Minimize2, 
  History, 
  Clock, 
  HardDrive, 
  ChevronRight,
  Sparkles,
  ShieldCheck,
  FileCheck,
  Share2
} from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { StatusBadge } from "@/components/erp/status-badge"
import { mockDocuments, DocumentStatus, DocumentActivity, DocumentVersion } from "@/lib/mock-data/documents"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DocumentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const documentId = resolvedParams.id
  
  // Find document or fallback to first for mock display
  const documentItem = mockDocuments.find(d => d.id === documentId) || mockDocuments[0]

  const { toast } = useToast()
  const [status, setStatus] = useState<DocumentStatus>(documentItem.status)
  const [activities, setActivities] = useState<DocumentActivity[]>(documentItem.activities)
  const [versions, setVersions] = useState<DocumentVersion[]>(documentItem.versions || [])
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  // Preview interactive controls state
  const [zoomLevel, setZoomLevel] = useState<number>(100)
  const [rotation, setRotation] = useState<number>(0)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const totalPages = 3

  const handleStatusChange = (newStatus: DocumentStatus) => {
    setIsUpdating(newStatus)
    
    setTimeout(() => {
      documentItem.status = newStatus
      
      const newActivity = {
        id: Math.random().toString(36).substring(2, 9),
        action: newStatus === "Approved" ? "Approved Document" : newStatus === "Rejected" ? "Rejected Document" : "Archived Document",
        actor: "Jane Smith", // Mock logged-in user
        date: new Date().toISOString().split('T')[0]
      }
      
      const updatedActivities = [newActivity, ...activities]
      documentItem.activities = updatedActivities
      
      setStatus(newStatus)
      setActivities(updatedActivities)
      setIsUpdating(null)

      toast({
        title: `Document ${newStatus}`,
        description: `Status updated to "${newStatus}" and logged to audit history.`,
        variant: newStatus === "Rejected" ? "destructive" : "default"
      })
    }, 400)
  }

  const handleDownload = (versionNum?: string) => {
    toast({
      title: "Download Started",
      description: `Downloading ${documentItem.name} ${versionNum ? `(${versionNum})` : ''}...`,
    })
  }

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 25, 200))
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 25, 50))
  const handleRotate = () => setRotation(prev => (prev + 90) % 360)
  const toggleFullscreen = () => setIsFullscreen(prev => !prev)

  return (
    <div className="flex flex-col gap-8 pb-10 animate-in fade-in duration-500">
      {/* Breadcrumb Header */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Link href="/documents" className="hover:text-foreground hover:underline transition-colors">
          Documents
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">{documentItem.id}</span>
      </div>

      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div className="flex items-start gap-4">
          <Link 
            href="/documents" 
            className={buttonVariants({ variant: "outline", size: "icon" })}
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-bold tracking-tight">{documentItem.name}</h1>
              <Badge variant="outline" className="font-mono text-xs font-semibold bg-muted/30">
                {documentItem.version || "v1.0"}
              </Badge>
              <StatusBadge status={status} />
            </div>
            <p className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
              <span className="font-mono">{documentItem.id}</span>
              <span>•</span>
              <span>Uploaded on {documentItem.uploadDate}</span>
              <span>•</span>
              <span>By {documentItem.uploadedBy}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" onClick={() => alert("Edit metadata mode mock")}>
            <Pencil className="mr-2 h-4 w-4" /> Edit Metadata
          </Button>
          <Button variant="default" onClick={() => handleDownload()}>
            <Download className="mr-2 h-4 w-4" /> Download File
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Interactive Preview Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className={`flex flex-col overflow-hidden transition-all duration-300 rounded-2xl shadow-xs border ${
            isFullscreen ? "fixed inset-4 z-50 h-[calc(100vh-2rem)] w-[calc(100vw-2rem)]" : "min-h-[680px]"
          }`}>
            {/* Preview Toolbar */}
            <CardHeader className="p-4 bg-muted/40 border-b flex flex-row items-center justify-between gap-2 space-y-0">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle className="text-base font-semibold">Document Preview</CardTitle>
                <span className="text-xs text-muted-foreground font-mono hidden sm:inline">
                  ({documentItem.type})
                </span>
              </div>

              {/* View Controls */}
              <div className="flex items-center gap-1 bg-background border rounded-xl p-1 shadow-xs">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 rounded-lg" 
                  onClick={handleZoomOut}
                  title="Zoom Out"
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </Button>
                <span className="text-xs font-mono px-2 text-muted-foreground min-w-[42px] text-center">
                  {zoomLevel}%
                </span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 rounded-lg" 
                  onClick={handleZoomIn}
                  title="Zoom In"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </Button>
                <div className="h-4 w-px bg-border my-auto mx-1" />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 rounded-lg" 
                  onClick={handleRotate}
                  title="Rotate 90°"
                >
                  <RotateCw className="h-3.5 w-3.5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 rounded-lg" 
                  onClick={toggleFullscreen}
                  title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                >
                  {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                </Button>
              </div>
            </CardHeader>

            {/* Rendered Preview Canvas Area */}
            <CardContent className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-900/5 dark:bg-slate-950/40 overflow-auto relative min-h-[500px]">
              
              <div 
                className="bg-card text-card-foreground border rounded-xl shadow-2xl p-8 max-w-xl w-full min-h-[520px] transition-transform duration-300 flex flex-col justify-between relative overflow-hidden"
                style={{
                  transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
                  transformOrigin: "center center"
                }}
              >
                {/* Watermark/Stamp overlay */}
                <div className="absolute right-6 top-6 opacity-15 pointer-events-none select-none">
                  <div className={`text-4xl font-black uppercase border-4 rounded-xl px-4 py-2 rotate-[-15deg] ${
                    status === "Approved" ? "border-emerald-600 text-emerald-600" :
                    status === "Rejected" ? "border-red-600 text-red-600" :
                    "border-amber-600 text-amber-600"
                  }`}>
                    {status}
                  </div>
                </div>

                {/* Simulated Document Header */}
                <div className="space-y-4 border-b pb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        DN
                      </div>
                      <div>
                        <h2 className="font-bold text-sm tracking-tight">DN SMART TRADE ERP</h2>
                        <p className="text-[10px] text-muted-foreground">Official Trade Document Repository</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">{documentItem.id}</span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-foreground">{documentItem.name}</h3>
                    <p className="text-xs text-muted-foreground">Category: {documentItem.category}</p>
                  </div>
                </div>

                {/* Simulated Document Body Preview */}
                <div className="my-6 space-y-4 text-xs text-muted-foreground">
                  <div className="grid grid-cols-2 gap-4 p-3 bg-muted/30 rounded-lg">
                    <div>
                      <span className="text-[10px] font-semibold text-foreground uppercase tracking-wider block mb-1">Client</span>
                      <p className="font-medium text-foreground">{documentItem.clientName}</p>
                      <p className="text-[11px] text-muted-foreground">{documentItem.clientId}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-foreground uppercase tracking-wider block mb-1">Shipment Reference</span>
                      <p className="font-mono font-medium text-foreground">{documentItem.shipmentId}</p>
                      <p className="text-[11px] text-muted-foreground">Status: {documentItem.status}</p>
                    </div>
                  </div>

                  {/* Mock content table */}
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-muted/50 p-2 font-semibold text-[11px] grid grid-cols-3 border-b">
                      <span>Field</span>
                      <span>Specification</span>
                      <span className="text-right">Value</span>
                    </div>
                    <div className="divide-y text-[11px]">
                      <div className="p-2 grid grid-cols-3">
                        <span>Document Type</span>
                        <span>{documentItem.type}</span>
                        <span className="text-right font-mono">VERIFIED</span>
                      </div>
                      <div className="p-2 grid grid-cols-3">
                        <span>File Size</span>
                        <span>{documentItem.fileSize}</span>
                        <span className="text-right font-mono">OK</span>
                      </div>
                      <div className="p-2 grid grid-cols-3">
                        <span>Security Hash</span>
                        <span className="truncate">sha256-e3b0c442...</span>
                        <span className="text-right text-emerald-600 font-bold">PASSED</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] leading-relaxed italic text-muted-foreground/80">
                    "{documentItem.description}"
                  </p>
                </div>

                {/* Simulated Document Footer */}
                <div className="pt-4 border-t flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>Authorized Signature: <strong className="text-foreground">{documentItem.uploadedBy}</strong></span>
                  <span>Page {currentPage} of {totalPages}</span>
                </div>
              </div>
            </CardContent>

            {/* Bottom Preview Control bar */}
            <div className="p-3 bg-muted/20 border-t flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-500" /> Secure Viewer (Read-only Preview)
              </span>
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground font-mono">
                  Page {currentPage} / {totalPages}
                </span>
                <Button size="sm" variant="outline" className="h-8 rounded-lg" onClick={() => handleDownload()}>
                  <Download className="mr-1.5 h-3.5 w-3.5" /> Download PDF
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Metadata, Workflow & History */}
        <div className="space-y-6">
          
          {/* Metadata Card */}
          <Card className="rounded-2xl shadow-xs border">
            <CardHeader className="p-5 border-b">
              <CardTitle className="text-lg font-bold">Document Information</CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4 text-sm">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" /> Document Type:
                  </span>
                  <Badge variant="outline" className="font-mono text-xs">
                    {documentItem.type}
                  </Badge>
                </div>

                <div className="flex items-center justify-between pb-2 border-b">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Tag className="h-4 w-4 text-primary" /> Category:
                  </span>
                  <span className="font-medium text-foreground">{documentItem.category}</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" /> Client:
                  </span>
                  <span className="font-medium text-foreground truncate max-w-[150px]">{documentItem.clientName}</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" /> Shipment ID:
                  </span>
                  <span className="font-mono font-medium text-primary">{documentItem.shipmentId}</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <HardDrive className="h-4 w-4 text-primary" /> File Size:
                  </span>
                  <span className="font-mono font-medium text-foreground">{documentItem.fileSize}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" /> Uploaded By:
                  </span>
                  <span className="font-medium text-foreground">{documentItem.uploadedBy}</span>
                </div>
              </div>

              {/* Tags */}
              {documentItem.tags && documentItem.tags.length > 0 && (
                <div className="pt-3 border-t space-y-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Tags</span>
                  <div className="flex flex-wrap gap-1.5">
                    {documentItem.tags.map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs py-0.5 px-2 rounded-md">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="pt-3 border-t space-y-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Description</span>
                <p className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-xl border leading-relaxed">
                  {documentItem.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Workflow Action Buttons Card */}
          <Card className="rounded-2xl shadow-xs border">
            <CardHeader className="p-5 border-b">
              <CardTitle className="text-lg font-bold">Workflow Review</CardTitle>
            </CardHeader>
            <CardContent className="p-5 flex flex-col gap-3">
              <Button 
                variant="default" 
                disabled={status === "Approved" || isUpdating !== null}
                onClick={() => handleStatusChange("Approved")}
                className="w-full justify-start rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-200 shadow-sm"
              >
                <Check className={`mr-2 h-4 w-4 ${isUpdating === "Approved" ? "animate-ping" : ""}`} />
                {isUpdating === "Approved" ? "Approving..." : "Approve Document"}
              </Button>

              <Button 
                variant="destructive" 
                disabled={status === "Rejected" || isUpdating !== null}
                onClick={() => handleStatusChange("Rejected")}
                className="w-full justify-start rounded-xl transition-all duration-200 shadow-sm"
              >
                <X className={`mr-2 h-4 w-4 ${isUpdating === "Rejected" ? "animate-ping" : ""}`} />
                {isUpdating === "Rejected" ? "Rejecting..." : "Reject Document"}
              </Button>

              <Button 
                variant="secondary" 
                disabled={status === "Archived" || isUpdating !== null}
                onClick={() => handleStatusChange("Archived")}
                className="w-full justify-start rounded-xl transition-all duration-200"
              >
                <Archive className={`mr-2 h-4 w-4 ${isUpdating === "Archived" ? "animate-ping" : ""}`} />
                {isUpdating === "Archived" ? "Archiving..." : "Archive Document"}
              </Button>
            </CardContent>
          </Card>

          {/* Tabs: Version History & Activity Audit Trail */}
          <Card className="rounded-2xl shadow-xs border">
            <Tabs defaultValue="versions" className="w-full">
              <CardHeader className="p-5 border-b pb-0">
                <TabsList className="grid w-full grid-cols-2 rounded-xl">
                  <TabsTrigger value="versions" className="rounded-lg text-xs font-semibold">
                    <History className="mr-1.5 h-3.5 w-3.5" /> Version History
                  </TabsTrigger>
                  <TabsTrigger value="activity" className="rounded-lg text-xs font-semibold">
                    <Clock className="mr-1.5 h-3.5 w-3.5" /> Activity Log
                  </TabsTrigger>
                </TabsList>
              </CardHeader>

              <CardContent className="p-5">
                
                {/* Version History Tab */}
                <TabsContent value="versions" className="m-0 space-y-4">
                  {versions && versions.length > 0 ? (
                    <div className="space-y-3">
                      {versions.map((ver, idx) => (
                        <div key={ver.id || idx} className="p-3 border rounded-xl bg-card flex items-center justify-between gap-3">
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-primary">{ver.versionNumber}</span>
                              {idx === 0 && (
                                <Badge variant="secondary" className="text-[10px] py-0 px-1.5 bg-emerald-500/10 text-emerald-600 font-semibold">
                                  Current
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {ver.uploadedAt} • {ver.uploadedBy}
                            </p>
                            {ver.changesNote && (
                              <p className="text-[11px] text-muted-foreground/80 italic">{ver.changesNote}</p>
                            )}
                          </div>

                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-primary rounded-lg shrink-0"
                            onClick={() => handleDownload(ver.versionNumber)}
                            title={`Download ${ver.versionNumber}`}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground text-center py-4">No previous versions available.</p>
                  )}
                </TabsContent>

                {/* Activity Log Tab */}
                <TabsContent value="activity" className="m-0 space-y-4">
                  <div className="space-y-5">
                    {activities.map((act, idx) => (
                      <div key={act.id || idx} className="relative pl-6">
                        {/* Timeline connecting line */}
                        {idx !== activities.length - 1 && (
                          <div className="absolute left-[9px] top-6 bottom-[-20px] w-px bg-border" />
                        )}
                        
                        {/* Timeline dot */}
                        <div className="absolute left-0 top-1 h-4 w-4 rounded-full border-2 border-primary bg-background" />
                        
                        <div className="flex flex-col gap-1">
                          <p className="text-xs font-semibold text-foreground">{act.action}</p>
                          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" /> {act.actor}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> {act.date}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

              </CardContent>
            </Tabs>
          </Card>

        </div>
      </div>
    </div>
  )
}
