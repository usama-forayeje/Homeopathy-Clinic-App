"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { instructionSchema } from "@/schemas/instructionSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useMedicineInstructionMutations } from "@/hooks/useMedicineInstructions";
import { VoiceInput } from "@/components/common/VoiceInput";

export default function AddInstructionPage() {
  const router = useRouter();
  const { createMedicineInstructionMutation } = useMedicineInstructionMutations();

  const form = useForm({
    resolver: zodResolver(instructionSchema),
    defaultValues: {
      instructionText: "",
      notes: "",
    },
  });

  const onSubmit = (data) => {
    createMedicineInstructionMutation.mutate(data, {
      onSuccess: () => {
        router.push("/dashboard/instructions"); // Redirect to list on success
      },
    });
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center cursor-pointer">Add New Instruction</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-lg mx-auto p-6 border rounded-lg shadow-sm">
          <FormField
            control={form.control}
            name="instructionText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instruction Text</FormLabel>
                <FormControl>
                  <VoiceInput
                    component={Input}
                    placeholder="Enter instruction text"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes (Optional)</FormLabel>
                <FormControl>
                  <VoiceInput
                    component={Textarea}
                    placeholder="Add any additional notes (optional)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full cursor-pointer" disabled={createMedicineInstructionMutation.isPending}>
            {createMedicineInstructionMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {createMedicineInstructionMutation.isPending ? "Adding..." : "Add Instruction"}
          </Button>
        </form>
      </Form>
    </div>
  );
}