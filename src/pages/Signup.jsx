import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import api from "../api/apiServices"; // Assuming your API handler is in api.js
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  // State to store form data
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "partner", // Default value set to 'partner'
  });

  // Handle input changes for username, password, and role
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle the form submission
  const handleSubmit = async () => {
    try {
      // Call the API with the formData
      const response = await api.signup(formData);
      if (response.data) {
        alert("Signup successful! Contact admin for verification");
      }
      navigate("/login");
      // Optionally clear the form or show a success message
    } catch (error) {
      alert(error.response.data.message);
      // Handle the error
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Sign Up
      </Typography>

      {/* Username Input */}
      <TextField
        label="Username"
        name="username"
        value={formData.username}
        fullWidth
        margin="normal"
        onChange={handleChange}
      />

      {/* Password Input */}
      <TextField
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        fullWidth
        margin="normal"
        onChange={handleChange}
      />

      {/* Role Select Input */}
      <FormControl fullWidth margin="normal">
        <Select
          variant="outlined"
          labelId="role-select-label"
          id="role-select"
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <MenuItem value="partner">Partner</MenuItem>
          <MenuItem value="customer">Customer</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </Select>
      </FormControl>

      {/* Submit Button */}
      <Button
        variant="contained"
        fullWidth
        onClick={handleSubmit}
        sx={{ mt: 2 }}
      >
        Sign Up
      </Button>
    </Box>
  );
}

export default Signup;
