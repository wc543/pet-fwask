import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { usePet } from "../Pets/PetContext";
import { Dayjs } from "dayjs";
import { AuthContext } from "../AuthContext";
import axios from "axios";
import { Box, Card, CardContent, CardHeader, Grid, Typography, Button, } from "@mui/material";
import "./ViewForm.css";

type Form = {
  foster_pet_form_id?: number;
  user_id: number;
  pet_id: number;
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

const ViewFosterPetForm: React.FC = () => {
  const [form, setForm] = useState<Form | null>(null);
  const { fosterPetFormId } = useParams();
  const { getName } = usePet();
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await fetch(`/api/forms/foster-pet/${fosterPetFormId}`);
        const data = await response.json();
        if (data.result && data.result.length > 0) {
          setForm(data.result[0]);
        }
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };
    fetchFormData();
  }, [fosterPetFormId]);

  const handleApprove = async () => {
    try {
      await axios.put(`/api/forms/foster-pet/${fosterPetFormId}`, {
        processed: true,
        status: "APPROVED",
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
      await axios.put(`/api/forms/foster-pet/${fosterPetFormId}`, {
        processed: true,
        status: "DENIED",
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
            View Foster Pet Form for {getName(form.pet_id)}
          </Typography>

            {/* Header row with status and action buttons */}
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
            {/* Top Row: Personal Information */}
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
                    <strong>Phone Number:</strong> {form.phone_number}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Address:</strong> {form.address}, {form.city}, {form.state}, {form.zip_code}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            {/* Top Row: Household Information */}
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
            {/* Bottom Row: Foster Application Details */}
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Foster Application Details" />
                <CardContent>
                  <Typography variant="body1">
                    <strong>Foster Reason:</strong> {form.foster_reason}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Previous Pet Experience:</strong> {form.previous_pet_experience}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Maximum Alone Time:</strong> {form.max_alone_time}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Foster Start Date:</strong> {form.foster_start_date?.toString()}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Foster End Date:</strong> {form.foster_end_date?.toString()}
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

export default ViewFosterPetForm;
