import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

export function useAutoAgeCalculation() {
  const { watch, setValue } = useFormContext();
  const watchDob = watch("patientDetails.dob");

  useEffect(() => {
    if (watchDob) {
      const birthDate = new Date(watchDob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age >= 0 && age <= 150) {
        setValue("patientDetails.age", age, { shouldValidate: true });
      }
    }
  }, [watchDob, setValue]);
}