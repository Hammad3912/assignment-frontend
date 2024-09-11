import React, { useState, useEffect } from "react";
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
  FormControl,
  InputLabel,
  Select,
  Chip,
  MenuItem,
  Grid,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import api from "../api/apiServices"; // Make sure this is the correct path to your api file
import { decodeToken, generatePDF } from "../utils/helpers";
import { useNavigate } from "react-router-dom";

const Deals = () => {
  const navigate = useNavigate();
  const [deals, setDeals] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState({
    customerIds: [],
    products: [],
  });

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const loggedInUser = decodeToken();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customersResponse = await api.getAllUsers();
        const productsResponse = await api.getAllProducts();

        // Check if the user is an admin
        const isAdmin = loggedInUser.role === "admin";

        // Filter out the current user if admin
        const filteredCustomers = isAdmin
          ? customersResponse.data.filter((user) => user.id !== loggedInUser.id)
          : customersResponse.data;

        setCustomers(filteredCustomers);
        setProducts(productsResponse.data);
      } catch (error) {
        alert(`Error fetching data: ${error.response.data.message}`);
      }
    };

    fetchData();
  }, [loggedInUser.id, loggedInUser.role]);

  // Fetch all deals
  const fetchDeals = async () => {
    try {
      const response = await api.getAllDeals();
      console.log(response);
      setDeals(response.data);
    } catch (error) {
      alert(`Error fetching data: ${error.response.data.message}`);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  // Open the dialog for creating or editing a deal
  const handleOpenDialog = (deal) => {
    setSelectedDeal(
      deal || { customers: [], partner: "", products: [], price: "" }
    );
    setOpenDialog(true);
  };

  // Close the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDeal({ customers: [], partner: "", products: [], price: "" });
  };

  // Save (Create or Update) deal
  const handleSaveDeal = async () => {
    try {
      // Create new deal
      await api.createDeal(selectedDeal);

      fetchDeals();
      handleCloseDialog();
    } catch (error) {
      alert(`Error saving deal: ${error.response.data.message}`);
    }
  };

  // Delete a deal
  const handleDeleteDeal = async (id) => {
    try {
      await api.deleteDeal(id);
      setDeals(deals.filter((deal) => deal.id !== id));
    } catch (error) {
      alert(`Error deleting deal: ${error.response.data.message}`);
    }
  };

  // Approve a deal (Admin only)
  const handleApproveDeal = async (dealId) => {
    try {
      await api.updateDealStatus(dealId);
      fetchDeals();
    } catch (error) {
      alert(`Error approving deal:: ${error.response.data.message}`);
    }
  };

  const handleCustomerChange = (event) => {
    const { value } = event.target;
    setSelectedDeal({
      ...selectedDeal,
      customerIds: value.map((customerId) => customerId), // Directly use customerId
    });
  };
  const handleProductChange = (event) => {
    const { value } = event.target;
    setSelectedDeal({
      ...selectedDeal,
      products: value.map((productId) => productId),
    });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom mt={4}>
        Deal Management
      </Typography>

      <Grid container gap={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenDialog()}
        >
          Create New Deal
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
              <TableCell>Deal ID</TableCell>
              <TableCell>Customers</TableCell>
              <TableCell>Partner</TableCell>
              <TableCell>Products</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deals.map((deal) => (
              <TableRow key={deal.id}>
                <TableCell>{deal.id}</TableCell>
                <TableCell>
                  {deal?.customer_deals
                    .map((customer_deal) => customer_deal.customer.username)
                    .join(", ")}
                </TableCell>
                <TableCell>{deal?.partner.username}</TableCell>
                <TableCell>
                  {deal?.product_deals
                    .map((product_deal) => product_deal.product.name)
                    .join(", ")}
                </TableCell>
                <TableCell>${deal.deal_price}</TableCell>
                <TableCell>{deal.status}</TableCell>
                <TableCell>
                  {loggedInUser.role === "admin" && (
                    <>
                      <IconButton
                        color="secondary"
                        onClick={() => handleDeleteDeal(deal.id)}
                      >
                        <Delete />
                      </IconButton>

                      {!deal.approved && (
                        <Button
                          color="primary"
                          onClick={() => handleApproveDeal(deal.id)}
                        >
                          Approve
                        </Button>
                      )}
                    </>
                  )}
                  <Button color="primary" onClick={() => generatePDF(deal)}>
                    Quotation PDF
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
        <DialogTitle>{"Create New Deal"}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Customers</InputLabel>
            <Select
              multiple
              value={selectedDeal?.customerIds?.map((cd) => cd) || []}
              onChange={handleCustomerChange}
              renderValue={(selected) => (
                <div>
                  {selected.map((id) => {
                    const customer = customers.find((c) => c.id === id);
                    return customer ? (
                      <Chip key={id} label={customer.username} />
                    ) : null;
                  })}
                </div>
              )}
            >
              {customers.map((customer) => (
                <MenuItem key={customer.id} value={customer.id}>
                  {customer.username}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Products</InputLabel>
            <Select
              multiple
              value={selectedDeal?.products?.map((pd) => pd) || []}
              onChange={handleProductChange}
              renderValue={(selected) => (
                <div>
                  {selected.map((id) => {
                    const product = products.find((p) => p.id === id);
                    return product ? (
                      <Chip key={id} label={product.name} />
                    ) : null;
                  })}
                </div>
              )}
            >
              {products.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveDeal} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Deals;
