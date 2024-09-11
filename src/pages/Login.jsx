import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Box } from "@mui/material";
import api from "../api/apiServices";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    // API call for login
    console.log(formData);
    try {
      // Call the API with the formData
      const response = await api.login(formData);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      }
      // Optionally clear the form or show a success message
    } catch (error) {
      alert(error.response.data.message);
      // Handle the error
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <TextField
        label="Username"
        name="username"
        value={formData.username}
        fullWidth
        margin="normal"
        onChange={handleChange}
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        fullWidth
        margin="normal"
        onChange={handleChange}
      />
      <Button variant="contained" fullWidth onClick={handleSubmit}>
        Login
      </Button>
    </Box>
  );
}

export default Login;
