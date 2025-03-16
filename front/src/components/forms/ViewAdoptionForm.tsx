import React, { useState, useEffect, useContext } from "react";
import { usePet } from "../Pets/PetContext";
import { useParams } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import axios from "axios";
import { 
  Box, 
  Card, 
  CardContent, 
  CardHeader, 
  Grid, 
  Typography, 
  Button 
} from "@mui/material";
import "./ViewForm.css";

type Form = {
  form_id?: number;
  form_type: string;
  previous_pet_experience: string;
  status: string;
  processed: boolean;
  pet_id: number;
  user_id: number;
  adoption_reason: string;
  ideal_pet_qualities: string;
  max_alone_time: string;
  care_plan_details: string;
  financial_responsibility: boolean;
  pet_care_agreement: boolean;
  adoption_agreement: boolean;
  submitted_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  household_size: number;
  household_allergies: string;
  current_pets: string;
};

const ViewAdoptionForm: React.FC = () => {
  const [form, setForm] = useState<Form | null>(null);
  const { adoptionFormId } = useParams();
  const { getName } = usePet();
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await fetch(`/api/forms/adoption/${adoptionFormId}`);
        const data = await response.json();
        if (data.result && data.result.length > 0) {
          setForm(data.result[0]);
        }
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };
    fetchFormData();
  }, [adoptionFormId]);

  const handleApprove = async () => {
    try {
      await axios.put(`/api/forms/adoption/${adoptionFormId}`, {
        status: "APPROVED",
        processed: true,
      });
      setForm((prevForm) =>
        prevForm ? { ...prevForm, status: "APPROVED", processed: true } : prevForm
      );
    } catch (error) {
      console.error("Error approving form:", error);
    }
  };

  const handleDeny = async () => {
    try {
      await axios.put(`/api/forms/adoption/${adoptionFormId}`, {
        status: "DENIED",
        processed: true,
      });
      setForm((prevForm) =>
        prevForm ? { ...prevForm, status: "DENIED", processed: true } : prevForm
      );
    } catch (error) {
      console.error("Error denying form:", error);
    }
  };

  return (
    <Box className="viewBox">
      {form ? (
        <>
          <Typography variant="h4" gutterBottom align="left">
            Adoption Form for {getName(form.pet_id)}
          </Typography>
            
            {/* Header row with status on left and action buttons on right */}
            <Box className="viewHeader" display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="body1">
              <strong>Status:</strong> {form.status}
            </Typography>
            {auth?.user.role === "STAFF" && !form.processed && (
              <Box>
                <Button variant="contained" onClick={handleApprove}>Approve</Button>
                <Button variant="contained" onClick={handleDeny}>Deny</Button>
              </Box>
            )}
          </Box>

          <Grid container spacing={2} alignItems="stretch">
            {/* Personal Information Section */}
            <Grid item xs={12} md={6}>
              <Card className="equalHeightCard">
                <CardHeader title="Personal Information" />
                <CardContent>
                  <Typography variant="body1">
                    <strong>First Name:</strong> {form.first_name}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Last Name:</strong> {form.last_name}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Email:</strong> {form.email}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Phone:</strong> {form.phone_number}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Address:</strong> {form.address}, {form.city},{" "}
                    {form.state}, {form.zip_code}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            {/* Household Information Section */}
            <Grid item xs={12} md={6}>
              <Card className="equalHeightCard">
                <CardHeader title="Household Information" />
                <CardContent>
                  <Typography variant="body1">
                    <strong>Household Size:</strong> {form.household_size}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Household Allergies:</strong> {form.household_allergies}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Current Pets:</strong> {form.current_pets}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            {/* Pet Preferences & Details Section */}
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Pet Preferences & Details" />
                <CardContent>
                  <Typography variant="body1">
                    <strong>Status:</strong> {form.status}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Previous Pet Experience:</strong> {form.previous_pet_experience}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Adoption Reason:</strong> {form.adoption_reason}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Ideal Pet Qualities:</strong> {form.ideal_pet_qualities}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Maximum Alone Time:</strong> {form.max_alone_time}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Care Plan Details:</strong> {form.care_plan_details}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Financial Responsibility:</strong>{" "}
                    {form.financial_responsibility ? "Agreed" : "Did not agree"}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Pet Care Agreement:</strong>{" "}
                    {form.pet_care_agreement ? "Agreed" : "Did not agree"}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Adoption Agreement:</strong>{" "}
                    {form.adoption_agreement ? "Agreed" : "Did not agree"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
        </>
      ) : (
        <Typography variant="body1">Loading form details...</Typography>
      )}
    </Box>
  );
};

export default ViewAdoptionForm;
