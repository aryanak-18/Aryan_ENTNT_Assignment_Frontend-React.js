import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Modal, Box, TextField } from "@mui/material";

const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [errors, setErrors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCompany, setCurrentCompany] = useState(null); // For editing
  const [formValues, setFormValues] = useState({
    name: "",
    location: "",
    linkedIn: "",
    emails: "",
    phoneNumbers: "",
    comments: "",
    periodicity: "",
  });

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/companies`);
      setCompanies(response.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleOpenModal = (company = null) => {
    if (company) {
      setCurrentCompany(company);
      setFormValues({
        name: company.name,
        location: company.location,
        linkedIn: company.linkedIn,
        emails: company.emails.join(", "),
        phoneNumbers: company.phoneNumbers.join(", "),
        comments: company.comments,
        periodicity: company.periodicity,
      });
    } else {
      setCurrentCompany(null);
      setFormValues({
        name: "",
        location: "",
        linkedIn: "",
        emails: "",
        phoneNumbers: "",
        comments: "",
        periodicity: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    Object.entries(formValues).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = `${key} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async () => {
    const data = {
      ...formValues,
      emails: formValues.emails.split(",").map((email) => email.trim()),
      phoneNumbers: formValues.phoneNumbers
        .split(",")
        .map((phone) => phone.trim()),
    };

    if (validateForm()) {
      try {
        if (currentCompany) {
          // Edit functionality
          await axios.put(
            `${process.env.REACT_APP_BACKEND_URL}/api/companies/edit/${currentCompany._id}`,
            data
          );
        } else {
          // Add functionality
          await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/companies/add`, data);
        }
        fetchCompanies();
        handleCloseModal();
      } catch (error) {
        console.error("Error saving company:", error);
      }
    }
    else{
      alert("Please enter all details");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      try {
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/companies/delete/${id}`);
        fetchCompanies();
      } catch (error) {
        console.error("Error deleting company:", error);
      }
    }
  };

  const columns = [
    { field: "name", headerName: "Name", width: 150 },
    { field: "location", headerName: "Location", width: 150 },
    { field: "linkedIn", headerName: "linkedIn Profile", width: 200 },
    { field: "emails", headerName: "Emails", width: 200 },
    { field: "phoneNumbers", headerName: "Phone Numbers", width: 200 },
    { field: "comments", headerName: "Comments", width: 150 },
    { field: "periodicity", headerName: "periodicity", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleOpenModal(params.row)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            sx={{ backgroundColor: 'red', '&:hover': { backgroundColor: 'darkred' } }}
            onClick={() => handleDelete(params.row._id)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <span className="text-2xl font-bold mb-2">Company Management</span>
      <div className="mt-2">
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenModal()}
      >
        Add Company
      </Button>
      </div>
      <div style={{ height: 400, width: "100%", marginTop: 20 }}>
        <DataGrid
          rows={companies}
          columns={columns}
          getRowId={(row) => row._id}
        />
      </div>

      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2>{currentCompany ? "Edit Company" : "Add Company"}</h2>
          <form>
            <TextField
              label="Name"
              name="name"
              value={formValues.name}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Location"
              name="location"
              value={formValues.location}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="linkedIn Profile"
              name="linkedIn"
              value={formValues.linkedIn}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Emails (comma-separated)"
              name="emails"
              value={formValues.emails}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Phone Numbers (comma-separated)"
              name="phoneNumbers"
              value={formValues.phoneNumbers}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Comments"
              name="comments"
              value={formValues.comments}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="periodicity (e.g., 2 weeks)"
              name="periodicity"
              value={formValues.periodicity}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              style={{ marginTop: 20 }}
            >
              Save
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default CompanyManagement;
