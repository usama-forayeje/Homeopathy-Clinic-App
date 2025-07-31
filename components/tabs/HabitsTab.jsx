// components/PatientConsultationForm/HabitsTab.jsx
"use client"

import { useFormContext } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Plus, Minus } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useEffect } from "react"

export function HabitsTab({
  habitDefinitions,
  habitFields,
  appendHabit,
  removeHabit,
}) {
  const form = useFormContext()

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Patient Habits & Lifestyle</h3>
      <p className="text-sm text-muted-foreground">
        Track relevant habits that may impact patient's health.
      </p>

      {habitFields.map((item, index) => (
        <div key={item.id} className="space-y-4 border p-4 rounded-md">
          <div className="flex justify-between items-center">
            <h4 className="text-md font-medium">Habit #{index + 1}</h4>
            <Button type="button" variant="destructive" size="sm" onClick={() => removeHabit(index)}>
              <Minus className="h-4 w-4 mr-2" /> Remove Habit
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name={`patientHabits.${index}.habitDefinitionId`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Habit Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a habit type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {habitDefinitions.map((habitDef) => (
                        <SelectItem key={habitDef.$id} value={habitDef.$id}>
                          {habitDef.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`patientHabits.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value/Details</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 5 cigarettes/day, 3 times/week" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`patientHabits.${index}.frequency`} // New field
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequency</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Daily, Weekly, Occasionally" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`patientHabits.${index}.duration`} // New field
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 5 years, Since childhood" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`patientHabits.${index}.status`} // New field
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Stopped">Stopped</SelectItem>
                      <SelectItem value="Reduced">Reduced</SelectItem>
                      <SelectItem value="Unknown">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`patientHabits.${index}.habitType`} // New field
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                      <SelectItem value="Addiction">Addiction</SelectItem>
                      <SelectItem value="Dietary">Dietary</SelectItem>
                      <SelectItem value="Physical">Physical</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name={`patientHabits.${index}.notes`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes for this habit</FormLabel>
                <FormControl>
                  <Textarea placeholder="Any additional notes about this specific habit..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ))}

      <Button type="button" variant="outline" onClick={() => appendHabit({
        habitDefinitionId: habitDefinitions.length > 0 ? habitDefinitions[0].$id : "", // Default to first available habit def
        value: "",
        frequency: "",
        duration: "",
        status: "Active",
        habitType: "Lifestyle",
        notes: "",
        patientId: form.getValues("patientDetails.$id") || "", // Will be set on submit
        consultationId: form.getValues("consultationDetails.$id") || "", // Will be set on submit
        recordedDate: new Date().toISOString(), // Current date
      })}>
        <Plus className="h-4 w-4 mr-2" /> Add New Habit
      </Button>
    </div>
  )
}