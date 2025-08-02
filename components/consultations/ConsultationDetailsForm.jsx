// components/consultations/ConsultationDetailsForm.jsx
import React from 'react';
import { useFormContext, Controller, useFieldArray } from 'react-hook-form'; // useFormContext এবং Controller, useFieldArray ইম্পোর্ট করুন
import { CalendarIcon, Plus, Minus } from 'lucide-react'; // আইকন ইম্পোর্ট করুন
import { format } from 'date-fns'; // তারিখ ফরম্যাট করার জন্য

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar'; // আপনার Calendar component
import { Badge } from '@/components/ui/badge'; // ব্যাজ কম্পোনেন্ট

// একটি ইনপুট ফিল্ডের সাথে Add/Remove বাটন
const TagInput = ({ name, label, control, placeholder }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: name,
  });

  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue && !fields.some(field => field.value === inputValue)) { // ডুপ্লিকেট চেক
      append(inputValue);
      setInputValue('');
    }
  };

  const handleRemove = (index) => {
    remove(index);
  };

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <div className="flex space-x-2">
        <Input
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAdd();
            }
          }}
        />
        <Button type="button" size="sm" onClick={handleAdd}>
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {fields.map((field, index) => (
          <Badge key={field.id} variant="secondary" className="pr-1">
            {field.value}
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="ml-1 text-xs leading-none"
            >
              <Minus className="h-3 w-3 inline-block" />
            </button>
          </Badge>
        ))}
      </div>
      <FormMessage />
    </FormItem>
  );
};


export function ConsultationDetailsForm({ onNextTab, onPreviousTab, chambers }) {
  const { control, formState: { errors }, watch } = useFormContext(); // form context ব্যবহার করুন
  const currentConsultationDate = watch("consultationDetails.consultationDate");
  const currentFollowUpDate = watch("consultationDetails.followUpDate");


  return (
    <Card>
      <CardHeader>
        <CardTitle>Consultation Details</CardTitle>
        <CardDescription>Enter the details of the patient's current consultation.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Consultation Date */}
          <FormField
            control={control}
            name="consultationDetails.consultationDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Consultation Date <span className="text-red-500">*</span></FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className="w-full pl-3 text-left font-normal"
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : null}
                      onSelect={(date) => field.onChange(date ? date.toISOString() : "")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Chamber */}
          <FormField
            control={control}
            name="consultationDetails.chamberId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chamber <span className="text-red-500">*</span></FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a chamber" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {chambers.map((chamber) => (
                      <SelectItem key={chamber.id} value={chamber.id}>
                        {chamber.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Bill Amount */}
          <FormField
            control={control}
            name="consultationDetails.billAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bill Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Symptoms */}
          <FormField
            control={control}
            name="consultationDetails.symptoms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Symptoms</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe symptoms..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* BP */}
          <FormField
            control={control}
            name="consultationDetails.BP"
            render={({ field }) => (
              <FormItem>
                <FormLabel>BP (Blood Pressure)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 120/80 mmHg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Pulse */}
          <FormField
            control={control}
            name="consultationDetails.Pulse"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pulse</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 72 bpm" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Temp */}
          <FormField
            control={control}
            name="consultationDetails.Temp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Temp (Temperature)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 98.6°F" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* O_E (On Examination) */}
          <FormField
            control={control}
            name="consultationDetails.O_E"
            render={({ field }) => (
              <FormItem>
                <FormLabel>O/E (On Examination)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Findings on examination..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* History of Present Illness */}
          <FormField
            control={control}
            name="consultationDetails.historyOfPresentIllness"
            render={({ field }) => (
              <FormItem>
                <FormLabel>History of Present Illness</FormLabel>
                <FormControl>
                  <Textarea placeholder="Details of current illness..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Advice (General) */}
          <FormField
            control={control}
            name="consultationDetails.advice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>General Advice</FormLabel>
                <FormControl>
                  <Textarea placeholder="Any general advice for the patient..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Follow-up Date */}
          <FormField
            control={control}
            name="consultationDetails.followUpDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Follow-up Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className="w-full pl-3 text-left font-normal"
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP")
                        ) : (
                          <span>Pick a follow-up date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : null}
                      onSelect={(date) => field.onChange(date ? date.toISOString() : "")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Consultation Notes (General) */}
          <FormField
            control={control}
            name="consultationDetails.notes"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-2">
                <FormLabel>Consultation Notes</FormLabel>
                <FormControl>
                  <Textarea placeholder="Any additional notes for this consultation..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Chief Complaints (Array Input) */}
          <TagInput
            name="consultationDetails.chiefComplaints"
            label="Chief Complaints"
            control={control}
            placeholder="Add chief complaint"
          />

          {/* Diagnosis (Array Input) */}
          <TagInput
            name="consultationDetails.diagnosis"
            label="Diagnosis"
            control={control}
            placeholder="Add diagnosis"
          />

          {/* Other Complaints (Array Input) */}
          <TagInput
            name="consultationDetails.otherComplaints"
            label="Other Complaints"
            control={control}
            placeholder="Add other complaints"
          />
        </div>


        <div className="flex justify-between mt-6">
          <Button type="button" variant="outline" onClick={onPreviousTab}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back: Patient Details
          </Button>
          <Button type="button" onClick={onNextTab}>
            Next: Prescription <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}