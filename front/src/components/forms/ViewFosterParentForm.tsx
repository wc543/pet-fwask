import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from '../AuthContext';

type Form = {
  foster_parent_form_id?: number;
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

function ViewFosterParentForm() {
  const [form, setForm] = useState<Form | null>(null);
  const auth = useContext(AuthContext);
  const { fosterParentFormId } = useParams();

  console.log(auth?.user);


  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await fetch(`/api/forms/foster-parent/${fosterParentFormId}`);
        const data = await response.json();
        
        if (data.result && data.result.length > 0) {
          setForm(data.result[0]);
        }
      } catch (error) {
        console.log("Error fetching form data: ", error);
      }
    };

    fetchFormData();
  }, [fosterParentFormId]);

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
      <h1>View Foster Parent Application</h1>
      <div>
                <div>
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
                        <div>Agreed to humane treatment: {form.pet_care_agreement ? "Agreed" : "Did not agree"}</div>
                        <div>Agreed to truthfulness of answers: {form.adoption_agreement ? "Agreed" : "Did not agree"}</div>
                        <br/>
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


export default ViewFosterParentForm;
