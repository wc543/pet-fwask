import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

type Form = {
  foster_pet_form_id?: number;
  user_id: number;
  foster_reason: string;
  pet_care_agreement: boolean;
  adoption_agreement: boolean;
  submitted_at: string;
  processed: boolean;
  form_type: string;
  status: string;
  first_name: string;
  last_name: string;
  address: string;
  state: string;
  city: string;
  zip_code: string;
  phone_number: string;
  household_size: number;
  household_allergies: string;
  current_pets: string;
  email: string;
};

function ViewFosterPetForm() {
  const [form, setForm] = useState<Form | null>(null);
  const { fosterPetFormId } = useParams();

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await fetch(`/api/forms/foster-pet/${fosterPetFormId}`);
        const data = await response.json();
        
        if (data.result && data.result.length > 0) {
          setForm(data.result[0]);
        }
      } catch (error) {
        console.log("Error fetching form data:", error);
      }
    };

    fetchFormData();
  }, [fosterPetFormId]);

  return (
    <div>
      <h1>View Foster Pet Form</h1>
      {form ? (
        <>
          <div><strong>Form Type:</strong> {form.form_type}</div>
          <div><strong>Previous Pet Experience:</strong> {form.foster_reason}</div>
          <div><strong>Status:</strong> {form.status}</div>
          <div><strong>Processed:</strong> {form.processed ? "Processed" : "Unprocessed"}</div>
          <div><strong>Submitted At:</strong> {form.submitted_at}</div>
        </>
      ) : (
        <div>Loading form details...</div>
      )}
    </div>
  );
}

export default ViewFosterPetForm;
