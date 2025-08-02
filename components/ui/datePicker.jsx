
"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function Calendar22({ value, onChange, placeholder = "Select date", disabled }) {
  const [open, setOpen] = React.useState(false)

  const selectedDate = value ? new Date(value) : undefined;

  return (
    <div className="flex flex-col gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="dob-date-picker"
            className="w-48 justify-between font-normal cursor-pointer"
            disabled={disabled}
          >
            {selectedDate ? format(selectedDate, "PPP") : <span>{placeholder}</span>}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            captionLayout="dropdown"
            onSelect={(date) => {
              onChange(date ? date.toISOString() : null);
              setOpen(false)
            }}
            disabled={disabled}
            fromYear={1900}
            toYear={new Date().getFullYear()}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}