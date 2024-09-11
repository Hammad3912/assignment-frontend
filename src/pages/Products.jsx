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
  TextField,
  Grid,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import api from "../api/apiServices";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({
    name: "",
    price: "",
  });

  const fetchProducts = async () => {
    const response = await api.getAllProducts(); // Fetch all products from the API
    const data = await response.data;
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenDialog = (product) => {
    setSelectedProduct(product || { name: "", price: "" }); // Reset form for new product
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct({ name: "", price: "" });
  };

  const handleSaveProduct = async () => {
    try {
      if (selectedProduct?.id) {
        // Update existing product
        await api.updateProduct(selectedProduct.id, selectedProduct);
      } else {
        // Create new product
        await api.createProduct(selectedProduct);
      }
      fetchProducts();
      handleCloseDialog();
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await api.deleteProduct(id);
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom mt={4}>
        Product Management
      </Typography>

      <Grid container gap={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenDialog()}
        >
          Create New Product
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
              <TableCell>Product Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(product)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDeleteProduct(product.id)}
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
          {selectedProduct?.id ? "Update Product" : "Create New Product"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Product Name"
            fullWidth
            margin="normal"
            value={selectedProduct.name}
            onChange={(e) =>
              setSelectedProduct({ ...selectedProduct, name: e.target.value })
            }
          />
          <TextField
            label="Price"
            fullWidth
            margin="normal"
            type="number"
            value={selectedProduct.price}
            onChange={(e) =>
              setSelectedProduct({ ...selectedProduct, price: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveProduct} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Products;
