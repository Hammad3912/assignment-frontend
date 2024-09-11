import React from "react";
import { Typography, Box, Button, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import { decodeToken, logout } from "../utils/helpers";

function Dashboard() {
  const user = decodeToken();

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h3" gutterBottom>
        {user.role === "admin" ? "Admin" : "Partner"} Dashboard
      </Typography>
      <Grid container gap={2}>
        <Grid item>
          <Button variant="contained" component={Link} to="/users">
            Manage users
          </Button>
        </Grid>

        {user.role === "admin" && (
          <Grid item>
            <Button variant="contained" component={Link} to="/products">
              Manage Products
            </Button>
          </Grid>
        )}

        <Grid item>
          <Button variant="contained" component={Link} to="/deals">
            Manage Deals
          </Button>
        </Grid>

        <Grid item>
          <Button
            variant="contained"
            component={Link}
            to="/login"
            onClick={logout}
          >
            Logout
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
