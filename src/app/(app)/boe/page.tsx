import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, FileSpreadsheet } from "lucide-react"

export default function BillOfEntryPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bill of Entry</h1>
          <p className="text-muted-foreground mt-2">
            Manage customs declarations and bill of entry records.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create BOE
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent BOE Documents</CardTitle>
          <CardDescription>A list of recently filed Bill of Entry records.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search BOE number..." className="pl-8" />
            </div>
            <Button variant="outline">Filter</Button>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>BOE Number</TableHead>
                <TableHead>Importer</TableHead>
                <TableHead>Filing Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                    BOE-2026-{2041 + i}
                  </TableCell>
                  <TableCell>Global Logistics Inc.</TableCell>
                  <TableCell>Oct {10 + i}, 2026</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-success/10 text-success">
                      Cleared
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
