import { PageHeader } from "@/components/erp/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HelpPage() {
  return (
    <div className="flex flex-col gap-8 pb-10">
      <PageHeader 
        title="Documentation & Help"
        description="Learn how to use DN Smart Trade ERP effectively."
      />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Basic concepts and navigation.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Learn how to navigate the dashboard, set up your profile, and understand the core features of the platform.
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Managing Shipments</CardTitle>
            <CardDescription>Create and track shipments.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Step-by-step guide on creating new shipments, updating statuses, and tracking cargo across the globe.
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Document Management</CardTitle>
            <CardDescription>Upload and organize files.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            How to upload Commercial Invoices, Packing Lists, and link them to specific Clients and Shipments.
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
