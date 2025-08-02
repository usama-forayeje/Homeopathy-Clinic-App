"use client"

import { useState, useMemo } from "react"
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
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  Plus,
  Stethoscope,
  TrendingUp,
  Users,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { PageContainer } from "@/components/common/PageContainer"
import { LoadingSpinner } from "@/components/common/LoadingSpinner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useConsultations } from "@/hooks/useConsultations"

export default function ConsultationsPage() {
  // ✅ All hooks are declared and called unconditionally at the very top of the component.
  // React needs to see these in the same order on every render.
  const [sorting, setSorting] = useState([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  // Hook for fetching data
  const {
    data: consultationsData,
    isLoading,
    error,
  } = useConsultations({
    limit: pagination.pageSize,
    offset: pagination.pageIndex * pagination.pageSize,
  })

  const consultations = consultationsData?.documents || []
  const totalConsultations = consultationsData?.total || 0

  // Memoized stats calculation
  const stats = useMemo(() => {
    const total = totalConsultations
    const today = consultations.filter((c) => {
      const consultationDate = new Date(c.consultationDate)
      const now = new Date()
      return consultationDate.toDateString() === now.toDateString()
    }).length

    const thisWeek = consultations.filter((c) => {
      const consultationDate = new Date(c.consultationDate)
      const now = new Date()
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      return consultationDate >= weekAgo
    }).length

    const avgBill =
      consultations.length > 0
        ? consultations.reduce((sum, c) => sum + (c.billAmount || 0), 0) / consultations.length
        : 0

    return { total, today, thisWeek, avgBill }
  }, [consultations, totalConsultations])

  // Memoized column definitions for react-table
  const columns = useMemo(
    () => [
      {
        accessorKey: "patient.name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 hover:bg-blue-50"
          >
            <Users className="mr-2 h-4 w-4 text-blue-600" />
            Patient Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {row.original.patient?.name?.charAt(0)?.toUpperCase() || "P"}
            </div>
            <div>
              <div className="font-semibold text-gray-900">{row.original.patient?.name || "Unknown"}</div>
              <div className="text-sm text-gray-500">ID: {row.original.patient?.patientId || "N/A"}</div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "consultationDate",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 hover:bg-green-50"
          >
            <Calendar className="mr-2 h-4 w-4 text-green-600" />
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const date = new Date(row.getValue("consultationDate"))
          return (
            <div className="text-sm">
              <div className="font-medium">
                {date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
              <div className="text-gray-500 text-xs">{date.toLocaleDateString("en-US", { weekday: "short" })}</div>
            </div>
          )
        },
      },
      {
        accessorKey: "chiefComplaint",
        header: "Chief Complaint",
        cell: ({ row }) => {
          const complaints = row.getValue("chiefComplaint") || []
          const firstComplaint = Array.isArray(complaints) ? complaints[0] : complaints
          return (
            <div className="max-w-xs">
              <p className="text-sm text-gray-900 truncate">{firstComplaint || "No complaint recorded"}</p>
              {Array.isArray(complaints) && complaints.length > 1 && (
                <Badge variant="secondary" className="text-xs mt-1">
                  +{complaints.length - 1} more
                </Badge>
              )}
            </div>
          )
        },
      },
      {
        accessorKey: "diagnosis",
        header: "Diagnosis",
        cell: ({ row }) => {
          const diagnoses = row.getValue("diagnosis") || []
          const firstDiagnosis = Array.isArray(diagnoses) ? diagnoses[0] : diagnoses
          return (
            <div className="max-w-xs">
              <p className="text-sm text-gray-900 truncate">{firstDiagnosis || "No diagnosis"}</p>
              {Array.isArray(diagnoses) && diagnoses.length > 1 && (
                <Badge variant="secondary" className="text-xs mt-1">
                  +{diagnoses.length - 1} more
                </Badge>
              )}
            </div>
          )
        },
      },
      {
        accessorKey: "billAmount",
        header: "Bill Amount",
        cell: ({ row }) => {
          const amount = row.getValue("billAmount") || 0
          return (
            <Badge variant="outline" className="font-mono">
              ৳{amount}
            </Badge>
          )
        },
      },
      {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => (
          <div className="text-right space-x-1">
            <Button asChild variant="ghost" size="sm" className="hover:bg-blue-50">
              <Link href={`/dashboard/consultations/${row.original.$id}`}>
                <Eye className="h-4 w-4 text-blue-600" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="hover:bg-green-50">
              <Link href={`/dashboard/consultations/${row.original.$id}/edit`}>
                <Edit className="h-4 w-4 text-green-600" />
              </Link>
            </Button>
          </div>
        ),
        enableSorting: false,
      },
    ],
    [],
  )

  // useReactTable hook
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
    manualPagination: true,
    pageCount: Math.ceil(totalConsultations / pagination.pageSize),
  })

  // ✅ Now, handle conditional rendering *after* all hooks have been called.
  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center h-96 space-y-4">
          <LoadingSpinner />
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">Loading Consultations</h3>
            <p className="text-gray-600">Fetching consultation records...</p>
          </div>
        </div>
      </PageContainer>
    )
  }

  if (error) {
    return (
      <PageContainer>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="text-center py-12">
            <div className="text-red-500">
              <Stethoscope className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Error Loading Consultations</h3>
              <p className="text-red-600 mb-4">{error.message}</p>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="space-y-8">
        {/* Enhanced Header with Stats */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 border border-blue-100">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-blue-400 to-green-400 rounded-full opacity-20"></div>
          <div className="relative">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-blue-500 to-green-500 p-3 rounded-xl">
                  <Stethoscope className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                    Consultation Management
                  </h1>
                  <p className="text-gray-600 mt-1 text-lg">Complete medical consultation records and history</p>
                </div>
              </div>
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-lg"
              >
                <Link href="/dashboard/consultations/new">
                  <Plus className="h-5 w-5 mr-2" />
                  New Consultation
                </Link>
              </Button>
            </div>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Stethoscope className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                    <div className="text-sm text-gray-600">Total Consultations</div>
                  </div>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Calendar className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stats.today}</div>
                    <div className="text-sm text-gray-600">Today</div>
                  </div>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stats.thisWeek}</div>
                    <div className="text-sm text-gray-600">This Week</div>
                  </div>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Clock className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">৳{Math.round(stats.avgBill)}</div>
                    <div className="text-sm text-gray-600">Avg. Bill</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Consultations Table */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">Consultation Records</CardTitle>
                <CardDescription className="text-gray-600 mt-1">
                  Complete list of medical consultations with patient details
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Badge variant="secondary" className="text-lg px-4 py-2 bg-blue-100 text-blue-800">
                  {totalConsultations} Records
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Enhanced Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by patient name, complaint, or diagnosis..."
                  value={globalFilter ?? ""}
                  onChange={(event) => setGlobalFilter(String(event.target.value))}
                  className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center space-x-3">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select>
                  <SelectTrigger className="w-32 h-11">
                    <SelectValue placeholder="Date Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Enhanced Table */}
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id} className="hover:bg-gray-50">
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} className="font-semibold text-gray-700">
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
                        className="hover:bg-blue-50/50 cursor-pointer transition-colors border-b border-gray-100"
                        onClick={() => window.open(`/dashboard/consultations/${row.original.$id}`, "_blank")}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="py-4">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-32 text-center">
                        <div className="flex flex-col items-center justify-center space-y-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <Stethoscope className="h-8 w-8 text-gray-400" />
                          </div>
                          <div className="text-center">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No consultations found</h3>
                            <p className="text-gray-600 mb-4">Get started by creating your first consultation</p>
                            <Button asChild className="bg-gradient-to-r from-blue-600 to-green-600">
                              <Link href="/dashboard/consultations/new">
                                <Plus className="h-4 w-4 mr-2" />
                                New Consultation
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Enhanced Pagination */}
            {table.getPageCount() > 1 && (
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600">
                  Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
                  {Math.min(
                    (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                    totalConsultations,
                  )}{" "}
                  of {totalConsultations} consultations
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="hover:bg-blue-50"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, table.getPageCount()) }, (_, i) => {
                      const pageIndex = table.getState().pagination.pageIndex
                      const startPage = Math.max(0, pageIndex - 2)
                      const currentPage = startPage + i
                      if (currentPage >= table.getPageCount()) return null
                      return (
                        <Button
                          key={currentPage}
                          variant={currentPage === pageIndex ? "default" : "outline"}
                          size="sm"
                          onClick={() => table.setPageIndex(currentPage)}
                          className={currentPage === pageIndex ? "bg-blue-600 hover:bg-blue-700" : "hover:bg-blue-50"}
                        >
                          {currentPage + 1}
                        </Button>
                      )
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="hover:bg-blue-50"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
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