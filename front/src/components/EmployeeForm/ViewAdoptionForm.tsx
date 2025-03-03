import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import {
    useParams,
} from "react-router-dom"

type Form ={
  form_id?: number;
  form_type: string;
}

function ViewAdoptionForm() {
  let [form_type, setFormType] = useState("");
  let {adoptionFormId} = useParams();

  useEffect(() => {
    (async () => {
        try {
          let {
            data: { result },
          } = await axios.get<{ result: Form[]}>(`/api/forms/adoption/${adoptionFormId}`);
          console.log(result);
          setFormType(result[0].form_type);
        } catch (error) {
          console.log(error)
        }
    
      })();
    }, []);

  return (
    <div>
      View form
      <div>Form type: {form_type}</div>
    
    </div>
  );
};




export default ViewAdoptionForm;