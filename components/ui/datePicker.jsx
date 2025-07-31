// components/ui/date-picker.jsx
"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// এই উপাদানটি এখন একটি কাস্টম ইনপুট হিসাবে কাজ করবে, নিজস্ব ফর্ম বা onSubmit ফাংশন থাকবে না।
export function DatePicker({ value, onSelect, placeholder = "Select a date", disabled }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] pl-3 text-left font-normal",
            !value && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          {value ? format(new Date(value), "PPP") : <span>{placeholder}</span>}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value ? new Date(value) : undefined}
          onSelect={(date) => {
            // date-fns Calendar onSelect returns a Date object or undefined
            // We convert it to ISO string for consistency, or null if no date selected
            onSelect(date ? date.toISOString() : null);
          }}
          disabled={disabled}
          captionLayout="dropdown" // Add dropdowns for month/year selection
          fromYear={1900} // Set a reasonable start year for DOB
          toYear={new Date().getFullYear()} // Current year as end year
        />
      </PopoverContent>
    </Popover>
  );
}