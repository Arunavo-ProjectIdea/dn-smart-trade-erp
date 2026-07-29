"use client"

import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { buttonVariants } from "@/components/ui/button"
import { DocumentUploadForm } from "@/components/erp/document-upload-form"

export default function DocumentUploadPage() {
  return (
    <div className="flex flex-col gap-8 pb-10 animate-in fade-in duration-500">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Link href="/documents" className="hover:text-foreground hover:underline transition-colors">
          Documents
        </Link>
        <FontAwesomeIcon icon={faChevronRight} className="h-4 w-4" />
        <span className="text-foreground font-medium">Upload Document</span>
      </div>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-start gap-4">
          <Link 
            href="/documents" 
            className={buttonVariants({ variant: "outline", size: "icon" })}
            title="Back to Documents"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
          </Link>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">
              Upload New Documents
            </h1>
            <p className="text-muted-foreground">
              Add single or batch trade documents with metadata and client linkages.
            </p>
          </div>
        </div>
      </div>

      {/* Main Upload Form Component */}
      <DocumentUploadForm />
    </div>
  )
}
