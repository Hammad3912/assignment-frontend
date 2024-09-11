import axiosClient from "./axiosClient";

// Example of API handlers for User
const api = {
  // User signup
  signup: (userData) => {
    return axiosClient.post("users/signup", userData);
  },

  // User login
  login: (loginData) => {
    return axiosClient.post("users/login", loginData);
  },

  // Fetch all users
  getAllUsers: () => {
    return axiosClient.get(`/users/`);
  },

  // Fetch user by ID
  getUserById: (userId) => {
    return axiosClient.get(`/users/${userId}`);
  },

  updateUser: (userId, payload) => {
    return axiosClient.put(`/users/${userId}`, payload);
  },

  deleteUser: (userId) => {
    return axiosClient.delete(`/users/${userId}`);
  },

  // Fetch all products
  getAllProducts: () => {
    return axiosClient.get(`/products/`);
  },

  // Fetch product by ID
  getProductById: (productId) => {
    return axiosClient.get(`/products/${productId}`);
  },

  // Create a new product (Only for Admins)
  createProduct: (payload) => {
    return axiosClient.post(`/products/`, payload);
  },

  // Update an existing product (Only for Admins)
  updateProduct: (productId, payload) => {
    return axiosClient.put(`/products/${productId}`, payload);
  },

  // Delete a product (Only for Admins)
  deleteProduct: (productId) => {
    return axiosClient.delete(`/products/${productId}`);
  },

  // Fetch all deals
  getAllDeals: () => {
    return axiosClient.get("/deals");
  },

  // Create a new deal
  createDeal: (dealData) => {
    return axiosClient.post("/deals", dealData);
  },

  // Update deal status (e.g., for admin approval)
  updateDealStatus: (dealId) => {
    return axiosClient.put(`/deals/${dealId}/approve`);
  },

  // Delete a product (Only for Admins)
  deleteDeal: (dealId) => {
    return axiosClient.delete(`/deals/${dealId}`);
  },
};

export default api;
