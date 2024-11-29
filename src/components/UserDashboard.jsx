import React, { useState, useEffect } from "react";
import { Grid, Button, Typography, Divider, Tooltip, Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import ReactTooltip from "react-tooltip";
import CommunicationModal from "./CommunicationModal";
import CommunicationCalendar from "./CommunicationCalendar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserDashboard = () => {
  const [communications, setCommunications] = useState([]);
  const [over, setOver] = useState([]);
  const [today, setToday] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState([]);
  const [selected, setSelected] = useState(false);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);

  const handleCommunicationPerformed = () => {
    console.log(rowSelectionModel);
    const x = rowSelectionModel;
    let mySet = new Set();
    let arr = [];

    for (let i = 0; i < x.length; i++) {
      mySet.add(x[i].slice(24, x[i].length));
    }

    mySet.forEach((el) => arr.push({ name: el }));

    setSelectedCompanyId(arr);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleLogCommunication = (data) => {
    console.log("Communication Data:", data);
    data.company.forEach((el) => {
      setCommunications((prev) => [
        ...prev,
        {
          company: { name: el.name },
          date: data.date,
          type: { name: data.type },
          notes: data.notes,
        },
      ]);
    });

    console.log(communications);
  };

  const fetchCommsFromAPI = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/communications-user"
      );
      const data = response.data;
      return data;
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const fetchNotificationsFromAPI = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/notifications"
      );
      return response.data; // Return notification data (overdue, today, etc.)
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const communicationsData = await fetchCommsFromAPI();
      setCommunications(communicationsData); // Set companies to state
      const ndata = await fetchNotificationsFromAPI();

      const over = ndata.filter((el) => el.type === "overdue");
      const today = ndata.filter((el) => el.type === "due today");
      setOver(over);
      setToday(today);
    };
    fetchData();
  }, []);

  const columns = [
    {
      field: "name",
      headerName: "Company Name",
      width: 200,
      renderCell: (params) => (
        <Box>
          <Typography>{params.row.company.name}</Typography>;
        </Box>
      ),
    },
    {
      field: "lastCommunications",
      headerName: "Last 5 Communications",
      width: 300,
      renderCell: (params) => {
        return (
          <Box>
            <Tooltip key={params.row._id} title={params.row.notes}>
              <Typography>{`${params.row.type.name} - ${new Date(
                params.row.date
              ).toLocaleDateString()}`}</Typography>
            </Tooltip>
          </Box>
        );
      },
    },
    {
      field: "nextCommunication",
      headerName: "Next Scheduled Communication",
      width: 300,
      renderCell: (params, idx) => {
        const date = new Date(params.row.date);
        date.setDate(date.getDate() + 5);
        const updatedDateString = date.toLocaleDateString();

        return (
          <Typography>{`${params.row.type.name} - ${updatedDateString}`}</Typography>
        );
      },
    },
  ];

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div className="mt-4">
      <div className="flex w-fit ml-auto mr-4">
        <Button
          className="bg-red-600 text-white px-4 py-2 rounded-md ml-auto mr-4"
          variant="contained"
          color="secondary"
          size="small"
          sx={{
            backgroundColor: "red",
            "&:hover": { backgroundColor: "darkred" },
          }}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
      <Box p={3}>
        <div className="text-4xl font-extrabold capitalize underline mx-auto w-fit">
          USER DASHBOARD
        </div>

        {/* Notification Section */}
        <Box mb={2}>
          <div className="font-bold text-lg underline">Notifications</div>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <div className="flex">
                Overdue Communications{" "}
                <div className="bg-blue-600 text-white w-fit rounded-full px-2 ml-2">
                  {over.length}
                </div>
              </div>
              <Box
                sx={{
                  backgroundColor: "red",
                  color: "white",
                  padding: "10px",
                  borderRadius: "5px",
                }}
              >
                {over.length > 0 ? (
                  over?.map((x, idx) => (
                    <Typography key={idx}>
                      {idx + 1}. {x.company.name} - {x.message}
                    </Typography>
                  ))
                ) : (
                  <Typography>No overdue communications</Typography>
                )}
              </Box>
            </Grid>
            <Grid item xs={6}>
              <div className="flex">
                Today's Communications{" "}
                <div className="bg-blue-600 text-white w-fit rounded-full px-2 ml-2">
                  {today.length}
                </div>
              </div>
              <Box
                sx={{
                  backgroundColor: "yellow",
                  color: "black",
                  padding: "10px",
                  borderRadius: "5px",
                }}
              >
                {today?.length > 0 ? (
                  today.map((x, idx) => (
                    <Typography key={idx}>
                      {idx + 1}. {x.company.name} - {x.message}
                    </Typography>
                  ))
                ) : (
                  <Typography>No communications due today</Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>

        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={communications}
            getRowId={(row) => row._id + row.company.name} // Ensure each row has a unique ID
            columns={columns}
            pageSizeOptions={[5]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 5, page: 0 },
              },
            }}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            checkboxSelection
            onRowSelectionModelChange={(newRowSelectionModel) => {
              if (newRowSelectionModel.length > 0) {
                setSelected(true);
              } else {
                setSelected(false);
              }
              setRowSelectionModel(newRowSelectionModel);
            }}
            rowSelectionModel={rowSelectionModel}
          />
        </div>

        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleCommunicationPerformed();
            }}
            disabled={!selected}
          >
            Communication Performed
          </Button>

          <CommunicationModal
            open={openModal}
            onClose={handleCloseModal}
            onSubmit={handleLogCommunication}
            company={selectedCompanyId}
          />
        </div>

        <CommunicationCalendar communications={communications} />
      </Box>
    </div>
  );
};

export default UserDashboard;
