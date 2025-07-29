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
import { ArrowUpDown, Eye, Edit, Search, Plus, User, Phone, Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { PageContainer } from "@/components/common/PageContainer"
import patientsService from "@/services/patients"
import { LoadingSpinner } from "@/components/common/LoadingSpinner"

export default function PatientsPage() {
  const [sorting, setSorting] = useState([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  // Fetch all patients
  const {
    data: patients = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["patients"],
    queryFn: patientsService.getAllPatients,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2"
          >
            <User className="mr-2 h-4 w-4" />
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
      },
      {
        accessorKey: "age",
        header: "Age",
        cell: ({ row }) => {
          const age = row.getValue("age")
          const dob = row.original.dob

          // Calculate age from DOB if available
          let displayAge = age
          if (dob && !age) {
            const birthDate = new Date(dob)
            const today = new Date()
            let calculatedAge = today.getFullYear() - birthDate.getFullYear()
            const monthDiff = today.getMonth() - birthDate.getMonth()
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
              calculatedAge--
            }
            displayAge = calculatedAge
          }

          return <Badge variant="outline">{displayAge || "N/A"}</Badge>
        },
      },
      {
        accessorKey: "gender",
        header: "Gender",
        cell: ({ row }) => <Badge variant="secondary">{row.getValue("gender")}</Badge>,
      },
      {
        accessorKey: "phoneNumber",
        header: "Phone",
        cell: ({ row }) => (
          <div className="flex items-center">
            <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
            {row.getValue("phoneNumber")}
          </div>
        ),
      },
      {
        accessorKey: "patientId",
        header: "Patient ID",
        cell: ({ row }) => (
          <Badge variant="outline" className="font-mono">
            {row.getValue("patientId")}
          </Badge>
        ),
      },
      {
        accessorKey: "firstConsultationDate",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2"
          >
            <Calendar className="mr-2 h-4 w-4" />
            First Visit
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const date = row.getValue("firstConsultationDate")
          return date ? (
            <div className="text-sm">
              {new Date(date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
          ) : (
            <span className="text-muted-foreground">-</span>
          )
        },
      },
      {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => (
          <div className="text-right space-x-2">
            <Button asChild variant="ghost" size="sm">
              <Link href={`/dashboard/patients/${row.original.$id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href={`/dashboard/patients/${row.original.$id}/edit`}>
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
    data: patients,
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
    return (
      <PageContainer>
        <LoadingSpinner />
      </PageContainer>
    )
  }

  if (error) {
    return (
      <PageContainer>
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-red-500">
              <User className="h-12 w-12 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Error Loading Patients</h3>
              <p className="text-sm text-muted-foreground">{error.message}</p>
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Patient Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage all patient records and medical history</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/patients/new">
              <Plus className="h-4 w-4 mr-2" />
              Add New Patient
            </Link>
          </Button>
        </div>

        {/* Patients Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Patients</CardTitle>
                <CardDescription>Complete list of registered patients</CardDescription>
              </div>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {patients.length} Total
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients..."
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
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className="hover:bg-muted/50 cursor-pointer"
                        onClick={() => window.open(`/dashboard/patients/${row.original.$id}`, "_blank")}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <User className="h-8 w-8 text-muted-foreground" />
                          <p className="text-muted-foreground">No patients found</p>
                          <Button asChild variant="outline" size="sm">
                            <Link href="/dashboard/patients/new">Add First Patient</Link>
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
                  of {table.getFilteredRowModel().rows.length} patients
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
