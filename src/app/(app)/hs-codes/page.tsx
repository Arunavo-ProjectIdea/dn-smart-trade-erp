import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Hash } from "lucide-react"

export default function HSCodesPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">HS Codes Lookup</h1>
          <p className="text-muted-foreground mt-2">
            Search and verify Harmonized System codes for international shipping.
          </p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>HS Code Database</CardTitle>
          <CardDescription>Browse product classifications and tariff rates.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search by description or code..." className="pl-8" />
            </div>
            <Button>Lookup</Button>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>HS Code</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Duty Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  8471.30.00
                </TableCell>
                <TableCell>Portable automatic data processing machines</TableCell>
                <TableCell>Machinery</TableCell>
                <TableCell>0%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  8517.12.00
                </TableCell>
                <TableCell>Smartphones and mobile communication devices</TableCell>
                <TableCell>Electronics</TableCell>
                <TableCell>0%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  9403.30.00
                </TableCell>
                <TableCell>Wooden furniture of a kind used in offices</TableCell>
                <TableCell>Furniture</TableCell>
                <TableCell>5.5%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
