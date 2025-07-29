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
import { useAllMedicines, useMedicinesMutations } from "@/hooks/useMedicines";
import { useMedicineStore } from "@/store/medicineStore";

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
import { PageContainer } from "@/components/common/PageContainer";

export default function MedicinesPage() {
    const { data: medicines = [], isLoading, isError, error } = useAllMedicines();
    const { setMedicines, setLoadingMedicines, setMedicineError } = useMedicineStore();
    const { deleteMedicineMutation } = useMedicinesMutations();

    const [sorting, setSorting] = useState([]);
    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
    const [medicineToDeleteId, setMedicineToDeleteId] = useState(null);

    useEffect(() => {
        setLoadingMedicines(isLoading);
        setMedicineError(isError ? error : null);
    }, [isLoading, isError, error, setLoadingMedicines, setMedicineError]);

    // Function to open the AlertDialog and set the medicine ID
    const confirmDelete = (medicineId) => {
        setMedicineToDeleteId(medicineId);
        setIsAlertDialogOpen(true);
    };

    // Function to execute the delete mutation
    const executeDelete = () => {
        if (medicineToDeleteId) {
            deleteMedicineMutation.mutate(medicineToDeleteId, {
                onSettled: () => { // Closes the dialog whether success or error
                    setIsAlertDialogOpen(false);
                    setMedicineToDeleteId(null);
                }
            });
        }
    };

    // Define columns for TanStack Table
    const columns = useMemo(
        () => [
            {
                accessorKey: "medicineName",
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Medicine Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                ),
                cell: ({ row }) => <div className="font-medium">{row.getValue("medicineName")}</div>,
            },
            {
                accessorKey: "description",
                header: "Description",
                cell: ({ row }) => <div className="truncate max-w-[200px] md:max-w-[300px]" title={row.getValue("description") || "N/A"} >{row.getValue("description") || "N/A"}</div>,
            },
            {
                accessorKey: "potency",
                header: "Potency",
                cell: ({ row }) => <div>{row.getValue("potency") || "N/A"}</div>,
            },
            {
                id: "actions",
                header: () => <div className="text-right">Actions</div>,
                cell: ({ row }) => (
                    <div className="text-right">
                        <Link href={`/dashboard/medicines/edit/${row.original.$id}`}>
                            <Button variant="ghost" size="sm" className="mr-2 cursor-pointer">
                                <Edit className="h-4 w-4" />
                            </Button>
                        </Link>
                        {/* The delete button now triggers the AlertDialog */}
                        <Button
                            variant="destructive"
                            size="sm"
                            className='cursor-pointer'
                            onClick={() => confirmDelete(row.original.$id)}
                            disabled={deleteMedicineMutation.isPending}
                        >
                            {deleteMedicineMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash className="h-4 w-4" />}
                        </Button>
                    </div>
                ),
                enableSorting: false,
            },
        ],
        [deleteMedicineMutation.isPending, confirmDelete] // Add confirmDelete to dependencies
    );

    // Initialize TanStack Table
    const table = useReactTable({
        data: medicines,
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
                    <p className="ml-2 text-lg">Loading medicines...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="container mx-auto py-8">
                <div className="text-center p-8">
                    <h2 className="text-xl font-semibold text-red-500">Error loading medicines!</h2>
                    <p className="text-muted-foreground">{error?.message || "An unknown error occurred."}</p>
                    <Button onClick={() => window.location.reload()} className="mt-4">
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <PageContainer>
            <div className="container mx-auto py-8 px-10">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold ">Medicines</h1>
                    <Link href="/dashboard/medicines/add" >
                        <Button className="cursor-pointer">
                            <Plus className="mr-2 h-4 w-4" /> Add New Medicine
                        </Button>
                    </Link>
                </div>

                {medicines.length === 0 ? (
                    <p className="text-center text-muted-foreground mt-10">No medicines found. Start by adding one!</p>
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

                {/* AlertDialog for Delete Confirmation */}
                <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the medicine
                                and remove its data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={deleteMedicineMutation.isPending}>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={executeDelete}
                                disabled={deleteMedicineMutation.isPending}
                            >
                                {deleteMedicineMutation.isPending ? (
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
        </PageContainer>
    );
}