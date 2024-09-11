import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import api from "../api/apiServices";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState({
    approved: false, // Default to `false`
  });

  // Handle change for the username field
  const handleUsernameChange = (e) => {
    setSelectedUser((prev) => ({
      ...prev,
      username: e.target.value,
    }));
  };

  // Handle change for the role field
  const handleRoleChange = (e) => {
    setSelectedUser((prev) => ({
      ...prev,
      role: e.target.value,
    }));
  };

  // Handle change for the approved field
  const handleChange = (e) => {
    const value = e.target.value === "Yes"; // Convert "Yes" to true, "No" to false
    setSelectedUser((prevUser) => ({
      ...prevUser,
      approved: value,
    }));
  };

  const fetchUsers = async () => {
    const response = await api.getAllUsers();
    const data = await response.data;
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenDialog = (user) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = async (id) => {
    // API call to delete user
    try {
      await api.deleteUser(id);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      alert(error.response.data.message);
      // Handle the error
    }
  };

  const handleSaveUser = async () => {
    try {
      // Create or Update User based on selectedUser
      if (selectedUser) {
        if (selectedUser.id) {
          // API call to update user
          await api.updateUser(selectedUser.id, selectedUser);
        } else {
          // API call to create new user
          await api.signup(selectedUser);
        }
      }
      fetchUsers();
      handleCloseDialog();
    } catch (error) {
      alert(error.response.data.message);
      // Handle the error
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom mt={4}>
        Users Management
      </Typography>

      <Grid container gap={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenDialog()}
        >
          Create New User
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/dashboard")}
        >
          Home
        </Button>
      </Grid>

      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Approved</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.approved ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(user)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {selectedUser?.id ? "Update User" : "Create New User"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={selectedUser?.username || ""}
            onChange={handleUsernameChange}
          />
          <TextField
            label="Role"
            fullWidth
            margin="normal"
            value={selectedUser?.role || ""}
            onChange={handleRoleChange}
          />
          <TextField
            label="Approved"
            fullWidth
            margin="normal"
            value={selectedUser?.approved ? "Yes" : "No"} // Display "Yes" or "No"
            onChange={handleChange} // Attach the handleChange function
            select
            SelectProps={{ native: true }}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveUser} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Users;
