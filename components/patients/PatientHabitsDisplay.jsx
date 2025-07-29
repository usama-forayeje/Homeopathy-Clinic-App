"use client"

import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpDown, Search, Activity, TrendingUp, Calendar } from "lucide-react"
import Link from "next/link"
import patientHabitsService from "@/services/patientHabits"
import habitDefinitionsService from "@/services/habitDefinitions"
import { LoadingSpinner } from "@/components/common/LoadingSpinner"

export function PatientHabitsDisplay({ patientId }) {
  const [sorting, setSorting] = useState([])
  const [globalFilter, setGlobalFilter] = useState("")

  // Fetch patient habits and their definitions concurrently
  const { data: patientHabits = [], isLoading: isLoadingHabits } = useQuery({
    queryKey: ["patientHabits", patientId],
    queryFn: () => patientHabitsService.getPatientHabitsByPatientId(patientId),
    enabled: !!patientId,
  })

  const { data: habitDefinitions = [], isLoading: isLoadingDefinitions } = useQuery({
    queryKey: ["habitDefinitions"],
    queryFn: habitDefinitionsService.getAllActiveHabitDefinitions,
    staleTime: 5 * 60 * 1000,
  })

  // Memoized map and enhanced habits for efficient lookups
  const habitDefinitionsMap = useMemo(() => {
    return habitDefinitions.reduce((acc, def) => ({ ...acc, [def.$id]: def }), {})
  }, [habitDefinitions])

  const enhancedHabits = useMemo(() => {
    return patientHabits.map((habit) => ({
      ...habit,
      habitDefinition: habitDefinitionsMap[habit.habitDefinitionId] || null,
    }))
  }, [patientHabits, habitDefinitionsMap])

  // Table columns defined concisely
  const columns = useMemo(
    () => [
      {
        accessorKey: "habitDefinition.name",
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="h-8 px-2">
            <Activity className="mr-2 h-4 w-4" /> Habit <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const habitDef = row.original.habitDefinition
          return (
            <div>
              <div className="font-medium">{habitDef?.name || "Unknown Habit"}</div>
              {habitDef?.description && <div className="text-sm text-muted-foreground">{habitDef.description}</div>}
            </div>
          )
        },
      },
      {
        accessorKey: "value",
        header: "Value",
        cell: ({ row }) => {
          const { value, habitDefinition } = row.original
          return (
            <div className="flex items-center space-x-2">
              <Badge variant="outline">{value}</Badge>
              {habitDefinition?.inputType && (
                <Badge variant="secondary" className="text-xs">
                  {habitDefinition.inputType}
                </Badge>
              )}
            </div>
          )
        },
      },
      {
        accessorKey: "recordedDate",
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="h-8 px-2">
            <Calendar className="mr-2 h-4 w-4" /> Recorded <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const date = new Date(row.getValue("recordedDate"))
          return (
            <div className="text-sm">
              {date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
            </div>
          )
        },
      },
      {
        accessorKey: "notes",
        header: "Notes",
        cell: ({ row }) => {
          const notes = row.getValue("notes")
          return notes ? (
            <div className="max-w-[200px] truncate" title={notes}>
              {notes}
            </div>
          ) : (
            <span className="text-muted-foreground">-</span>
          )
        },
      },
    ],
    [],
  )

  const table = useReactTable({
    data: enhancedHabits,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    state: { sorting, globalFilter },
  })

  const isLoading = isLoadingHabits || isLoadingDefinitions

  if (isLoading) {
    return <LoadingSpinner />
  }

  const uniqueHabitsCount = new Set(enhancedHabits.map((h) => h.habitDefinitionId)).size
  const totalRecordsCount = enhancedHabits.length
  const habitsWithNotesCount = enhancedHabits.filter((h) => h.notes).length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" /> Patient Habits
            </CardTitle>
            <CardDescription>Tracked lifestyle habits and health patterns</CardDescription>
          </div>
          <Button asChild>
            <Link href={`/dashboard/patients/${patientId}/habits/new`}>
              <TrendingUp className="h-4 w-4 mr-2" /> Track New Habit
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search habits..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(String(e.target.value))}
            className="max-w-sm"
          />
        </div>

        {/* Habits Table */}
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
                      <Activity className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">No habits tracked yet</p>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/dashboard/patients/${patientId}/habits/new`}>Start Tracking Habits</Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Summary Stats */}
        {enhancedHabits.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{uniqueHabitsCount}</div>
              <div className="text-sm text-muted-foreground">Unique Habits</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{totalRecordsCount}</div>
              <div className="text-sm text-muted-foreground">Total Records</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{habitsWithNotesCount}</div>
              <div className="text-sm text-muted-foreground">With Notes</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}