import './SubmitForm.css';
import axios from 'axios';
import React, { useContext, useState, useEffect } from 'react';
import {useParams} from "react-router-dom"
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import { TextField, ToggleButton, Checkbox, Button, Paper, Typography } from '@mui/material';
import { AuthContext } from '../AuthContext';
import {usePet} from '../Pets/PetContext';
import BackButton from '../BackButton';


// error handling - referenced from activity 3b utils.ts
// https://medium.com/with-orus/the-5-commandments-of-clean-error-handling-in-typescript-93a9cbdf1af5
function ensureError(value: unknown): Error {
    if (value instanceof Error) return value;

    let stringified;
    try {
        stringified = JSON.stringify(value);
    } catch {
        stringified = "[Unable to stringify the thrown value]";
    }

    let error = new Error(
        `Thrown value was originally not an error; stringified value is: ${stringified}`,
    );
    return error;
}

// https://axios-http.com/docs/handling_errors
// https://github.com/axios/axios/issues/3612
function getAxiosErrorMessages(err: unknown): string {
    let error = ensureError(err);
    console.log(error);

    if (!axios.isAxiosError(error)) {
    return error.toString();
    }

    if (!error.response) {
    return "Server never sent response";
    }

    if (!error.response.data.errors) {
    return error.response.data?.error;
    } else {
    return error.response.data.errors[0];
    }
}

