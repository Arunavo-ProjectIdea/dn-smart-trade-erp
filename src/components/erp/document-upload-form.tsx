"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud, File, X, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { DocumentType } from "@/lib/types/document";

interface FileWithProgress extends File {
  progress?: number;
  status?: 'pending' | 'uploading' | 'completed' | 'error';
}

const DOCUMENT_TYPES: DocumentType[] = [
  'Commercial Invoice', 'Packing List', 'Bill of Lading', 'Certificate of Origin',
  'Insurance Certificate', 'Import Permit', 'Export Permit', 'LC Documents',
  'BOE Documents', 'Customs Documents', 'Other'
];

export function DocumentUploadForm() {
  const router = useRouter();
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  // Metadata state (applies to all files in bulk upload for this mock)
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
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
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
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'image/png', 'image/jpeg', 'image/jpg'];
    
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

  const handleUpload = () => {
    if (files.length === 0) return;
    
    setIsUploading(true);

    // Mock upload progress
    const simulateUpload = (index: number) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setFiles(prev => {
            const newFiles = [...prev];
            if (newFiles[index]) {
              newFiles[index].progress = 100;
              newFiles[index].status = 'completed';
            }
            return newFiles;
          });
          
          // Check if all are complete
          setTimeout(() => {
            setFiles(currentFiles => {
              if (currentFiles.every(f => f.status === 'completed')) {
                setIsUploading(false);
                router.push('/documents');
              }
              return currentFiles;
            });
          }, 500);
        } else {
          setFiles(prev => {
            const newFiles = [...prev];
            if (newFiles[index]) {
              newFiles[index].progress = progress;
              newFiles[index].status = 'uploading';
            }
            return newFiles;
          });
        }
      }, 200);
    };

    files.forEach((_, idx) => simulateUpload(idx));
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Upload Zone */}
      <Card className="lg:col-span-2 flex flex-col h-full">
        <CardHeader>
          <CardTitle>Select Files</CardTitle>
          <CardDescription>Drag and drop files here, or click to browse.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4">
          <div 
            className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors rounded-xl flex flex-col items-center justify-center p-12 text-center cursor-pointer bg-muted/5 min-h-[250px]"
            onDragOver={handleDragOver}
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
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <UploadCloud className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-1">Upload Documents</h3>
            <p className="text-sm text-muted-foreground mb-4">Support for PDF, DOCX, XLSX, PNG, JPG</p>
            <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); document.getElementById('file-upload')?.click(); }}>
              Browse Files
            </Button>
          </div>

          {files.length > 0 && (
            <div className="space-y-3 mt-4">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Selected Files ({files.length})</h4>
              {files.map((file, idx) => (
                <div key={idx} className="flex flex-col gap-2 p-3 border rounded-lg bg-background">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="h-10 w-10 shrink-0 bg-primary/10 rounded flex items-center justify-center">
                        <File className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate max-w-[200px] sm:max-w-xs">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                      </div>
                    </div>
                    
                    {file.status === 'completed' ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    ) : file.status === 'uploading' ? (
                      <span className="text-xs font-medium text-primary">{Math.round(file.progress || 0)}%</span>
                    ) : (
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeFile(idx)} disabled={isUploading}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  {file.status === 'uploading' && (
                     <div className="w-full bg-muted rounded-full h-1.5 mt-1 overflow-hidden">
                        <div className="bg-primary h-1.5 rounded-full transition-all duration-200" style={{ width: `${file.progress}%` }}></div>
                     </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t bg-muted/10 py-4 flex justify-between">
          <Button variant="ghost" onClick={() => setFiles([])} disabled={files.length === 0 || isUploading}>
            Clear All
          </Button>
          <Button onClick={handleUpload} disabled={files.length === 0 || isUploading} className="min-w-[140px]">
            {isUploading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</>
            ) : (
              <><UploadCloud className="mr-2 h-4 w-4" /> Upload {files.length > 0 ? `(${files.length})` : ''}</>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Metadata Form */}
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>Metadata</CardTitle>
          <CardDescription>Apply tags and relations to uploaded files.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 space-y-4">
          <div className="space-y-2">
            <Label>Document Type</Label>
            <Select value={metadata.type} onValueChange={(val) => setMetadata({...metadata, type: val as DocumentType})} disabled={isUploading}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {DOCUMENT_TYPES.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Link to Client (Optional)</Label>
            <Select value={metadata.clientId} onValueChange={(val) => setMetadata({...metadata, clientId: val || ''})} disabled={isUploading}>
              <SelectTrigger>
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="client-1">Acme Corp</SelectItem>
                <SelectItem value="client-2">TechNova</SelectItem>
                <SelectItem value="client-3">Global Trade Co</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Link to Shipment (Optional)</Label>
            <Select value={metadata.shipmentId} onValueChange={(val) => setMetadata({...metadata, shipmentId: val || ''})} disabled={isUploading}>
              <SelectTrigger>
                <SelectValue placeholder="Select shipment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SHP-1001">SHP-1001</SelectItem>
                <SelectItem value="SHP-1002">SHP-1002</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Link to Bill of Entry (Optional)</Label>
            <Select value={metadata.boeId} onValueChange={(val) => setMetadata({...metadata, boeId: val || ''})} disabled={isUploading}>
              <SelectTrigger>
                <SelectValue placeholder="Select BOE" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BOE-2026-001">BOE-2026-001</SelectItem>
                <SelectItem value="BOE-2026-002">BOE-2026-002</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <Input placeholder="e.g. Invoice, Urgent, Machinery" value={metadata.tags} onChange={(e) => setMetadata({...metadata, tags: e.target.value})} disabled={isUploading} />
            <p className="text-[10px] text-muted-foreground">Comma separated values</p>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea 
              placeholder="Add an optional description..." 
              className="resize-none h-24"
              value={metadata.description} 
              onChange={(e) => setMetadata({...metadata, description: e.target.value})}
              disabled={isUploading}
            />
          </div>
          
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded flex gap-2 items-start mt-4">
             <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
             <p className="text-xs">Metadata entered here will be applied to all files in the current upload batch.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
