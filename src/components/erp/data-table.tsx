"use client"

import * as React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faChevronDown, faChevronLeft, faChevronRight, faDownload } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { EmptyState } from "./empty-state"

export interface ColumnDef<T> {
  header: string
  accessorKey?: keyof T
  cell?: (item: T) => React.ReactNode
  sortable?: boolean
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[]
  data: T[]
  searchKey?: keyof T
  searchPlaceholder?: string
  emptyStateTitle?: string
  emptyStateDescription?: string
}

export function DataTable<T>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search...",
  emptyStateTitle = "No data found",
  emptyStateDescription = "There are no records to display matching your criteria.",
}: DataTableProps<T>) {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [sortConfig, setSortConfig] = React.useState<{ key: keyof T; direction: "asc" | "desc" } | null>(null)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)

  // Filter Data
  const filteredData = React.useMemo(() => {
    if (!searchKey || !searchQuery) return data

    const lowerQuery = searchQuery.toLowerCase()

    return data.filter((item) => {
      return Object.values(item as object).some((value) => {
        if (typeof value === "string" || typeof value === "number") {
          return String(value).toLowerCase().includes(lowerQuery)
        }
        return false
      })
    })
  }, [data, searchKey, searchQuery])

  // Sort Data
  const sortedData = React.useMemo(() => {
    if (!sortConfig) return filteredData

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
      return 0
    })
  }, [filteredData, sortConfig])

  // Paginate Data
  const paginatedData = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return sortedData.slice(start, start + pageSize)
  }, [sortedData, currentPage, pageSize])

  const totalPages = Math.ceil(sortedData.length / pageSize)

  const handleSort = (key: keyof T) => {
    let direction: "asc" | "desc" = "asc"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-1 items-center space-x-2 w-full sm:w-auto">
          {searchKey && (
            <div className="relative w-full sm:max-w-sm group">
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-9 bg-muted/30 border-muted/50 focus-visible:bg-background rounded-full transition-all duration-300 focus-visible:ring-2 shadow-sm"
              />
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="bg-card" onClick={() => toast({ title: "Export CSV", description: "Exporting data..." })}>
            <FontAwesomeIcon icon={faDownload} className="mr-2 h-4 w-4" />
            CSV
          </Button>
          <Button variant="outline" size="sm" className="bg-card" onClick={() => toast({ title: "Export Excel", description: "Exporting data..." })}>
            <FontAwesomeIcon icon={faDownload} className="mr-2 h-4 w-4" />
            Excel
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-sm relative w-full overflow-auto">
        <Table>
          <TableHeader className="bg-background/80 backdrop-blur-md sticky top-0 z-10 shadow-[0_1px_2px_rgba(0,0,0,0.05)] dark:shadow-[0_1px_2px_rgba(255,255,255,0.05)]">
            <TableRow className="hover:bg-transparent border-b-0">
              {columns.map((col, index) => (
                <TableHead 
                  key={index}
                  className={cn(
                    "transition-colors duration-200",
                    col.sortable ? "cursor-pointer select-none hover:text-primary" : ""
                  )}
                  onClick={() => col.sortable && col.accessorKey && handleSort(col.accessorKey)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{col.header}</span>
                    {col.sortable && (
                      <FontAwesomeIcon icon={faChevronDown} 
                        className={cn(
                          "h-4 w-4 transition-all duration-200", 
                          sortConfig?.key === col.accessorKey ? "opacity-100" : "opacity-0 -translate-y-1",
                          sortConfig?.key === col.accessorKey && sortConfig?.direction === "asc" ? "rotate-180" : "rotate-0"
                        )} 
                      />
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, rowIndex) => (
                <TableRow key={rowIndex} className="group">
                  {columns.map((col, colIndex) => (
                    <TableCell key={colIndex}>
                      {col.cell
                        ? col.cell(item)
                        : col.accessorKey
                        ? (item[col.accessorKey] as React.ReactNode)
                        : null}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <EmptyState 
                    title={emptyStateTitle}
                    description={emptyStateDescription}
                    className="border-none min-h-[200px]"
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {sortedData.length > 0 && (
        <div className="flex items-center justify-between px-2">
          <div className="flex-1 text-sm text-muted-foreground">
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, sortedData.length)} of{" "}
            {sortedData.length} entries
          </div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <Select
                value={`${pageSize}`}
                onValueChange={(value) => {
                  setPageSize(Number(value))
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((size) => (
                    <SelectItem key={size} value={`${size}`}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <span className="sr-only">Go to previous page</span>
                <FontAwesomeIcon icon={faChevronLeft} className="h-4 w-4" />
              </Button>
              <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <span className="sr-only">Go to next page</span>
                <FontAwesomeIcon icon={faChevronRight} className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
