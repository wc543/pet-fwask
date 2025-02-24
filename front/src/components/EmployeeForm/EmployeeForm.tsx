import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EmployeeForm.css';

interface Form {
  form_id?: number;
  adoption_form_id?: number;
  foster_parent_form_id?: number;
  foster_pet_form_id?: number;
  user_id: number;
  processed: boolean;
  form_type: string;
}

const EmployeeForm: React.FC = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchForms = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch("/api/forms");
      if (!response.ok) {
        throw new Error("Failed to fetch forms");
      }

      const data = await response.json();
      console.log(data);

      setForms(data);
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
              <th>Submitted By (User ID)</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {forms.length > 0 ? (
              forms.map((form, index) => (
                <tr key={`${form.form_type}-${form.adoption_form_id || form.foster_parent_form_id || form.foster_pet_form_id || index}`}>
                  <td>{form.form_type}</td>
                  <td>{form.user_id}</td>
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

export default EmployeeForm;