// app/dashboard/habit-definitions/page.jsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  Loader2,
  PlusCircle,
  Edit,
  Trash2,
  Settings,
  XCircle,
  CheckCircle,
  Search,
} from "lucide-react";
import { useHabitDefinitionMutations, useAllHabitDefinitions } from "@/hooks/useHabitDefinitions"; // useInfinityScroll এর পরিবর্তে useAllHabitDefinitions
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageContainer } from "@/components/common/PageContainer";
// habitDefinitionsService এর সরাসরি আমদানি এখন আর প্রয়োজন নেই, এটি হুকের মাধ্যমে ব্যবহার হবে
// import habitDefinitionsService from "@/services/habitDefinitions";
// useInfinityScroll আমদানি এখন আর প্রয়োজন নেই
// import { useInfinityScroll } from "@/hooks/useInfinityScroll";
import { useDebounce } from 'use-debounce';

export default function HabitDefinitionsPage() {
  // --- State Initialization ---
  const [searchInputValue, setSearchInputValue] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchInputValue, 500);

  const [sorting, setSorting] = useState([]);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [definitionToDeleteId, setDefinitionToDeleteId] = useState(null);

  // --- Data Fetching with useAllHabitDefinitions ---
  // ইনফিনিটি স্ক্রলের পরিবর্তে useAllHabitDefinitions ব্যবহার করা হলো
  const {
    data: habitDefinitions = [],
    isLoading, // এটি এখন প্রাথমিক লোডিং এবং রিফেচিং উভয়কেই বোঝাবে
    isError,
    error,
    // isFetchingNextPage, hasNextPage, lastItemRef এখন আর প্রয়োজন নেই
  } = useAllHabitDefinitions(debouncedSearchQuery); // সার্চ কোয়েরি পাঠানো হচ্ছে

  // --- Mutations for Delete Operation ---
  const { deleteHabitDefinitionMutation } = useHabitDefinitionMutations();

  // --- Action Handlers ---
  const confirmDelete = (definitionId) => {
    setDefinitionToDeleteId(definitionId);
    setIsAlertDialogOpen(true);
  };

  const executeDelete = () => {
    if (definitionToDeleteId) {
      deleteHabitDefinitionMutation.mutate(definitionToDeleteId, {
        onSuccess: () => {
          toast.success("Habit definition deleted successfully!");
        },
        onError: (err) => {
          toast.error(`Failed to delete habit definition: ${err.message}`);
        },
        onSettled: () => {
          setIsAlertDialogOpen(false);
          setDefinitionToDeleteId(null);
        },
      });
    }
  };

  const getInputTypeLabel = (type) => {
    const labels = {
      text: "Text Input",
      number: "Number Input",
      select: "Dropdown Select",
      boolean: "Yes/No Toggle",
      scale: "Scale (1-10)",
    };
    return labels[type] || type;
  };

  // --- Table Columns Definition ---
  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Habit Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
      },
      {
        accessorKey: "inputType",
        header: "Input Type",
        cell: ({ row }) => (
          <Badge variant="outline">{getInputTypeLabel(row.getValue("inputType"))}</Badge>
        ),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <div className="text-sm text-muted-foreground line-clamp-1 max-w-[200px]">
            {row.getValue("description") || "No description"}
          </div>
        ),
      },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => (
          <Badge variant={row.getValue("isActive") ? "default" : "secondary"}>
            {row.getValue("isActive") ? (
              <CheckCircle className="h-3 w-3 mr-1" />
            ) : (
              <XCircle className="h-3 w-3 mr-1" />
            )}
            {row.getValue("isActive") ? "Active" : "Inactive"}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => (
          <div className="text-right space-x-2">
            <Link href={`/dashboard/habit-definitions/edit/${row.original.$id}`}>
              <Button variant="outline" size="sm" className='cursor-pointer'>
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
            </Link>
            <Button
              variant="destructive"
              size="sm"
              className='cursor-pointer'
              onClick={() => confirmDelete(row.original.$id)}
              disabled={deleteHabitDefinitionMutation.isPending}
            >
              {deleteHabitDefinitionMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <Trash2 className="h-4 w-4 mr-1" />
              )}
              Delete
            </Button>
          </div>
        ),
        enableSorting: false,
      },
    ],
    [deleteHabitDefinitionMutation.isPending]
  );

  // --- TanStack React Table Instance ---
  const table = useReactTable({
    data: habitDefinitions || [], // habitDefinitions এখন সরাসরি অ্যারে
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  // --- Conditional Rendering for Loading, Error, Empty States ---
  // isLoading এখন useAllHabitDefinitions থেকে আসবে
  const showInitialLoading = isLoading && (habitDefinitions === null || habitDefinitions.length === 0);
  const showEmptyState = !isLoading && !isError && (habitDefinitions === null || habitDefinitions.length === 0);


  if (showInitialLoading) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin h-8 w-8 text-primary" />
          <span className="ml-3 text-lg text-muted-foreground">Loading habit definitions...</span>
        </div>
      </PageContainer>
    );
  }

  if (isError && (habitDefinitions === null || habitDefinitions.length === 0)) {
    return (
      <PageContainer>
        <div className="text-center p-6 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
          <h2 className="text-xl font-semibold text-red-700 dark:text-red-300 mb-2">Error loading data!</h2>
          <p className="text-red-600 dark:text-red-400 mb-4">Failed to load habit definitions: {error?.message || "An unknown error occurred."}</p>
          <Button onClick={() => window.location.reload()} className="mt-4 bg-red-600 hover:bg-red-700">
            Retry
          </Button>
        </div>
      </PageContainer>
    );
  }

  // --- Main Component Render ---
  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Habit Definitions</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage different types of definitions to track patient habits.
            </p>
          </div>
          <Link href="/dashboard/habit-definitions/add">
            <Button className='cursor-pointer'>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Definition
            </Button>
          </Link>
        </div>

        {/* Search Input for Habit Definitions */}
        <div className="flex items-center gap-2 mb-4">

        </div>
        {searchInputValue && (
          <Button variant="ghost" size="icon" onClick={() => setSearchInputValue("")}>
            <XCircle className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
        {/* isLoading এখন useAllHabitDefinitions থেকে আসবে */}
        {isLoading && debouncedSearchQuery && (
          <Loader2 className="animate-spin h-5 w-5 text-primary ml-2" />
        )}
      </div>

      {/* Definitions List or Empty State */}
      {showEmptyState ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Habit Definitions Found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {debouncedSearchQuery
                ? "No habits match your search. Try a different query."
                : "Start by creating your first habit definition to track patient habits."
              }
            </p>
            {!debouncedSearchQuery && (
              <Link href="/dashboard/habit-definitions/add">
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add First Definition
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border bg-card text-card-foreground shadow-sm">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
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
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the habit definition
              and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteHabitDefinitionMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={executeDelete}
              disabled={deleteHabitDefinitionMutation.isPending}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleteHabitDefinitionMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Continue"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  );
}