import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/login`,
        formData
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);

      navigate("/admin-dashboard");
    } catch (error) {
      alert("Error logging in: " + error.response.data.error);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "auto", padding: 2 }}>
      <div className="text-4xl font-extrabold capitalize underline mx-auto w-fit">
          ADMIN LOGIN
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
      <Button
        variant="contained"
        fullWidth
        onClick={handleLogin}
        sx={{ marginTop: 2 }}
      >
        Login
      </Button>

      <div className="w-fit mt-10 rounded-md pl-1">
        <span className="text-md">Are you a user?</span>
        <button
          onClick={() => navigate("/")}
          className="bg-red-600 text-white py-2 px-4 rounded-md ml-5"
        >
        Login
        </button>
      </div>
    </Box>
  );
};

export default AdminLogin;
