"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
import { ArrowUpDown, Loader2, Plus, Edit, Trash } from "lucide-react";
import { useAllMedicineInstructions, useMedicineInstructionMutations } from "@/hooks/useMedicineInstructions";
import { useInstructionStore } from "@/store/instructionStore";

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

export default function MedicineInstructionsPage() {
  const { data: instructions = [], isLoading, isError, error } = useAllMedicineInstructions();
  const { setLoadingInstructions, setInstructionError } = useInstructionStore();
  const { deleteMedicineInstructionMutation } = useMedicineInstructionMutations();

  const [sorting, setSorting] = useState([]);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [instructionToDeleteId, setInstructionToDeleteId] = useState(null);

  useEffect(() => {
    setLoadingInstructions(isLoading);
    setInstructionError(isError ? error : null);
  }, [isLoading, isError, error, setLoadingInstructions, setInstructionError]);

  const confirmDelete = (instructionId) => {
    setInstructionToDeleteId(instructionId);
    setIsAlertDialogOpen(true);
  };

  const executeDelete = () => {
    if (instructionToDeleteId) {
      deleteMedicineInstructionMutation.mutate(instructionToDeleteId, {
        onSettled: () => {
          setIsAlertDialogOpen(false);
          setInstructionToDeleteId(null);
        },
      });
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "instructionText", // Match your schema/Appwrite attribute
        header: ({ column }) => (
          <Button
            variant="ghost"
            className={'cursor-pointer'}
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Instruction Text
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => <div className="font-medium">{row.getValue("instructionText")}</div>,
      },
      {
        accessorKey: "notes", // Match your schema/Appwrite attribute
        header: "Notes",
        cell: ({ row }) => <div>{row.getValue("notes") || "N/A"}</div>,
      },
      {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => (
          <div className="text-right">
            <Link href={`/dashboard/instructions/edit/${row.original.$id}`}>
              <Button variant="ghost" size="sm" className="mr-2 **:cursor-pointer">
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="destructive"

              size="sm"
              onClick={() => confirmDelete(row.original.$id)}
              disabled={deleteMedicineInstructionMutation.isPending}
            >
              {deleteMedicineInstructionMutation.isPending ? <Loader2 className="h-4 w-4 cursor-pointer animate-spin" /> : <Trash className="h-4 w-4" />}
            </Button>
          </div>
        ),
        enableSorting: false,
      },
    ],
    [deleteMedicineInstructionMutation.isPending, confirmDelete]
  );

  const table = useReactTable({
    data: instructions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2 text-lg">Loading instructions...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center p-8">
          <h2 className="text-xl font-semibold text-red-500">Error loading instructions!</h2>
          <p className="text-muted-foreground">{error?.message || "An unknown error occurred."}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 ">
      <div className="flex justify-between items-center mb-6 px-10 ">
        <h1 className="text-3xl font-bold">Medicine Instructions</h1>
        <Link href="/dashboard/instructions/add">
          <Button className='cursor-pointer'>
            <Plus className="mr-2 h-4 w-4" /> Add New Instruction
          </Button>
        </Link>
      </div>

      {instructions.length === 0 ? (
        <p className="text-center text-muted-foreground mt-10">No instructions found. Start by adding one!</p>
      ) : (
        <div className="rounded-md border">
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
              {table.getRowModel().rows?.length ? (
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
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the medicine instruction
              and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMedicineInstructionMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={executeDelete}
              disabled={deleteMedicineInstructionMutation.isPending}
            >
              {deleteMedicineInstructionMutation.isPending ? (
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
    </div>
  );
}