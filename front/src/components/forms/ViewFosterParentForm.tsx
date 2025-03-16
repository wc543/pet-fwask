import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthContext";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Box, Card, CardContent, CardHeader, Grid, Typography, Button, } from "@mui/material";
import "./ViewForm.css";

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

const ViewFosterParentForm: React.FC = () => {
  const [form, setForm] = useState<Form | null>(null);
  const { fosterParentFormId } = useParams();
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await fetch(
          `/api/forms/foster-parent/${fosterParentFormId}`
        );
        const data = await response.json();
        if (data.result && data.result.length > 0) {
          setForm(data.result[0]);
        }
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };

    fetchFormData();
  }, [fosterParentFormId]);

  const handleApprove = async () => {
    try {
      await axios.put(
        `/api/forms/foster-parent/${form?.foster_parent_form_id}`,
        {
          status: "APPROVED",
          processed: true,
        }
      );
      setForm((prevForm) =>
        prevForm
          ? { ...prevForm, status: "APPROVED", processed: true }
          : prevForm
      );
    } catch (error) {
      console.error("Error approving form:", error);
    }
  };

  const handleDeny = async () => {
    try {
      await axios.put(
        `/api/forms/foster-parent/${form?.foster_parent_form_id}`,
        {
          status: "DENIED",
          processed: true,
        }
      );
      setForm((prevForm) =>
        prevForm
          ? { ...prevForm, status: "DENIED", processed: true }
          : prevForm
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
            Foster Parent Application
          </Typography>

          {/* Header row with status and action buttons */}
          <Box className="viewHeader" display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="body1">
              <strong>Status:</strong> {form.status}
            </Typography>
            {auth?.user.role === "STAFF" && !form.processed && (
              <Box>
                <Button variant="contained" style={{ margin: '5px' }} onClick={handleApprove}>Approve</Button>
                <Button variant="contained" style={{ margin: '5px' }} onClick={handleDeny}>Deny</Button>
              </Box>
            )}
          </Box>

          <Grid container spacing={2} alignItems="stretch">
            {/* Top Row: Personal Information & Household Information */}
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
                    <strong>Address:</strong> {form.address}, {form.city},{" "}
                    {form.state}, {form.zip_code}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
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

export default ViewFosterParentForm;
