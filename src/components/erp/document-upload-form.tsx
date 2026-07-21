"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  UploadCloud, 
  File, 
  X, 
  CheckCircle2, 
  Loader2, 
  FileText, 
  FileSpreadsheet, 
  FileCheck, 
  Image as ImageIcon,
  Building2,
  Package,
  FileCode,
  Tag,
  Info
} from "lucide-react";
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

  const handleUpload = () => {
    if (files.length === 0) return;
    
    setIsUploading(true);

    // Mock upload progress
    const simulateUpload = (index: number) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 25;
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
      }, 180);
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

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    if (ext === 'pdf') return <FileText className="h-5 w-5 text-red-500" />;
    if (['xlsx', 'xls', 'csv'].includes(ext)) return <FileSpreadsheet className="h-5 w-5 text-emerald-500" />;
    if (['docx', 'doc'].includes(ext)) return <FileCheck className="h-5 w-5 text-blue-500" />;
    if (['jpg', 'jpeg', 'png'].includes(ext)) return <ImageIcon className="h-5 w-5 text-purple-500" />;
    return <File className="h-5 w-5 text-muted-foreground" />;
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
              <UploadCloud className="h-8 w-8" />
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
                <FileText className="h-3 w-3" /> PDF
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 font-medium">
                <FileSpreadsheet className="h-3 w-3" /> Excel
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 font-medium">
                <FileCheck className="h-3 w-3" /> Word
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 font-medium">
                <ImageIcon className="h-3 w-3" /> Images
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
                          <CheckCircle2 className="h-4 w-4" /> Ready
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
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    {file.status === 'uploading' && (
                      <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-primary h-1.5 rounded-full transition-all duration-200" 
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
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
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</>
            ) : (
              <><UploadCloud className="mr-2 h-4 w-4" /> Upload {files.length > 0 ? `(${files.length})` : ''}</>
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
              <FileText className="h-3.5 w-3.5 text-primary" /> Document Type
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
              <Building2 className="h-3.5 w-3.5 text-primary" /> Associated Client (Optional)
            </Label>
            <Select 
              value={metadata.clientId} 
              onValueChange={(val) => setMetadata({...metadata, clientId: val || ''})} 
              disabled={isUploading}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select associated client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="client-1">Acme Corp</SelectItem>
                <SelectItem value="client-2">TechNova</SelectItem>
                <SelectItem value="client-3">Global Trade Co</SelectItem>
                <SelectItem value="client-4">Apex Maritime Logistics</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5 font-medium">
              <Package className="h-3.5 w-3.5 text-primary" /> Associated Shipment (Optional)
            </Label>
            <Select 
              value={metadata.shipmentId} 
              onValueChange={(val) => setMetadata({...metadata, shipmentId: val || ''})} 
              disabled={isUploading}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select shipment ID" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SHP-1001">#TRK-98230 (SHP-1001)</SelectItem>
                <SelectItem value="SHP-1002">#TRK-98231 (SHP-1002)</SelectItem>
                <SelectItem value="SHP-1003">#TRK-98232 (SHP-1003)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5 font-medium">
              <FileCode className="h-3.5 w-3.5 text-primary" /> Bill of Entry ID (Optional)
            </Label>
            <Select 
              value={metadata.boeId} 
              onValueChange={(val) => setMetadata({...metadata, boeId: val || ''})} 
              disabled={isUploading}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select BOE" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BOE-2026-001">BOE-2026-001</SelectItem>
                <SelectItem value="BOE-2026-002">BOE-2026-002</SelectItem>
                <SelectItem value="BOE-2026-003">BOE-2026-003</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5 font-medium">
              <Tag className="h-3.5 w-3.5 text-primary" /> Tags
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
            <Info className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
            <p>Metadata entered here will be linked to all files uploaded in this batch.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
