"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useEffect, useCallback } from "react"; 
import { VoiceInput } from "../common/VoiceInput";

import { habitDefinitionSchema } from "@/schemas/habitDefinitionSchema";

export function HabitDefinitionForm({ onSubmit, defaultValues, isLoading, buttonText = "Save" }) {
  const parseOptionsForForm = useCallback((options) => {
    if (typeof options === 'string' && options.startsWith('[') && options.endsWith(']')) {
      try {
        const parsed = JSON.parse(options);
        return Array.isArray(parsed) ? parsed.join(", ") : "";
      } catch (e) {
        console.error("Failed to parse options JSON string:", e);
        return "";
      }
    }
    if (Array.isArray(options)) {
      return options.join(", ");
    }
    return options || "";
  }, []);

  const form = useForm({
    resolver: zodResolver(habitDefinitionSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      inputType: defaultValues?.inputType || "text",
      options: parseOptionsForForm(defaultValues?.options),
      description: defaultValues?.description || "",
      isActive: defaultValues?.isActive ?? true,
    },
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset({
        name: defaultValues.name || "",
        inputType: defaultValues.inputType || "text",
        options: parseOptionsForForm(defaultValues.options),
        description: defaultValues.description || "",
        isActive: defaultValues.isActive ?? true,
      }, { keepDirty: false, keepValues: false });
    }
  }, [defaultValues, form, parseOptionsForForm]);

  const inputType = form.watch("inputType");

  const handleSubmit = (values) => {
    const dataToSubmit = { ...values };

    if (dataToSubmit.inputType === "select") {
      try {
        dataToSubmit.options = JSON.stringify(
          dataToSubmit.options
            ? dataToSubmit.options.split(",").map((s) => s.trim()).filter(s => s !== "")
            : []
        );
      } catch (e) {
        console.error("Failed to parse options string for submission:", e);
        dataToSubmit.options = "[]";
      }
    } else {
      dataToSubmit.options = null;
    }

    if (dataToSubmit.description === "") {
      dataToSubmit.description = null;
    }

    onSubmit(dataToSubmit);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Habit Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Habit Name</FormLabel>
              <FormControl>
                <VoiceInput
                  component={Input}
                  placeholder="e.g., Drink water, Read a book"
                  value={field.value || ""}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Input Type and Active Switch - Side by Side and Aligned */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Type Dropdown */}
          <FormField
            control={form.control}
            name="inputType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Input Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an input type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="text">Text (e.g., journal entry)</SelectItem>
                    <SelectItem value="number">Number (e.g., glasses of water)</SelectItem>
                    <SelectItem value="select">Select (e.g., mood: happy, sad)</SelectItem>
                    <SelectItem value="boolean">Boolean (e.g., did workout: Yes/No)</SelectItem>
                    <SelectItem value="scale">Scale (e.g., pain level 1-10)</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  How will the patient track this habit?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-col md:flex-row md:items-center justify-between rounded-lg border p-4 shadow-sm mt-auto">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Active
                  </FormLabel>
                  <FormDescription>
                    If disabled, this habit definition will not be available.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-label="Toggle habit definition active status"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Conditionally render options field only for 'select' type */}
        {inputType === "select" && (
          <FormField
            control={form.control}
            name="options"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Options (comma-separated)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Happy, Neutral, Sad"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>
                  Enter options separated by commas (e.g., "Option1, Option2, Option3").
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <VoiceInput
                  component={Textarea}
                  placeholder="A brief description of the habit"
                  value={field.value || ""}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isLoading ? "Saving..." : buttonText}
        </Button>
      </form>
    </Form>
  );
}