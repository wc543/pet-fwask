import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {usePet} from '../Pets/PetContext';
import { Dayjs } from 'dayjs';

type Form = {
  foster_pet_form_id?: number;
  user_id: number;
  pet_id: number
  foster_reason: string;
  previous_pet_experience: string;
  foster_start_date: Dayjs | null;
  foster_end_date: Dayjs | null;
  max_alone_time: string;
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
  const{  getName } = usePet();

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await fetch(`/api/forms/foster-pet/${fosterPetFormId}`);
        const data = await response.json();
        
        console.log("view foster pet");
        console.log(data.result[0].email);
        if (data.result && data.result.length > 0) {
          setForm(data.result[0])
        }
      } catch (error) {
        console.log("Error fetching form data:", error);
      }
    };

    fetchFormData();
  }, [fosterPetFormId]);

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
                        <div>Foster Reason: {form.foster_reason}</div>
                        <br/>
                        <div>Maximum alone time: {form.max_alone_time}</div>
                    </div>
                    <div className='formsubwrap' id="formsubwrap3">
                      {!form.processed && (auth?.user.role === 'STAFF') && (
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

export default ViewFosterPetForm;
