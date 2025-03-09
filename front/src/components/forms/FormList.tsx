import React, { useEffect, useState , useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import './FormList.css';
import {AuthContext} from '../AuthContext'
import { useUser } from '../Users/UserContext';

interface Form {
  form_id?: number;
  adoption_form_id?: number;
  foster_parent_form_id?: number;
  foster_pet_form_id?: number;
  user_id: number;
  processed: boolean;
  form_type: string;
}

const FormList: React.FC = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const { getFullname} = useUser();
  const fetchForms = async () => {
    try {
      setLoading(true);
      setError('');
      var userId=auth?.user.user_id
      
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
    const formId = form.adoption_form_id || form.foster_parent_form_id || form.foster_pet_form_id;
    navigate(`/forms/${form.form_type}/${formId}`);
  };

  return (
    <div>
      <h2>Forms Submitted</h2>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Form Type</th>
              <th>Submitted By</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {forms.length > 0 ? (
              forms.map((form, index) => (
                <tr key={`${form.form_type}-${form.adoption_form_id || form.foster_parent_form_id || form.foster_pet_form_id || index}`}>
                  <td>{form.form_type}</td>
                  <td>{getFullname(form.user_id)}</td>
                  <td>{form.processed ? "Processed" : "Pending"}</td>
                  <td>
                    <button onClick={() => handleViewForm(form)}>View</button>
                  </td>
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