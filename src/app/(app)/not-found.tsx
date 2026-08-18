"use client"

import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faQuestion, faHouse, faFileLines } from "@fortawesome/free-solid-svg-icons"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PageHeader } from "@/components/erp/page-header"

export default function AppNotFound() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto py-8 animate-in fade-in duration-300">
      <PageHeader
        title="Page Not Found"
        description="The requested page or resource could not be found."
      />

      <Card className="border-border/60 shadow-sm rounded-xl overflow-hidden text-center py-6">
        <CardHeader className="flex flex-col items-center justify-center pb-4">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4 ring-1 ring-border/40">
            <FontAwesomeIcon icon={faQuestion} className="size-8" />
          </div>
          <CardTitle className="text-xl font-bold tracking-tight text-foreground">
            404 - Page Not Found
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground max-w-md mt-2 leading-relaxed">
            The page or document you are trying to access does not exist or may have been moved or deleted.
          </CardDescription>
        </CardHeader>

        <CardFooter className="flex items-center justify-center gap-3 pt-4">
          <Link href="/documents" className={buttonVariants({ variant: "default", className: "gap-2" })}>
            <FontAwesomeIcon icon={faFileLines} className="size-3.5" />
            Go to Documents
          </Link>

          <Link href="/dashboard" className={buttonVariants({ variant: "outline", className: "gap-2" })}>
            <FontAwesomeIcon icon={faHouse} className="size-3.5" />
            Return to Dashboard
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
