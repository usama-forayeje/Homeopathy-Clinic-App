// app/dashboard/medicines/add/page.jsx
"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { medicineSchema } from "@/schemas/medicineSchema";
// Import your provided hook
import { useMedicinesMutations } from "@/hooks/useMedicines";
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
import { VoiceInput } from "@/components/common/VoiceInput";

export default function AddMedicinePage() {
  const router = useRouter();
  const { createMedicineMutation } = useMedicinesMutations(); // Destructure the mutation

  const form = useForm({
    resolver: zodResolver(medicineSchema),
    defaultValues: {
      medicineName: "",
      description: "",
      potency: "",
    },
  });

  const onSubmit = (data) => {
    createMedicineMutation.mutate(data, {
      onSuccess: () => {
        router.push("/dashboard/medicines"); // Redirect to list on success
      },
    });
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Add New Medicine</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-lg mx-auto p-6 border rounded-lg shadow-sm">
          <FormField
            control={form.control}
            name="medicineName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Medicine Name</FormLabel>
                <FormControl>
                  <VoiceInput
                    component={Input}
                    placeholder="Enter medicine name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <VoiceInput
                    component={Textarea}
                    placeholder="Describe the medicine (optional)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="potency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Potency</FormLabel>
                <FormControl>
                  <VoiceInput
                    component={Input}
                    placeholder="e.g., 30C, 200C (optional)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={createMedicineMutation.isPending}>
            {createMedicineMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {createMedicineMutation.isPending ? "Adding..." : "Add Medicine"}
          </Button>
        </form>
      </Form>
    </div>
  );
}