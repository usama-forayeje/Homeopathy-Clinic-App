
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { instructionSchema } from "@/schemas/instructionSchema"; // Changed schema import
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
import { useParams } from "next/navigation";
import { useMedicineInstruction, useMedicineInstructionMutations } from "@/hooks/useMedicineInstructions";
import { VoiceInput } from "@/components/common/VoiceInput";

export default function EditInstructionPage() {

  const router = useRouter();
  const params = useParams();
  const instructionId = params.instructionId;

  // useMedicineInstruction hook এবং useMedicineInstructionMutations hook এখানে ঠিক আছে
  const { data: instruction, isLoading, isError, error } = useMedicineInstruction(instructionId);
  const { updateMedicineInstructionMutation } = useMedicineInstructionMutations();

  const form = useForm({
    resolver: zodResolver(instructionSchema),
    defaultValues: {
      instructionText: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (instruction) {
      form.reset({
        instructionText: instruction.instructionText,
        notes: instruction.notes || "",
      });
    }
  }, [instruction, form]);

  const onSubmit = (data) => {
    updateMedicineInstructionMutation.mutate({ instructionId, data }, {
      onSuccess: () => {
        router.push("/dashboard/instructions");
      },
      onError: (mutationError) => {
        console.error("Failed to update instruction:", mutationError);
      }
    });
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-lg">Loading instruction data...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold text-red-500">Error loading instruction!</h2>
        <p className="text-muted-foreground">{error?.message || "An unknown error occurred."}</p>
        <Button onClick={() => router.push("/dashboard/medicine-instructions")} className="mt-4"> {/* FIX: সঠিক রিডাইরেক্ট পাথ */}
          Go to Instructions List
        </Button>
      </div>
    );
  }


  if (!instruction) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold text-orange-500">Instruction Not Found!</h2>
        <p className="text-muted-foreground">The instruction with ID &quot;{instructionId}&quot; does not exist or has been deleted.</p>
        <Button onClick={() => router.push("/dashboard/medicine-instructions")} className="mt-4"> {/* FIX: সঠিক রিডাইরেক্ট পাথ */}
          Go to Instructions List
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Edit Medicine Instruction: {instruction.instructionText}</h1>
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

          <Button type="submit" className="w-full cursor-pointer" disabled={updateMedicineInstructionMutation.isPending}>
            {updateMedicineInstructionMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {updateMedicineInstructionMutation.isPending ? "Updating..." : "Update Instruction"}
          </Button>
        </form>
      </Form>
    </div>
  );
}