"use client"

import { useRouter } from "next/navigation"
import { UploadCloud, File, X } from "lucide-react"
import { useState, useRef } from "react"
import { FormLayout } from "@/components/erp/form-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { mockDocuments } from "@/lib/mock-data/documents"
import { mockClients } from "@/lib/mock-data/clients"

export default function DocumentUploadPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form states
  const [docName, setDocName] = useState("")
  const [category, setCategory] = useState("")
  const [fileType, setFileType] = useState("")
  const [clientId, setClientId] = useState("")
  const [shipmentId, setShipmentId] = useState("")
  const [status, setStatus] = useState("Pending Review")
  const [description, setDescription] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      // Auto-populate name and type if not set
      if (!docName) {
        setDocName(selectedFile.name)
      }
      if (!fileType) {
        const ext = selectedFile.name.split('.').pop()?.toLowerCase() || ""
        if (["pdf", "docx", "xlsx", "jpg", "jpeg", "png"].includes(ext)) {
          setFileType(ext === "jpeg" ? "jpg" : ext)
        }
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const selectedFile = e.dataTransfer.files[0]
      setFile(selectedFile)
      if (!docName) {
        setDocName(selectedFile.name)
      }
      const ext = selectedFile.name.split('.').pop()?.toLowerCase() || ""
      if (["pdf", "docx", "xlsx", "jpg", "jpeg", "png"].includes(ext)) {
        setFileType(ext === "jpeg" ? "jpg" : ext)
      }
    }
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    
    const selectedClient = mockClients.find(c => c.id === clientId)
    
    // Create new mock document
    const newDoc = {
      id: `DOC-${1001 + mockDocuments.length}`,
      name: docName || file?.name || "Untitled Document",
      type: fileType.toUpperCase() || "PDF",
      category: (category || "Shipment Documents") as any,
      clientId: clientId || "CL-1001",
      clientName: selectedClient ? selectedClient.companyName : "Global Logistics Inc.",
      shipmentId: shipmentId || "#TRK-98230",
      uploadedBy: "Jane Smith", // Mock logged-in employee name
      uploadDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
      fileSize: file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : "0.5 MB",
      status: status as any,
      description: description || "Manual upload of custom document.",
      version: "v1.0",
      activities: [
        {
          id: Math.random().toString(36).substring(2, 9),
          action: "Uploaded",
          actor: "Jane Smith",
          date: new Date().toISOString().split('T')[0]
        }
      ]
    }

    // Add to our in-memory list
    mockDocuments.unshift(newDoc)

    // Return to documents list
    router.push("/documents")
  }

  const handleCancel = () => {
    router.push("/documents")
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Upload Document</h1>
        <p className="text-muted-foreground mt-2">
          Add a new document to the secure repository.
        </p>
      </div>

      <FormLayout
        title="Document Details"
        description="Enter the metadata and upload the file."
        onSave={handleSave}
        onCancel={handleCancel}
        saveText="Upload Document"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          
          <div className="space-y-2 md:col-span-2">
            <Label>File Upload</Label>
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".pdf,.docx,.xlsx,.jpg,.jpeg,.png"
            />
            {!file ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                  isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:bg-muted/50"
                }`}
              >
                <UploadCloud className={`h-10 w-10 mb-4 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
                <p className="text-sm font-medium">Click to browse or drag and drop a file here</p>
                <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, XLSX, JPG, or PNG (max 50MB)</p>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-md">
                    <File className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setFile(null)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="doc-name">Document Name</Label>
            <Input 
              id="doc-name" 
              placeholder="e.g. Commercial_Invoice_Q3.pdf" 
              required 
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Document Category</Label>
            <Select required onValueChange={(val) => setCategory(val || "")} value={category}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Shipment Documents">Shipment Documents</SelectItem>
                <SelectItem value="BOE Documents">BOE Documents</SelectItem>
                <SelectItem value="Client Documents">Client Documents</SelectItem>
                <SelectItem value="Financial Documents">Financial Documents</SelectItem>
                <SelectItem value="Compliance Documents">Compliance Documents</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">File Type</Label>
            <Select required onValueChange={(val) => setFileType(val || "")} value={fileType}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select file type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="docx">Word (DOCX)</SelectItem>
                <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                <SelectItem value="jpg">Image (JPG/PNG)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="client">Associated Client</Label>
            <Select required onValueChange={(val) => setClientId(val || "")} value={clientId}>
              <SelectTrigger id="client">
                <SelectValue placeholder="Select client..." />
              </SelectTrigger>
              <SelectContent>
                {mockClients.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.companyName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="shipment">Associated Shipment</Label>
            <Select required onValueChange={(val) => setShipmentId(val || "")} value={shipmentId}>
              <SelectTrigger id="shipment">
                <SelectValue placeholder="Select shipment ID..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="#TRK-98230">#TRK-98230</SelectItem>
                <SelectItem value="#TRK-98231">#TRK-98231</SelectItem>
                <SelectItem value="#TRK-98232">#TRK-98232</SelectItem>
                <SelectItem value="#TRK-98233">#TRK-98233</SelectItem>
                <SelectItem value="#TRK-98234">#TRK-98234</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="status">Initial Status</Label>
            <Select defaultValue="Pending Review" onValueChange={(val) => setStatus(val || "")} value={status}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending Review">Pending Review</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Description or Notes</Label>
            <Textarea 
              id="description" 
              placeholder="Add any additional details or notes about this document..." 
              className="min-h-[100px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
      </FormLayout>
    </div>
  )
}
