// app/dashboard/medicines/edit/[medicineId]/page.jsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { medicineSchema } from "@/schemas/medicineSchema";
// Import your provided hooks
import { useMedicine, useMedicinesMutations } from "@/hooks/useMedicines";
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
import { VoiceInput } from "@/components/common/VoiceInput";

export default function EditMedicinePage() {
  const router = useRouter();
  const params = useParams();
  const medicineId = params.medicineId; // Get medicineId from dynamic route

  const { data: medicine, isLoading, isError, error } = useMedicine(medicineId);
  const { updateMedicineMutation } = useMedicinesMutations(); // Destructure the mutation

  const form = useForm({
    resolver: zodResolver(medicineSchema),
    defaultValues: {
      medicineName: "",
      description: "",
      potency: "",
    },
  });

  // Populate form fields when medicine data is loaded
  useEffect(() => {
    if (medicine) {
      form.reset({
        medicineName: medicine.medicineName,
        description: medicine.description || "",
        potency: medicine.potency || "",
      });
    }
  }, [medicine, form]);

  const onSubmit = (data) => {
    updateMedicineMutation.mutate({ medicineId, data }, {
      onSuccess: () => {
        router.push("/dashboard/medicines"); // Redirect to list on success
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-lg">Loading medicine data...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold text-red-500">Error loading medicine!</h2>
        <p className="text-muted-foreground">{error?.message || "An unknown error occurred."}</p>
        <Button onClick={() => router.push("/dashboard/medicines")} className="mt-4">
          Go to Medicines List
        </Button>
      </div>
    );
  }

  if (!medicine) {
    // This case usually means the ID was valid but no medicine was found.
    // React Query's `data` will be undefined if getDocument returns 404.
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold text-orange-500">Medicine Not Found!</h2>
        <p className="text-muted-foreground">The medicine with ID &quot;{medicineId}&quot; does not exist or has been deleted.</p>
        <Button onClick={() => router.push("/dashboard/medicines")} className="mt-4">
          Go to Medicines List
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Edit Medicine: {medicine.medicineName}</h1>
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

          <Button type="submit" className="w-full" disabled={updateMedicineMutation.isPending}>
            {updateMedicineMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {updateMedicineMutation.isPending ? "Updating..." : "Update Medicine"}
          </Button>
        </form>
      </Form>
    </div>
  );
}