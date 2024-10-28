import axios from "axios";

const baseURL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://api.sklad4phone.ru";

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000, // Set timeout to 10 seconds
});

export const phoneNumber = "+79521514787";

const handleAxiosError = (error) => {
  if (error.response) {
    console.error("Error:", error.response.data.message);
  } else if (error.request) {
    console.error("No response from server:", error.request);
  } else {
    console.error("Error", error.message);
  }
};

export const getUserByPhoneNumber = async (phoneNumber) => {
  try {
    const response = await axiosInstance.get(`/users/get`, {
      params: { phoneNumber: phoneNumber }, // Pass phoneNumber as a query parameter
    });

    console.log("User data:", response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

// New function to fetch all users
export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get(`/users`); // Make GET request to /users endpoint

    console.log("All users data:", response.data);
    return response.data; // Return the list of users
  } catch (error) {
    handleAxiosError(error); // Handle any errors
    throw error; // Re-throw the error for further handling
  }
};

// Function to create a new sale
export const createSale = async (saleData) => {
  try {
    const response = await axiosInstance.post("/sales", saleData);
    console.log("Sale created:", response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

// Function to get all sales
export const getAllSales = async () => {
  try {
    const response = await axiosInstance.get("/sales");
    console.log("All sales data:", response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

// Function to get a sale by its ID
export const getSaleById = async (id) => {
  try {
    const response = await axiosInstance.get(`/sales/${id}`);
    console.log("Sale data by ID:", response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

// Function to update a sale by its ID
export const updateSale = async (id, updateData) => {
  try {
    const response = await axiosInstance.put(`/sales/${id}`, updateData);
    console.log("Updated sale data:", response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

// Function to delete a sale by its ID
export const deleteSale = async (id) => {
  try {
    const response = await axiosInstance.delete(`/sales/${id}`);
    console.log("Sale deleted:", response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};
