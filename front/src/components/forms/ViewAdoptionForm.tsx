import { useState, useEffect } from "react";
import {usePet} from '../Pets/PetContext';
import { useParams } from "react-router-dom";


type Form ={
  form_id?: Number;
  form_type: string;
  previous_pet_experience: string,
  status: string,
  processed: Boolean,
  pet_id: number,
  user_id: number,
  adoption_reason: string,
  ideal_pet_qualities: string,
  max_alone_time: string,
  care_plan_details: string,
  financial_responsibility: Boolean,
  pet_care_agreement: Boolean,
  adoption_agreement: Boolean,
  submitted_at: string,
  first_name: string
  last_name: string,
  email: string,
  phone_number: string,
  address: string,
  city: string,
  state: string,
  zip_code: string,
  household_size: number,
  household_allergies: string,
  current_pets: string
}

function ViewAdoptionForm() {
   const [form, setForm] = useState<Form | null>(null);
   const { adoptionFormId } = useParams();
  const{  getName } = usePet();


  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await fetch(`/api/forms/adoption/${adoptionFormId}`);
        const data = await response.json();
        
        if (data.result && data.result.length > 0) {
          setForm(data.result[0]);
        }
      } catch (error) {
        console.log("Error fetching form data:", error);
      }
    };

    fetchFormData();
  }, [adoptionFormId]);

  
  const handleApprove = async () => {
    try {

      setForm((prevForm) => {
        if (prevForm) {
          return { ...prevForm, status: 'APPROVED', processed: true };
        }
        return prevForm;
      });
    } catch (error) {
      console.log("Error approving form: ", error);
    }
  }

  const handleDeny = async () => {
    try {

      setForm((prevForm) => {
        if (prevForm) {
          return { ...prevForm, status: 'DENIED', processed: true };
        }
        return prevForm;
      });
    } catch (error) {
      console.log("Error approving form: ", error);
    }
  }

  return (
    <div>
      {form ? (
        <>
      <h1>View Adoption Form for {getName(form.pet_id)}</h1>
      <div>
                <div id="formwrapper">
                    <div className="formsubwrap" id="formsubwrap1">
                        <div>Status: {form.status}</div>
                        <div>First Name: {form.first_name}</div>
                        <br/>
                        <div>Last Name: {form.last_name}</div>
                        <br/>
                        <div>Email: {form.email}</div>
                        <br/>
                        <div>Phone Number: {form.phone_number}</div>
                        <br/>
                        <div>Address: {form.address}</div>
                        <div>{form.city}</div>
                        <div>{form.state}</div>
                        <div>{form.zip_code}</div>
                        <br/>
                        <div>Household Size: {form.household_size}</div>
                        <br/>
                        <div>Household Allergies: {form.household_allergies}</div>
                        <br/>
                        <div>Current Pets: {form.current_pets}</div>
                        <br/>
                        <div>Previous Pet Experience: {form.previous_pet_experience}</div>
                        <br/>
                        <div>Adoption Reason: {form.adoption_reason}</div>
                        <br/>
                        <div>Ideal qualities in a pet: {form.ideal_pet_qualities}</div>
                        <br/>
                        <div>Maximum alone time: {form.max_alone_time}</div>
                        <br/>
                        <div>Pet care plans: {form.care_plan_details}</div>
                        <br/>
                        <div>Agreed to financial Responsability: {form.financial_responsibility ? "Agreed" : "Did not agree"}</div>
                        <div>Agreed to humane treatment: {form.pet_care_agreement ? "Agreed" : "Did not agree"}</div>
                        <div>Agreed to truthfulness of answers: {form.adoption_agreement ? "Agreed" : "Did not agree"}</div>
                        <br/>
                    </div>
                    <div className='formsubwrap' id="formsubwrap3">
                      {!form.processed && (
                        <div>
                          <button onClick={handleApprove}>Approve</button>
                          <button onClick={handleDeny}>Deny</button>
                        </div>
                      )}
                    </div>
                </div>
            </div>
            </>
     ) : (
      <div>Loading form details...</div>
    )}
    </div>
  );
};




export default ViewAdoptionForm;