'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { ChamberForm } from '@/components/forms/ChamberForm';
import { useChamberMutations } from '@/hooks/useChambers';
import { useState } from 'react';

export function AddChamberModal() {
    const { createChamberMutation } = useChamberMutations();
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = async (values) => {
        try {
            await createChamberMutation.mutateAsync(values);
            setIsOpen(false);
        } catch (error) {
            console.error("Modal is not updated:", error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />New Chamber
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Chamber</DialogTitle>
                    <DialogDescription>
                        Add a new chamber to the database by filling out the form below.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <ChamberForm
                        onSubmit={handleSubmit}
                        isLoading={createChamberMutation.isPending}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}