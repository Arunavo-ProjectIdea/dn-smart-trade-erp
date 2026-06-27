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

export default function DocumentUploadPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
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
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock save, return to documents list
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
            <Input id="doc-name" placeholder="e.g. Commercial_Invoice_Q3.pdf" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Document Category</Label>
            <Select required>
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
            <Select required>
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
            <Select>
              <SelectTrigger id="client">
                <SelectValue placeholder="Select client..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CL-001">Acme Global</SelectItem>
                <SelectItem value="CL-002">TechCorp Logistics</SelectItem>
                <SelectItem value="CL-003">Global Freight</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="shipment">Associated Shipment</Label>
            <Select>
              <SelectTrigger id="shipment">
                <SelectValue placeholder="Select shipment ID..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TRK-98230">#TRK-98230</SelectItem>
                <SelectItem value="TRK-98231">#TRK-98231</SelectItem>
                <SelectItem value="TRK-98232">#TRK-98232</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="status">Initial Status</Label>
            <Select defaultValue="Pending Review">
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
            />
          </div>
        </div>
      </FormLayout>
    </div>
  )
}
