import { jwtDecode } from "jwt-decode";
import jsPDF from "jspdf";
import "jspdf-autotable";

export const decodeToken = () => {
  const token = localStorage.getItem("token");
  const user = jwtDecode(token);
  return user;
};

export const logout = () => {
  return localStorage.removeItem("token");
};

export const generatePDF = (deal) => {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(20);
  doc.text("Quotation", 105, 20, null, null, "center");

  // Add Deal Details
  doc.setFontSize(12);
  doc.text(`Deal ID: ${deal.id}`, 20, 40);
  doc.text(`Partner: ${deal.partner.username}`, 20, 50);
  doc.text(`Total Price: $${deal.deal_price}`, 20, 60);

  // Add Product Details Table
  const productRows = deal.product_deals.map((productDeal) => [
    productDeal.product.name,
    `$${productDeal.product.price}`,
  ]);

  doc.autoTable({
    startY: 70,
    head: [["Product Name", "Price"]],
    body: productRows,
  });

  // Add Customer Details Table
  const customerRows = deal.customer_deals.map((customerDeal) => [
    customerDeal.customer.id,
    customerDeal.customer.username,
  ]);

  doc.autoTable({
    startY: doc.autoTable.previous.finalY + 20,
    head: [["Customer Id", "Customer Username"]],
    body: customerRows,
  });

  // Save PDF
  doc.save(`Quotation_Deal_${deal.id}.pdf`);
};
