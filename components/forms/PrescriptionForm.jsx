// components/forms/PrescriptionForm.jsx
"use client";

import React, { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Plus, Minus, ArrowLeft, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

const TagInput = ({ name, label, control, placeholder }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: name,
  });

  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim() && !fields.some(field => field.value === inputValue.trim())) {
      append({ value: inputValue.trim() });
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
            {field.value} {/* Object থেকে value রেন্ডার করা হচ্ছে */}
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


export function PrescriptionForm({ onNextTab, onPreviousTab }) {
  const { control } = useFormContext();

  // medicines ফিল্ডের জন্য useFieldArray
  const { fields: medicineFields, append: appendMedicine, remove: removeMedicine } = useFieldArray({
    control,
    name: "prescription.medicines",
  });

  const [medicineName, setMedicineName] = useState('');
  const [medicineDosage, setMedicineDosage] = useState('');

  const handleAddMedicine = () => {
    if (medicineName.trim()) {
      appendMedicine({ name: medicineName.trim(), dosage: medicineDosage.trim() });
      setMedicineName('');
      setMedicineDosage('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prescription Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Medicines Section */}
        <div className="border rounded-md p-4">
          <h3 className="text-lg font-semibold mb-4">Medicines</h3>
          <div className="flex space-x-2 mb-4">
            <Input
              placeholder="Medicine Name"
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddMedicine();
                }
              }}
            />
            <Input
              placeholder="Dosage (e.g., 1+0+1)"
              value={medicineDosage}
              onChange={(e) => setMedicineDosage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddMedicine();
                }
              }}
            />
            <Button type="button" size="sm" onClick={handleAddMedicine}>
              <Plus className="h-4 w-4" /> Add
            </Button>
          </div>
          <div className="space-y-2">
            {medicineFields.map((field, index) => (
              <div key={field.id} className="flex items-center justify-between border rounded-md p-2 bg-gray-50 dark:bg-gray-800">
                <span>
                  **{field.name}** {field.dosage && `(${field.dosage})`}
                </span>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeMedicine(index)}>
                  <Minus className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
            {medicineFields.length === 0 && <p className="text-sm text-gray-500">No medicines added yet.</p>}
          </div>
        </div>

        {/* Dosage Instructions Section (Using TagInput) */}
        <TagInput
          name="prescription.dosageInstructions"
          label="General Dosage Instructions"
          control={control}
          placeholder="Add general instruction"
        />

        {/* Prescription Notes */}
        <FormField
          control={control}
          name="prescription.prescriptionNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prescription Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Any additional notes for the prescription..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between mt-6">
          <Button type="button" variant="outline" onClick={onPreviousTab}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back: Consultation Details
          </Button>
          <Button type="button" onClick={onNextTab}>
            Next: Habits & Allergies <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}