"use client"

import { use, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Download, Check, X, Archive, Pencil, FileText, Clock, User, Calendar } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/erp/status-badge"
import { mockDocuments, DocumentStatus, DocumentActivity } from "@/lib/mock-data/documents"
import { useToast } from "@/components/ui/use-toast"

export default function DocumentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const documentId = resolvedParams.id
  
  // Find document or fallback to first for mock display
  const document = mockDocuments.find(d => d.id === documentId) || mockDocuments[0]

  const { toast } = useToast()
  const [status, setStatus] = useState<DocumentStatus>(document.status)
  const [activities, setActivities] = useState<DocumentActivity[]>(document.activities)
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  const handleStatusChange = (newStatus: DocumentStatus) => {
    setIsUpdating(newStatus)
    
    // Simulate brief animation / loading state
    setTimeout(() => {
      // Mutate in-memory mock data so other pages reflect the change
      document.status = newStatus
      
      const newActivity = {
        id: Math.random().toString(36).substring(2, 9),
        action: newStatus === "Approved" ? "Approved" : newStatus === "Rejected" ? "Rejected" : "Archived",
        actor: "Jane Smith", // Mock logged-in employee name
        date: new Date().toISOString().split('T')[0]
      }
      
      document.activities = [newActivity, ...document.activities]
      
      // Update local states
      setStatus(newStatus)
      setActivities(document.activities)
      setIsUpdating(null)

      toast({
        title: `Document ${newStatus}`,
        description: `The document status has been updated to "${newStatus}" and logged.`,
        variant: newStatus === "Rejected" ? "destructive" : "default"
      })
    }, 400)
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Link 
          href="/documents" 
          className={buttonVariants({ variant: "outline", size: "icon" })}
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{document.name}</h1>
          <p className="text-muted-foreground mt-2 flex items-center gap-2">
            <span>{document.id}</span>
            <span>•</span>
            <StatusBadge status={status} />
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" title="Edit Metadata">
            <Pencil className="mr-2 h-4 w-4" /> Edit
          </Button>
          <Button variant="default">
            <Download className="mr-2 h-4 w-4" /> Download
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Preview */}
        <div className="md:col-span-2 space-y-6">
          <Card className="h-full min-h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle>Document Preview</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center bg-muted/20 border-y">
              <div className="flex flex-col items-center justify-center text-center p-8">
                <FileText className="h-24 w-24 text-muted-foreground/50 mb-6" />
                <h3 className="text-xl font-semibold mb-2">Preview not available</h3>
                <p className="text-muted-foreground max-w-sm">
                  This is a placeholder for the PDF/Image viewer. In production, this area will render the document content using a secure viewer.
                </p>
                <Button variant="outline" className="mt-8">
                  <Download className="mr-2 h-4 w-4" /> Download to View
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Metadata and Logs */}
        <div className="space-y-6">
          
          <Card>
            <CardHeader>
              <CardTitle>Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <span className="text-muted-foreground">Document Type:</span>
                <span className="font-medium">{document.type}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-muted-foreground">Category:</span>
                <span className="font-medium">{document.category}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-muted-foreground">Client:</span>
                <span className="font-medium">{document.clientName}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-muted-foreground">Shipment ID:</span>
                <span className="font-medium">{document.shipmentId}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-muted-foreground">File Size:</span>
                <span className="font-medium">{document.fileSize}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-muted-foreground">Version:</span>
                <span className="font-medium">{document.version}</span>
              </div>
              
              <div className="pt-4 mt-4 border-t">
                <p className="text-muted-foreground mb-2">Description</p>
                <p>{document.description}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Workflow Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button 
                variant="default" 
                disabled={status === "Approved" || isUpdating !== null}
                onClick={() => handleStatusChange("Approved")}
                className="w-full justify-start bg-success text-success-foreground hover:bg-success/90 transition-all duration-200 disabled:opacity-50"
              >
                <Check className={`mr-2 h-4 w-4 ${isUpdating === "Approved" ? "animate-ping" : ""}`} />
                {isUpdating === "Approved" ? "Approving..." : "Approve Document"}
              </Button>
              <Button 
                variant="destructive" 
                disabled={status === "Rejected" || isUpdating !== null}
                onClick={() => handleStatusChange("Rejected")}
                className="w-full justify-start transition-all duration-200 disabled:opacity-50"
              >
                <X className={`mr-2 h-4 w-4 ${isUpdating === "Rejected" ? "animate-ping" : ""}`} />
                {isUpdating === "Rejected" ? "Rejecting..." : "Reject Document"}
              </Button>
              <Button 
                variant="secondary" 
                disabled={status === "Archived" || isUpdating !== null}
                onClick={() => handleStatusChange("Archived")}
                className="w-full justify-start transition-all duration-200 disabled:opacity-50"
              >
                <Archive className={`mr-2 h-4 w-4 ${isUpdating === "Archived" ? "animate-ping" : ""}`} />
                {isUpdating === "Archived" ? "Archiving..." : "Archive Document"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {activities.map((activity, idx) => (
                  <div key={activity.id} className="relative pl-6">
                    {/* Timeline line */}
                    {idx !== activities.length - 1 && (
                      <div className="absolute left-[9px] top-6 bottom-[-24px] w-px bg-border" />
                    )}
                    
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-1 h-5 w-5 rounded-full border-2 border-primary bg-background" />
                    
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" /> {activity.actor}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {activity.date}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
