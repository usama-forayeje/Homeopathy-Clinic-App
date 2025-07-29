"use client"

import { safeParseJSON } from "@/lib/utils"
import { useFormContext, useFieldArray } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Activity, CheckCircle2, Plus, X, ArrowLeft } from "lucide-react"
import { VoiceInput } from "../common/VoiceInput"

export function HabitForm({ onPreviousTab, habitDefinitions }) {
  const form = useFormContext()

  const {
    fields: habitFields,
    append: appendHabit,
    remove: removeHabit,
  } = useFieldArray({
    control: form.control,
    name: "patientHabits",
  })

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
            <Activity className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </div>
          Patient Habits Tracking
        </CardTitle>
        <CardDescription>Track lifestyle habits and health patterns</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Available Habits */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Available Habits</h3>
          <ScrollArea className="h-[300px] w-full rounded-lg border p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {habitDefinitions.map((habitDef) => {
                const isSelected = habitFields.some(
                  (field) =>
                    form.watch(`patientHabits.${habitFields.indexOf(field)}.habitDefinitionId`) === habitDef.$id,
                )

                return (
                  <Card
                    key={habitDef.$id}
                    className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                      isSelected
                        ? "bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800"
                        : "hover:bg-accent/50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{habitDef.name}</h4>
                        {habitDef.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{habitDef.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {habitDef.inputType}
                          </Badge>
                          {isSelected && (
                            <Badge variant="default" className="text-xs">
                              Selected
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant={isSelected ? "secondary" : "outline"}
                        size="icon"
                        className="w-8 h-8 ml-2 flex-shrink-0"
                        onClick={() => {
                          if (!isSelected) {
                            appendHabit({ habitDefinitionId: habitDef.$id, value: "", notes: "" })
                          }
                        }}
                        disabled={isSelected}
                      >
                        {isSelected ? <CheckCircle2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      </Button>
                    </div>
                  </Card>
                )
              })}
            </div>
          </ScrollArea>
        </div>

        <Separator />

        {/* Selected Habits */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Selected Habits ({habitFields.length})</h3>

          {habitFields.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No habits selected</p>
              <p className="text-sm">Choose from the available habits above</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {habitFields.map((fieldItem, index) => {
                const selectedHabitDef = habitDefinitions.find(
                  (def) => def.$id === form.watch(`patientHabits.${index}.habitDefinitionId`),
                )
                const options = safeParseJSON(selectedHabitDef?.options) || []

                return (
                  <Card key={fieldItem.id} className="p-4 border-l-4 border-l-orange-500">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-base">{selectedHabitDef?.name || "Unknown Habit"}</h4>
                        {selectedHabitDef?.description && (
                          <p className="text-sm text-muted-foreground mt-1">{selectedHabitDef.description}</p>
                        )}
                        <Badge variant="outline" className="mt-2 text-xs">
                          {selectedHabitDef?.inputType}
                        </Badge>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeHabit(index)}
                        className="w-8 h-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {/* Value Field */}
                      <FormField
                        control={form.control}
                        name={`patientHabits.${index}.value`}
                        render={({ field: valueField }) => {
                          let InputComponent = null

                          switch (selectedHabitDef?.inputType) {
                            case "text":
                              InputComponent = (
                                <VoiceInput
                                  component={Input}
                                  placeholder="Enter value"
                                  className="h-11"
                                  {...valueField}
                                />
                              )
                              break
                            case "number":
                              InputComponent = (
                                <Input type="number" placeholder="Enter number" className="h-11" {...valueField} />
                              )
                              break
                            case "select":
                              InputComponent = (
                                <Select onValueChange={valueField.onChange} value={valueField.value}>
                                  <SelectTrigger className="h-11">
                                    <SelectValue placeholder="Select option" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {options.map((option, i) => (
                                      <SelectItem key={i} value={option}>
                                        {option}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )
                              break
                            case "boolean":
                              InputComponent = (
                                <Select onValueChange={valueField.onChange} value={valueField.value}>
                                  <SelectTrigger className="h-11">
                                    <SelectValue placeholder="Select Yes/No" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Yes">
                                      <div className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        Yes
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="No">
                                      <div className="flex items-center gap-2">
                                        <X className="h-4 w-4 text-red-500" />
                                        No
                                      </div>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              )
                              break
                            case "scale":
                              InputComponent = (
                                <Select onValueChange={valueField.onChange} value={valueField.value}>
                                  <SelectTrigger className="h-11">
                                    <SelectValue placeholder="Rate 1-10" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                      <SelectItem key={num} value={num.toString()}>
                                        <div className="flex items-center gap-2">
                                          <span className="font-mono">{num}</span>
                                          <div className="flex">
                                            {Array.from({ length: num }, (_, i) => (
                                              <div key={i} className="w-2 h-2 bg-orange-400 rounded-full mr-0.5" />
                                            ))}
                                          </div>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )
                              break
                            default:
                              InputComponent = <Input placeholder="Enter value" className="h-11" {...valueField} />
                          }

                          return (
                            <FormItem>
                              <FormLabel className="font-medium">Value *</FormLabel>
                              <FormControl>{InputComponent}</FormControl>
                              <FormMessage />
                            </FormItem>
                          )
                        }}
                      />

                      {/* Notes Field */}
                      <FormField
                        control={form.control}
                        name={`patientHabits.${index}.notes`}
                        render={({ field: notesField }) => (
                          <FormItem>
                            <FormLabel className="font-medium">Additional Notes</FormLabel>
                            <FormControl>
                              <VoiceInput
                                component={Textarea}
                                placeholder="Add context or observations"
                                className="min-h-[80px] resize-none"
                                {...notesField}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={() => onPreviousTab("prescription")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="text-sm text-muted-foreground flex items-center">
            <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
            Ready to submit
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
