"use client"

import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFileCircleXmark, faArrowLeft, faHouse } from "@fortawesome/free-solid-svg-icons"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PageHeader } from "@/components/erp/page-header"

interface DocumentNotFoundClientProps {
  documentId: string
}

export function DocumentNotFoundClient({ documentId }: DocumentNotFoundClientProps) {
  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto py-8 animate-in fade-in duration-300">
      <PageHeader
        title="Document Status"
        description="View details regarding the requested document resource."
      />

      <Card className="border-border/60 shadow-sm rounded-xl overflow-hidden text-center py-6">
        <CardHeader className="flex flex-col items-center justify-center pb-4">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-4 ring-1 ring-amber-500/20">
            <FontAwesomeIcon icon={faFileCircleXmark} className="size-8" />
          </div>
          <CardTitle className="text-xl font-bold tracking-tight text-foreground">
            Document No Longer Available
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground max-w-md mt-2 leading-relaxed">
            The document you are looking for <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded border">({documentId})</span> has been permanently deleted or is no longer accessible.
          </CardDescription>
        </CardHeader>

        <CardContent className="text-xs text-muted-foreground/80 max-w-md mx-auto bg-muted/40 p-4 rounded-lg border border-border/40">
          <p>
            If you followed a notification link, the document may have been removed by an administrator or archived into the recycle bin.
          </p>
        </CardContent>

        <CardFooter className="flex items-center justify-center gap-3 pt-6">
          <Link href="/documents" className={buttonVariants({ variant: "default", className: "gap-2" })}>
            <FontAwesomeIcon icon={faArrowLeft} className="size-3.5" />
            Return to Documents
          </Link>

          <Link href="/dashboard" className={buttonVariants({ variant: "outline", className: "gap-2" })}>
            <FontAwesomeIcon icon={faHouse} className="size-3.5" />
            Go to Dashboard
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
