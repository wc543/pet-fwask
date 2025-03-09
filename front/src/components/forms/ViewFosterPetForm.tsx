import { useState, useEffect, useContext } from "react";
import {AuthContext} from '../AuthContext'
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import {
    useParams,
} from "react-router-dom"

type Form ={
  form_id?: number;
  form_type: string;
  previous_pet_experience: string,
  status: string,
  processed: Boolean
}

function ViewFosterPetForm() {
  let [form_type, setFormType] = useState("");
  let [previous_pet_experience, setpreviousPetExperience] = useState("");
  let [processed, setProcessed] = useState<Boolean>(false);
  let [status, setStatus] =  useState("");
  let {fosterPetFormId} = useParams();
  const auth = useContext(AuthContext);


  useEffect(() => {
    (async () => {
        try {
          let {
            data: { result },
          } = await axios.get<{ result: Form[]}>(`/api/forms/foster-pets/${fosterPetFormId}`);
          console.log(result);

          setFormType(result[0].form_type);
          setpreviousPetExperience(result[0].previous_pet_experience);
          setStatus(result[0].status);
          setProcessed(result[0].processed);
          Helperfunction()
        } catch (error) {
          console.log(error)
        }
    
      })();
    }, []);

  function Helperfunction() {
    console.log("user id: ", auth?.user.user_id );
  }

  return (
    <div>
      View form
      <div>Form type: {form_type}</div>
      <div>Previous pet experience: {previous_pet_experience}</div>
      <div>Status: {status}</div>
      <div>{processed ? (<div> processed </div>) : (<div> unprocessed </div>)}</div>
      <div>logged in user: {auth?.user.user_id}</div>
    
    </div>
  );
};




export default ViewFosterPetForm;