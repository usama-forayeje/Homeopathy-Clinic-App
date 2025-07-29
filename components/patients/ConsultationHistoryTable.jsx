"use client"

import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowUpDown,
  Eye,
  Edit,
  Search,
  Calendar,
  Stethoscope,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import consultationsService from "@/services/consultations"
import { LoadingSpinner } from "@/components/common/LoadingSpinner"

export function ConsultationHistoryTable({ patientId }) {
  const [sorting, setSorting] = useState([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  // Fetch consultations for this patient
  const {
    data: consultations = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["consultations", "patient", patientId],
    queryFn: () => consultationsService.getConsultationsByPatientId(patientId),
    enabled: !!patientId,
  })

  const columns = useMemo(
    () => [
      {
        accessorKey: "consultationDate",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const date = new Date(row.getValue("consultationDate"))
          return (
            <div className="font-medium">
              {date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
          )
        },
      },
      {
        accessorKey: "chiefComplaint",
        header: "Chief Complaint",
        cell: ({ row }) => {
          const complaints = row.getValue("chiefComplaint")
          const complaintText = Array.isArray(complaints)
            ? complaints.join(", ")
            : complaints || "No complaint recorded"

          return (
            <div className="max-w-[300px] truncate" title={complaintText}>
              {complaintText}
            </div>
          )
        },
      },
      {
        accessorKey: "diagnosis",
        header: "Diagnosis",
        cell: ({ row }) => {
          const diagnosis = row.getValue("diagnosis")
          const diagnosisText = Array.isArray(diagnosis) ? diagnosis.join(", ") : diagnosis || "No diagnosis"

          return (
            <div className="max-w-[200px] truncate" title={diagnosisText}>
              {diagnosisText}
            </div>
          )
        },
      },
      {
        accessorKey: "billAmount",
        header: "Bill Amount",
        cell: ({ row }) => {
          const amount = row.getValue("billAmount")
          return amount ? (
            <Badge variant="secondary">${amount.toFixed(2)}</Badge>
          ) : (
            <span className="text-muted-foreground">-</span>
          )
        },
      },
      {
        accessorKey: "followUpDate",
        header: "Follow-up",
        cell: ({ row }) => {
          const followUpDate = row.getValue("followUpDate")
          if (!followUpDate) return <span className="text-muted-foreground">-</span>

          const date = new Date(followUpDate)
          const isOverdue = date < new Date()

          return (
            <Badge variant={isOverdue ? "destructive" : "outline"}>
              {date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </Badge>
          )
        },
      },
      {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => (
          <div className="text-right space-x-2">
            <Button asChild variant="ghost" size="sm">
              <Link href={`/dashboard/consultations/${row.original.$id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href={`/dashboard/consultations/${row.original.$id}/edit`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        ),
        enableSorting: false,
      },
    ],
    [],
  )

  const table = useReactTable({
    data: consultations,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    state: {
      sorting,
      globalFilter,
      pagination,
    },
  })

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="text-red-500">
            <FileText className="h-12 w-12 mx-auto mb-2" />
            <h3 className="text-lg font-semibold">Error Loading Consultations</h3>
            <p className="text-sm text-muted-foreground">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              Consultation History
            </CardTitle>
            <CardDescription>Complete medical consultation history for this patient</CardDescription>
          </div>
          <Button asChild>
            <Link href={`/dashboard/consultations/new?patientId=${patientId}`}>
              <FileText className="h-4 w-4 mr-2" />
              New Consultation
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search consultations..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(String(event.target.value))}
            className="max-w-sm"
          />
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="hover:bg-muted/50">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Stethoscope className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">No consultations found</p>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/dashboard/consultations/new?patientId=${patientId}`}>
                          Create First Consultation
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {table.getPageCount() > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length,
              )}{" "}
              of {table.getFilteredRowModel().rows.length} consultations
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
