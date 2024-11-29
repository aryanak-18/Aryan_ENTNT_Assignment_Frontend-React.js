import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user",
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/register`, formData);
      alert(response.data.message);
      navigate("/");
    } catch (error) {
      alert("Error registering user: " + error.response.data.error);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "auto", padding: 2 }}>
      <div className="text-4xl font-extrabold capitalize underline mx-auto w-fit">
          REGISTER
        </div>
      <TextField
        label="Email"
        name="email"
        fullWidth
        margin="normal"
        value={formData.email}
        onChange={handleInputChange}
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        fullWidth
        margin="normal"
        value={formData.password}
        onChange={handleInputChange}
      />
      <Button variant="contained" fullWidth onClick={handleRegister} sx={{ marginTop: 2 }}>
        Register
      </Button>

      <div className="w-fit mt-10 rounded-md pl-1">
        <span className="text-md">Already have an account?</span>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 text-white py-2 px-4 rounded-md ml-5"
        >
          Login
        </button>
      </div>
    </Box>
  );
};

export default Register;
