import Link from "next/link";
import { DocumentUploadForm } from "@/components/erp/document-upload-form";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function UploadDocumentPage() {
  return (
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto w-full">
      <div className="flex items-center gap-4">
        <Link href="/documents" className={buttonVariants({ variant: "outline", size: "icon" })}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Upload Documents</h1>
          <p className="text-muted-foreground mt-1">
            Securely upload files and assign metadata.
          </p>
        </div>
      </div>
      
      <DocumentUploadForm />
    </div>
  );
}
