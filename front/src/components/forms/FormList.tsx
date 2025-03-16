import React, { useEffect, useState , useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import './FormList.css';
import { useUser } from '../Users/UserContext';
import {usePet} from '../Pets/PetContext';
import { useParams } from "react-router-dom";
import { Typography, Button } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface Form {
  form_id?: number;
  adoption_form_id?: number;
  foster_parent_form_id?: number;
  foster_pet_form_id?: number;
  user_id: number;
  processed: boolean;
  form_type: string;
  pet_id: number;
}

const FormList: React.FC = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { getFullname} = useUser();
  const {getName} = usePet();
  const {userId} = useParams();
  const fetchForms = async () => {
    try {
      setLoading(true);
      setError('');

      if (!userId) {
        throw new Error("Failed to fetch forms, userID is null");
      }
      
      const adoptionResponse = await fetch(`/api/forms/adoptionList/${userId}`);
      const fosterPetResponse = await fetch(`/api/forms/fosterPetList/${userId}`);
      const fosterParentResponse = await fetch(`/api/forms/fosterParentList/${userId}`);
      if (!adoptionResponse.ok || !fosterPetResponse.ok || !fosterParentResponse.ok) {
        throw new Error("Failed to fetch forms");
      }

      const adoptionData = await adoptionResponse.json();
      const fosterPetData = await fosterPetResponse.json();
      const fosterParentData = await fosterParentResponse.json();

      const allFormData = adoptionData.result.concat(fosterPetData.result, fosterParentData.result)

      console.log("data");
      console.log(allFormData);

      setForms(allFormData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch forms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  const handleViewForm = (form: Form) => {
    console.log("in handle view form");
    const formId = form.adoption_form_id || form.foster_parent_form_id || form.foster_pet_form_id;
    navigate(`/forms/${form.form_type}/${formId}`);
  };

  return (
    <div id='content'>
      <Typography variant='h4'>Forms Submitted</Typography>
      <Typography variant='body1'>This page displays all the forms you’ve submitted for pet adoption. You can review your past submissions and track the status of your applications. Any pending forms are currently being processed, and our team will reach out to you soon with updates.</Typography>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th><Typography>Form Type</Typography></th>
              <th><Typography>Submitted By</Typography></th>
              <th><Typography>Pet</Typography></th>
              <th><Typography>Status</Typography></th>
              <th><Typography>View</Typography></th>
            </tr>
          </thead>
          <tbody>
            {forms.length > 0 ? (
              forms.map((form, index) => (
                <tr key={`${form.form_type}-${form.adoption_form_id || form.foster_parent_form_id || form.foster_pet_form_id || index}`}>
                  <td><Typography>{form.form_type}</Typography></td>
                  <td><Typography>{getFullname(form.user_id)}</Typography></td>
                  <td><Typography>{form.pet_id ? getName(form.pet_id):"--"}</Typography></td>
                  <td><Typography>{form.processed ? "Processed" : "Needs To Be Process"}</Typography></td>
                  <td><Typography>
                  <Button onClick={()=>handleViewForm(form)}><VisibilityIcon sx={{ color: 'white'}}></VisibilityIcon></Button>
                  </Typography></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>No forms found</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {error && <div style={{ color: 'red' }}>{error}</div>}
    
    </div>
  );
};

export default FormList;