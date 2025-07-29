import { PatientDetailsPage } from "@/components/patients/PatientDetailsPage"

export default function PatientDetails({ params }) {
  return <PatientDetailsPage patientId={params.patientId} />
}
