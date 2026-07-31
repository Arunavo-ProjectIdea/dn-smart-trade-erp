"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { createDocument } from "@/actions/document.actions";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faFile, faXmark, faCircleCheck, faSpinner, faFileLines, faFileExcel, faBuilding, faBox, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { DocumentType } from "@/lib/types/document";
import { formatClientId } from "@/lib/utils";

interface DocumentUploadFormProps {
  clients?: { id: string, company_name: string }[];
  shipments?: { id: string, destination_country?: string | null, container_number?: string | null, departure_date?: string | null }[];
  billsOfEntry?: { id: string, boe_number: string }[];
}

interface FileWithProgress extends File {
  progress?: number;
  status?: 'pending' | 'uploading' | 'completed' | 'error';
}

const DOCUMENT_TYPES: DocumentType[] = [
  'Commercial Invoice', 'Packing List', 'Bill of Lading', 'Certificate of Origin',
  'Insurance Certificate', 'Import Permit', 'Export Permit', 'LC Documents',
  'BOE Documents', 'Customs Documents', 'Other'
];

export function DocumentUploadForm({ clients = [], shipments = [], billsOfEntry = [] }: DocumentUploadFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // Metadata state (applies to all files in bulk upload)
  const [metadata, setMetadata] = useState({
    type: 'Commercial Invoice' as DocumentType,
    clientId: '',
    shipmentId: '',
    boeId: '',
    description: '',
    tags: ''
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (newFiles: File[]) => {
    const validTypes = [
      'application/pdf', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
      'image/png', 
      'image/jpeg', 
      'image/jpg'
    ];
    
    const validFiles = newFiles.filter(file => validTypes.includes(file.type)).map(file => {
      const f = file as FileWithProgress;
      f.progress = 0;
      f.status = 'pending';
      return f;
    });

    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    // UI Validation for doc_association_check
    if (!metadata.clientId && !metadata.shipmentId && !metadata.boeId) {
      toast({
        title: "Missing Association",
        description: "You must select at least a Client, a Shipment, or a Bill of Entry to upload a document.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    let hasError = false;
    
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // For each file, generate UUID, upload to Storage, and then insert DB row
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setFiles(prev => {
        const newFiles = [...prev];
        if (newFiles[i]) {
          newFiles[i].status = 'uploading';
          // Using exactly 50 logic was part of mock; we remove the progress entirely 
          // or just keep it 0 in UI, but the UI expects a status string. We will just set it to 100 once done.
        }
        return newFiles;
      });

      let filePath = "";
      const documentId = crypto.randomUUID(); // Pre-generate Document UUID

      if (user) {
        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        filePath = `documents/${user.id}/${documentId}/${timestamp}-${safeName}`;
        
        const { error: storageError } = await supabase.storage
          .from("documents")
          .upload(filePath, file);
          
        if (storageError) {
          console.error("Storage upload error:", storageError);
          setFiles(prev => {
            const newFiles = [...prev];
            if (newFiles[i]) newFiles[i].status = 'error';
            return newFiles;
          });
          hasError = true;
          toast({
            title: "Upload Failed",
            description: storageError.message,
            variant: "destructive"
          });
          continue; // Skip DB insert if storage upload fails
        }
      }

      const tagsArray = metadata.tags ? metadata.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

      const res = await createDocument({
        id: documentId,
        name: file.name,
        category: "Shipment Documents", // Assuming default category if not provided
        client_id: metadata.clientId || undefined,
        shipment_id: metadata.shipmentId || undefined,
        boe_id: metadata.boeId || undefined,
        description: metadata.description || undefined,
        tags: tagsArray,
        type: metadata.type,
        current_file_url: filePath,
        file_type: file.type,
        file_size: file.size
      });

      setFiles(prev => {
        const newFiles = [...prev];
        if (newFiles[i]) {
          if (res.success) {
            newFiles[i].status = 'completed';
          } else {
            newFiles[i].status = 'error';
            hasError = true;
          }
        }
        return newFiles;
      });

      if (!res.success) {
        toast({
          title: "Upload Failed",
          description: res.error || "An error occurred during upload.",
          variant: "destructive"
        });
      }
    }

    setIsUploading(false);
    
    // Only navigate if all succeeded
    if (!hasError) {
      setTimeout(() => {
        router.push('/documents');
      }, 1000);
    }
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    if (ext === 'pdf') return <FontAwesomeIcon icon={faFileLines} className="h-5 w-5 text-red-500" />;
    if (['xlsx', 'xls', 'csv'].includes(ext)) return <FontAwesomeIcon icon={faFileExcel} className="h-5 w-5 text-emerald-500" />;
    if (['docx', 'doc'].includes(ext)) return <FontAwesomeIcon icon={faCircle} className="h-5 w-5 text-blue-500" />;
    if (['jpg', 'jpeg', 'png'].includes(ext)) return <FontAwesomeIcon icon={faCircle} className="h-5 w-5 text-purple-500" />;
    return <FontAwesomeIcon icon={faFile} className="h-5 w-5 text-muted-foreground" />;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Upload Zone */}
      <Card className="lg:col-span-2 flex flex-col h-full rounded-2xl shadow-xs border">
        <CardHeader className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold tracking-tight">Upload Files</CardTitle>
              <CardDescription className="mt-1">Drag and drop document files, or browse from your computer.</CardDescription>
            </div>
            {files.length > 0 && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                {files.length} file{files.length > 1 ? 's' : ''} ready
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-6 flex flex-col gap-6">
          {/* Dropzone */}
          <div 
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[260px] relative overflow-hidden ${
              isDragging 
                ? "border-primary bg-primary/10 scale-[1.01]" 
                : "border-muted-foreground/25 hover:border-primary/50 bg-muted/10 hover:bg-muted/20"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <input 
              id="file-upload" 
              type="file" 
              multiple 
              className="hidden" 
              accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg"
              onChange={handleFileInput}
            />

            <div className={`h-16 w-16 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 ${
              isDragging ? "bg-primary text-primary-foreground scale-110" : "bg-primary/10 text-primary"
            }`}>
              <FontAwesomeIcon icon={faCircle} className="h-8 w-8" />
            </div>

            <h3 className="text-lg font-semibold mb-1">
              {isDragging ? "Drop files here to upload" : "Select or Drop Documents Here"}
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              Supports single or batch upload for PDF, DOCX, XLSX, PNG, and JPG (max 50MB per file).
            </p>

            <div className="flex items-center gap-3">
              <Button 
                type="button" 
                variant="secondary" 
                size="sm" 
                className="rounded-xl px-5 shadow-xs"
                onClick={(e) => { e.stopPropagation(); document.getElementById('file-upload')?.click(); }}
              >
                Browse Files
              </Button>
            </div>

            {/* Type badge indicators */}
            <div className="flex items-center gap-2 mt-6">
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-red-500/10 text-red-600 font-medium">
                <FontAwesomeIcon icon={faFileLines} className="h-3 w-3" /> PDF
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 font-medium">
                <FontAwesomeIcon icon={faFileExcel} className="h-3 w-3" /> Excel
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 font-medium">
                <FontAwesomeIcon icon={faCircle} className="h-3 w-3" /> Word
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 font-medium">
                <FontAwesomeIcon icon={faCircle} className="h-3 w-3" /> Images
              </span>
            </div>
          </div>

          {/* Selected Files Queue */}
          {files.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                  Selected Files ({files.length})
                </h4>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-auto p-0 text-xs text-muted-foreground hover:text-destructive"
                  onClick={() => setFiles([])}
                  disabled={isUploading}
                >
                  Remove all
                </Button>
              </div>

              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {files.map((file, idx) => (
                  <div key={idx} className="flex flex-col gap-2 p-3.5 border rounded-xl bg-card shadow-2xs transition-all hover:border-primary/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2.5 rounded-lg bg-muted/50 border shrink-0">
                          {getFileIcon(file.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate max-w-[240px] sm:max-w-md">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                        </div>
                      </div>
                      
                      {file.status === 'completed' ? (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full">
                          <FontAwesomeIcon icon={faCircleCheck} className="h-4 w-4" /> Ready
                        </div>
                      ) : file.status === 'uploading' ? (
                        <span className="text-xs font-mono font-semibold text-primary">{Math.round(file.progress || 0)}%</span>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-destructive rounded-lg" 
                          onClick={() => removeFile(idx)} 
                          disabled={isUploading}
                        >
                          <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    {file.status === 'uploading' && (
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      Uploading...
                    </div>
                  )}
                  {file.status === 'completed' && (
                    <div className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                      <FontAwesomeIcon icon={faCheckCircle} className="h-3 w-3" /> Complete
                    </div>
                  )}
                  {file.status === 'error' && (
                    <div className="text-xs text-red-600 dark:text-red-400 font-medium">Failed to upload</div>
                  )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="border-t bg-muted/10 p-6 flex items-center justify-between rounded-b-2xl">
          <Button 
            variant="ghost" 
            onClick={() => setFiles([])} 
            disabled={files.length === 0 || isUploading}
            className="rounded-xl"
          >
            Clear Queue
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={files.length === 0 || isUploading} 
            className="rounded-xl px-6 min-w-[160px] shadow-sm"
          >
            {isUploading ? (
              <><FontAwesomeIcon icon={faSpinner} className="mr-2 h-4 w-4 animate-spin fa-spin" /> Uploading...</>
            ) : (
              <><FontAwesomeIcon icon={faCircle} className="mr-2 h-4 w-4" /> Upload {files.length > 0 ? `(${files.length})` : ''}</>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Metadata Form Sidebar */}
      <Card className="h-full flex flex-col rounded-2xl shadow-xs border">
        <CardHeader className="p-6 border-b">
          <CardTitle className="text-xl font-bold tracking-tight">Document Metadata</CardTitle>
          <CardDescription className="mt-1">Assign classification, client, and shipment details.</CardDescription>
        </CardHeader>

        <CardContent className="p-6 flex-1 space-y-5">
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5 font-medium">
              <FontAwesomeIcon icon={faFileLines} className="h-3.5 w-3.5 text-primary" /> Document Type
            </Label>
            <Select 
              value={metadata.type} 
              onValueChange={(val) => setMetadata({...metadata, type: val as DocumentType})} 
              disabled={isUploading}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                {DOCUMENT_TYPES.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5 font-medium">
              <FontAwesomeIcon icon={faBuilding} className="h-3.5 w-3.5 text-primary" /> Associated Client (Optional)
            </Label>
            <Select 
              value={metadata.clientId} 
              onValueChange={(val) => setMetadata({...metadata, clientId: val || ''})} 
              disabled={isUploading}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select associated client">
                  {metadata.clientId && clients.find(c => c.id === metadata.clientId) 
                    ? (clients.find(c => c.id === metadata.clientId)?.company_name 
                        ? `${clients.find(c => c.id === metadata.clientId)?.company_name} (${formatClientId(metadata.clientId)})` 
                        : `Client ${formatClientId(metadata.clientId)}`) 
                    : undefined}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {clients.length === 0 && <SelectItem value="none" disabled>No clients found</SelectItem>}
                {clients.map(c => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.company_name ? `${c.company_name} (${formatClientId(c.id)})` : `Client ${formatClientId(c.id)}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5 font-medium">
              <FontAwesomeIcon icon={faBox} className="h-3.5 w-3.5 text-primary" /> Associated Shipment (Optional)
            </Label>
            <Select 
              value={metadata.shipmentId} 
              onValueChange={(val) => setMetadata({...metadata, shipmentId: val || ''})} 
              disabled={isUploading}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select shipment ID">
                  {metadata.shipmentId && shipments.find(s => s.id === metadata.shipmentId)
                    ? (
                        shipments.find(s => s.id === metadata.shipmentId)?.container_number 
                          ? `Container: ${shipments.find(s => s.id === metadata.shipmentId)?.container_number}` 
                          : (shipments.find(s => s.id === metadata.shipmentId)?.destination_country 
                              ? `To ${shipments.find(s => s.id === metadata.shipmentId)?.destination_country}` 
                              : `Shipment ${metadata.shipmentId.slice(0, 8)}`)
                      )
                    : undefined}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {shipments.length === 0 && <SelectItem value="none" disabled>No shipments found</SelectItem>}
                {shipments.map(s => {
                  const label = s.container_number ? `Container: ${s.container_number}` : (s.destination_country ? `To ${s.destination_country}` : `Shipment ${s.id.slice(0, 8)}`);
                  return <SelectItem key={s.id} value={s.id}>{label}</SelectItem>
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5 font-medium">
              <FontAwesomeIcon icon={faCircle} className="h-3.5 w-3.5 text-primary" /> Bill of Entry ID (Optional)
            </Label>
            <Select 
              value={metadata.boeId} 
              onValueChange={(val) => setMetadata({...metadata, boeId: val || ''})} 
              disabled={isUploading}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select BOE">
                  {metadata.boeId && billsOfEntry.find(b => b.id === metadata.boeId)
                    ? (billsOfEntry.find(b => b.id === metadata.boeId)?.boe_number ? `BOE: ${billsOfEntry.find(b => b.id === metadata.boeId)?.boe_number}` : `BOE ID: ${metadata.boeId.slice(0,8)}`)
                    : undefined}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {billsOfEntry.length === 0 && <SelectItem value="none" disabled>No bills of entry found</SelectItem>}
                {billsOfEntry.map(b => (
                  <SelectItem key={b.id} value={b.id}>{b.boe_number ? `BOE: ${b.boe_number}` : `BOE ID: ${b.id.slice(0,8)}`}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5 font-medium">
              <FontAwesomeIcon icon={faCircle} className="h-3.5 w-3.5 text-primary" /> Tags
            </Label>
            <Input 
              placeholder="e.g. Invoice, Urgent, Machinery" 
              value={metadata.tags} 
              onChange={(e) => setMetadata({...metadata, tags: e.target.value})} 
              disabled={isUploading}
              className="rounded-xl"
            />
            <p className="text-[11px] text-muted-foreground">Separate tags with commas</p>
          </div>

          <div className="space-y-2">
            <Label className="font-medium">Description / Notes</Label>
            <Textarea 
              placeholder="Add optional notes or descriptions for these documents..." 
              className="resize-none h-24 rounded-xl"
              value={metadata.description} 
              onChange={(e) => setMetadata({...metadata, description: e.target.value})}
              disabled={isUploading}
            />
          </div>
          
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-300 p-3.5 rounded-xl flex gap-2.5 items-start mt-4 text-xs">
            <FontAwesomeIcon icon={faInfoCircle} className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
            <p>Metadata entered here will be linked to all files uploaded in this batch.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
