import { useMutation, useQueryClient } from '@tanstack/react-query';
import patientHabitsService from '@/services/patientHabits';
import { toast } from 'sonner';



export function usePatientHabitMutations() {
  const queryClient = useQueryClient();

  const createPatientHabitMutation = useMutation({
    mutationFn: patientHabitsService.createPatientHabit,
    onSuccess: (newHabit) => {
      queryClient.invalidateQueries({ queryKey: ['patientHabits', newHabit.patientId, newHabit.consultationId] });
      toast.success('Patient habit added successfully!');
    },
    onError: (error) => {
      console.error("Failed to add patient habit:", error);
      toast.error(`Failed to add patient habit: ${error.message}`);
    },
  });

  const updatePatientHabitMutation = useMutation({
    mutationFn: ({ habitId, data }) => patientHabitsService.updatePatientHabit(habitId, data),
    onSuccess: (updatedHabit) => {
      queryClient.invalidateQueries({ queryKey: ['patientHabits', updatedHabit.patientId, updatedHabit.consultationId] });
      queryClient.invalidateQueries({ queryKey: ['patientHabit', updatedHabit.$id] });
      toast.success('Patient habit updated successfully!');
    },
    onError: (error) => {
      console.error("Failed to update patient habit:", error);
      toast.error(`Failed to update patient habit: ${error.message}`);
    },
  });

  const deletePatientHabitMutation = useMutation({
    mutationFn: patientHabitsService.deletePatientHabit,
    onSuccess: (_, habitId) => {
      // ডিলিট করার পর রোগীর এবং কনসাল্টেশন আইডি দিয়ে কোয়েরি ইনভ্যালিডেট করতে হবে
      // এটি করার জন্য আপনাকে habitId থেকে patientId/consultationId বের করতে হবে,
      // অথবা ডিলিট ফাংশনে সেগুলো আর্গুমেন্ট হিসেবে পাস করতে হবে।
      // আপাতত সব patientHabits ইনভ্যালিডেট করে দিচ্ছি
      queryClient.invalidateQueries({ queryKey: ['patientHabits'] });
      toast.success('Patient habit deleted successfully!');
    },
    onError: (error) => {
      console.error("Failed to delete patient habit:", error);
      toast.error(`Failed to delete patient habit: ${error.message}`);
    },
  });



  return { createPatientHabitMutation, updatePatientHabitMutation, deletePatientHabitMutation };
}