import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption } from "../../src/components/ui/table"

describe("Table Component", () => {
  it("renders table structures correctly", () => {
    render(
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>INV001</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>$250.00</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell>$250.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    )

    expect(screen.getByText("A list of your recent invoices.")).toBeInTheDocument()
    expect(screen.getByText("Invoice")).toBeInTheDocument()
    expect(screen.getByText("INV001")).toBeInTheDocument()
    expect(screen.getByText("Total")).toBeInTheDocument()
  })
})