const SubmitAdoptionForm: React.FC = () => {
    let {petId} = useParams();
    let [previousPetExperience, setPreviousPetExperience] = useState('');
    let [adoptionReason, setAdoptionReason] = useState('');
    let [idealPetQualities, setIdealPetQualities] = useState('');
    let [maxAloneTime, setMaxAloneTime] = useState('');
    let [carePlanDetails, setCarePlanDetails] = useState('');
    let [financialResponsibility, setFinancialResponsibility] = useState(false)
    let [petCareAgreement, setPetCareAgreement] = useState(false)
    let [adoptionAgreement, setAdoptionAgreement] = useState(false)
    let [submittedAt, setSubmittedAt] = useState('');
    let [processed, setProcessed] = useState(false);
    let [status, setStatus] = useState('NEEDS PROCESSING');
    let [firstName, setFirstName] = useState('');
    let [lastName, setLastName] = useState('');
    let [address, setAddress] = useState('');
    let [state, setState] = useState('');
    let [city, setCity] = useState('');
    let [zipCode, setZipCode] = useState('');
    let [phoneNumber, setPhoneNumber] = useState('');
    let [householdSize, setHouseHoldSize] = useState(Number);
    let [householdAllergies, setHouseholdAllergies] = useState('');
    let [currentPets, setCurrentPets] = useState('');
    let [email, setEmail] = useState('');
    
    const navigate = useNavigate();
    const auth = useContext(AuthContext);
    const{  getName, getImageUrl } = usePet();
    const [loading, setLoading] = useState(false);
    const getAutoFilledUserInfo = async () => {
        try {
            setLoading(true);
          var userId=auth?.user.user_id
          
          const response= await fetch(`/api/forms/autofillForm/${userId}`);
         
          if (!response.ok) {
            throw new Error("Failed to user info");
          }
    
          const autoFilledUserData = await response.json();

    
          console.log("user data");
          console.log(autoFilledUserData.householdResult[0].household_size);
    
          setFirstName(autoFilledUserData.userResult[0].first_name);
          setLastName(autoFilledUserData.userResult[0].last_name);
          setAddress(autoFilledUserData.userResult[0].address);
          setCity(autoFilledUserData.userResult[0].city);
          setState(autoFilledUserData.userResult[0].state);
          setZipCode(autoFilledUserData.userResult[0].zip_code);
          setEmail(autoFilledUserData.userResult[0].email);
          setPhoneNumber(autoFilledUserData.userResult[0].phone_number);
          setHouseHoldSize(autoFilledUserData.householdResult[0].household_size);
          setHouseholdAllergies(autoFilledUserData.householdResult[0].household_allergies);
          setCurrentPets(autoFilledUserData.householdResult[0].current_pets);

        } catch (err) {
            alert(getAxiosErrorMessages(err))
        }
        finally {
            setLoading(false);
          }
      };

    function getPetName():string | undefined
    {

        let petIdInt: number;
        if (petId !== undefined)
        {
            petIdInt = parseInt(petId);
            let petName=getName(petIdInt);
            return petName
        }

    }

    function getPetImageUrl():string | undefined
    {

        let petIdInt: number;
        if (petId !== undefined)
        {
            petIdInt = parseInt(petId);
            const petImageUrl=getImageUrl(petIdInt);
            return petImageUrl;
        }

    }
     useEffect(() => {
        getAutoFilledUserInfo();
      }, []);

    const handleSubmitAdoptionForm = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            var user_id = auth?.user.user_id;

            //set submitted at time
            let now = new Date();
            let hours = now.getHours();
            let minutes = now.getMinutes();
            let seconds = now.getSeconds();
            let currentTime=now.toString()+hours.toString()+minutes.toString()+seconds.toString()
            setSubmittedAt(currentTime);
            console.log("submitted at: ", currentTime);
            let petIdInt;

            if (petId !== undefined)
            {
                petIdInt = parseInt(petId);
            }

            // post form
            let newAdoptionForm = {
                user_id: user_id,
                pet_id: petIdInt,
                previous_pet_experience: previousPetExperience,
                adoption_reason: adoptionReason,
                ideal_pet_qualities: idealPetQualities,
                max_alone_time: maxAloneTime,
                care_plan_details: carePlanDetails,
                financial_responsibility: financialResponsibility,
                pet_care_agreement: petCareAgreement,
                adoption_agreement: adoptionAgreement,
                submitted_at: submittedAt,
                processed: processed,
                status: status,
                first_name: firstName,
                last_name: lastName,
                address: address,
                state: state,
                city: city,
                zip_code: zipCode,
                phone_number: phoneNumber,
                household_size: householdSize,
                household_allergies: householdAllergies,
                current_pets: currentPets,
                email: email
                };
                console.log(newAdoptionForm);
            let response = await axios.post('/api/forms/adoption', newAdoptionForm);
            console.log("Posted new form successfully:", response.data);

            setPreviousPetExperience('')
            setAdoptionReason('');
            setIdealPetQualities(''),
            setMaxAloneTime('');
            setCarePlanDetails('');
            setFinancialResponsibility(false);
            setPetCareAgreement(false);
            setAdoptionAgreement(false);
            setProcessed(false);
            setStatus('NEEDS PROCESSING');
            setFirstName('');
            setLastName('');
            setAddress('');
            setState('');
            setCity('');
            setZipCode('');
            setPhoneNumber('');
            setHouseHoldSize(-1);
            setHouseholdAllergies('');
            setCurrentPets('');
            setEmail('');
            alert("Successfully submitted form");
            navigate(`/forms/${user_id}`);
        } catch (error) {
            alert(getAxiosErrorMessages(error));
        }
    };

    
    return (
        <>
        <BackButton></BackButton>
        <Box className="Box" sx={{ minWidth: 120 }} component="form" onSubmit={handleSubmitAdoptionForm}>
            <br/>
            <div style={{display:"flex" ,  alignItems: "center", gap: "20px"}}>
                {getPetImageUrl() ? <img onClick={() => navigate(`/pets/id/${petId}`)} src={ (`/${getPetImageUrl()}`) } alt={getPetName()} style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }} /> : <></> }
                
                <Typography variant="h4" gutterBottom align="left">
                Apply to Adopt {getPetName()}
                </Typography>

            </div>
            <br/>
            <Typography variant="body1" paragraph align="center">
                Thank you for your interest in adopting one of our pets! Please fill out the form below with accurate information. Our team will review your application as soon as possible.
            </Typography>
            <FormControl fullWidth>
            {loading ? (
            <div>Loading...</div>
            ) : (
                <div id="formwrapper">
                    <div className="formsubwrap" id="formsubwrap1">
                        <Typography variant="h5" gutterBottom align="left">
                        Personal Information
                        </Typography>
                        <TextField className='formInput' required label="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} component={Paper}/>
                        <br/>
                        <TextField className='formInput' required label="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} component={Paper}/>
                        <br/>
                        <TextField className='formInput' required label="Email" value={email} onChange={e => setEmail(e.target.value)} component={Paper}/>
                        <br/>
                        <TextField className='formInput' required label="Phone Number" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} component={Paper}/>
                        <br/>
                        <TextField className='formInput' required label="Address" value={address} onChange={e => setAddress(e.target.value)} component={Paper}/>
                        <br/>
                        <TextField className='formInput' required label="City" value={city} onChange={e => setCity(e.target.value)} component={Paper}/>
                        <br/>
                        <TextField className='formInput' required label="State" value={state} onChange={e => setState(e.target.value)} component={Paper}/>
                        <br/>
                        <TextField className='formInput' required label="Zip Code" value={zipCode} onChange={e => setZipCode(e.target.value)} component={Paper}/>
                        <br/>
                        <Typography variant="h5" gutterBottom align="left">
                        Household Information
                        </Typography>
                        <TextField className='formInput' type='number' label="Household Size" value={householdSize} onChange={e => setHouseHoldSize(parseInt(e.target.value))} component={Paper}/>
                        <br/>
                        <TextField className='formInput'  label="Are there any animal allergies in your household?" value={householdAllergies} onChange={e => setHouseholdAllergies(e.target.value)} component={Paper}/>
                        <br/>
                        <TextField className='formInput'  label="Please list any pets you currently have" value={currentPets} onChange={e => setCurrentPets(e.target.value)} component={Paper}/>
                        <br/>
                        <Typography variant="h5" gutterBottom align="left">
                        Questionnaire 
                        </Typography>
                        <TextField className='formInput' multiline rows={3} label="What is your previous experience caring for pets?" value={previousPetExperience} onChange={e => setPreviousPetExperience(e.target.value)} component={Paper}/>
                        <br/>
                        <TextField className='formInput'  multiline rows={3} label="Why do you want to adopt?" value={adoptionReason} onChange={e => setAdoptionReason(e.target.value)} component={Paper}/>
                        <br/>
                        <TextField className='formInput'  multiline rows={3} label="What are are your ideal qualities in a pet?" value={idealPetQualities} onChange={e => setIdealPetQualities(e.target.value)} component={Paper}/>
                        <br/>
                        <TextField className='formInput'  multiline rows={3} label="What is the maximum amount of time you would leave the pet alone?" value={maxAloneTime} onChange={e => setMaxAloneTime(e.target.value)} component={Paper}/>
                        <br/>
                        <TextField className='formInput'  multiline rows={3} label="Outline your care plan for this pet" value={carePlanDetails} onChange={e => setCarePlanDetails(e.target.value)} component={Paper}/>
                        <br/>
                        <Typography variant="h5" gutterBottom align="left">
                        Acknowledgements
                        </Typography>
                        <ToggleButton id="toggle" value="financialResponsibility" selected={financialResponsibility} onChange={() => setFinancialResponsibility(!financialResponsibility)}>
                            <Checkbox checked={!!financialResponsibility}/>
                            <label style={{textAlign:'left'}}>I acknowledge that I am able to financially support this pet. This includes providing annual vaccinations, exams, and routine medical care for the pet,  which is an annual commitment of $200 to $400</label>
                        </ToggleButton>
                        <br/>
                        <ToggleButton id="toggle" value="petCareAgreement" selected={petCareAgreement} onChange={() => setPetCareAgreement(!petCareAgreement)}>
                            <Checkbox checked={!!petCareAgreement}/>
                            <label style={{textAlign:'left'}}>I will abide by the laws pertaining to the humane treatment of animals</label>
                        </ToggleButton>
                        <br/>
                        <ToggleButton id="toggle" value="adoptionAgreement" selected={adoptionAgreement} onChange={() => setAdoptionAgreement(!adoptionAgreement)}>
                            <Checkbox checked={!!adoptionAgreement}/>
                            <label style={{textAlign:'left'}}>I acknowledge that all information on this form is true and correct. I understand that any misrepresentation of the facts may result in the shelter refusing adoption privileges to me </label>
                        </ToggleButton>
                    </div>
                    <div className='formsubwrap' id="formsubwrap3">
                        <Button variant="contained" type="submit" >Submit Form</Button>
                    </div>
                </div>)}
            </FormControl>
        </Box>
        </>
    )

};

export default SubmitAdoptionForm;