import axios from "axios";
import * as cheerio from "cheerio";

const baseURL =
  window.location.hostname === "localhost"
    ? "https://api.sklad4phone.ru"
    : "https://api.sklad4phone.ru";

// const baseURL = "https://api.sklad4phone.ru";

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000, // Set timeout to 10 seconds
});

const urlParams = new URLSearchParams(window.location.search);
export const phoneNumberConst = urlParams.get("phoneNumber");

const handleAxiosError = (error) => {
  if (error.response) {
    console.error("Error:", error.response.data.message);
  } else if (error.request) {
    console.error("No response from server:", error.request);
  } else {
    console.error("Error", error.message);
  }
};

export const getUserByPhoneNumber = async (phoneNumber = phoneNumberConst) => {
  try {
    const response = await axiosInstance.get(`/users/get`, {
      params: { phoneNumber }, // Pass phoneNumber as a query parameter
    });

    console.log("User data:", response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    return null;
  }
};

export const updateUserById = async (id, updateData) => {
  try {
    const response = await axiosInstance.patch(`/users/update`, updateData, {
      params: { id }, // Pass ID as a query parameter
    });

    console.log("Updated user data:", response.data);
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
    const response = await axiosInstance.post("/sales/create", saleData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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

export const getSaleInHistoryById = async (
  id,
  phoneNumber = phoneNumberConst
) => {
  try {
    const response = await axiosInstance.get(
      `/sales/${id}/${phoneNumber}/history`
    );
    console.log("HistorySale data by ID:", response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

export const createLog = async (message, phone = phoneNumberConst) => {
  try {
    const response = await axiosInstance.post("/logs/", {
      phoneNumber: phone,
      action: message,
    });
    console.log("HistorySale data by ID:", response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

export const getAllUserLogs = async (id) => {
  try {
    const response = await axiosInstance.get(`/logs/${id}`);
    console.log("HistorySale data by ID:", response.data);
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

export const buyForSale = async (id, quantity) => {
  try {
    const response = await axiosInstance.post(`/sales/${id}/buy`, {
      quantity,
      phoneNumber: phoneNumberConst,
    });
    alert("Сбор успешно оплачен!");
    console.log("Sale purchased:", response.data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      // Check if the error message indicates insufficient funds
      if (error.response.data.message === "Insufficient balance") {
        alert("У вас не достаточно средств на счёте.");
      }
    }
    handleAxiosError(error);
    throw error;
  }
};

export const calcelSale = async (id) => {
  try {
    const response = await axiosInstance.post(`/sales/${id}/cancel`);
    console.log("Sale calcelled:", response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

export const getUserOrders = async (phone = phoneNumberConst) => {
  try {
    const response = await axiosInstance.get(`/sales/userorders/${phone}`);
    console.log("User orders retrieved:", response.data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      alert("Пользователь с таким номером телефона не найден.");
    }
    handleAxiosError(error);
    throw error;
  }
};
export const getOrderUsers = async (sale_id) => {
  try {
    const response = await axiosInstance.get(`/sales/getOrderUsers/${sale_id}`);
    console.log("User orders retrieved:", response.data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      alert("Данного сбора не найдено");
    }
    handleAxiosError(error);
    throw error;
  }
};

// Function to create a new support ticket
export const createSupportTicket = async (supportData) => {
  try {
    const response = await axiosInstance.post("/support", {
      subject: supportData.subject,
      message: supportData.message,
      phoneNumber: phoneNumberConst,
    });
    console.log("Support ticket created:", response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

// Function to get all support tickets
export const getAllSupportTickets = async () => {
  try {
    const response = await axiosInstance.get("/support/");
    console.log("All support tickets:", response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

// Function to get a support ticket by ID
export const getUserSupportTickets = async () => {
  try {
    const response = await axiosInstance.get(`/support/${phoneNumberConst}`);
    console.log("Support ticket data:", response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

// Function to update a support ticket by ID
export const updateSupportTicket = async (id, updateData) => {
  try {
    const response = await axiosInstance.put(
      `/support/tickets/${id}`,
      updateData
    );
    console.log("Updated support ticket:", response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

// Function to delete a support ticket by ID
export const deleteSupportTicket = async (id) => {
  try {
    const response = await axiosInstance.delete(`/support/tickets/${id}`);
    console.log("Support ticket deleted:", response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

// Function to update the status of a support ticket
export const updateSupportTicketStatus = async (id, status) => {
  try {
    const response = await axiosInstance.patch(
      `/support/tickets/${id}/status`,
      {
        status,
      }
    );
    console.log("Updated support ticket status:", response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

// Function to get all transactions
export const getAllTransactions = async () => {
  try {
    const response = await axiosInstance.get("/transactions");
    console.log("All transactions:", response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

// Function to get a single transaction by ID
export const getTransactionById = async (id) => {
  try {
    const response = await axiosInstance.get(`/transactions/${id}`);
    console.log(`Transaction ${id}:`, response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

// Function to create a new transaction
export const createTransaction = async (amount, saleId = null) => {
  try {
    const response = await axiosInstance.post("/transactions", {
      phoneNumber: phoneNumberConst,
      amount,
      saleId,
    });
    console.log("Created transaction:", response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

// Function to update the status of a transaction
export const updateTransactionStatus = async (id, paid = false) => {
  try {
    const response = await axiosInstance.patch(
      `/transactions/${id}/setpaidstatus`,
      {
        paid,
      }
    );
    console.log(`Updated transaction ${id} status:`, response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

// Function to send a notification to a user
export const sendNotification = async (message) => {
  try {
    const response = await axiosInstance.post("/notifications/send", {
      phoneNumber: phoneNumberConst,
      message,
    });
    console.log(`Notification sent to ${phoneNumberConst}:`, response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

// Create a transaction for a specific user
export const createBybitTransaction = async (
  additionalAmount,
  saleId = null
) => {
  try {
    const response = await axiosInstance.post(
      `/bybit/${phoneNumberConst}/create`,
      {
        additionalAmount,
        saleId, // Include saleId in the payload
      }
    );
    return response.data; // Returns the created transaction details
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
};

// Verify a transaction for a specific user
export const verifyBybitTransaction = async (saleId = null) => {
  try {
    const response = await axiosInstance.get(
      `/bybit/${phoneNumberConst}/verify`,
      {
        params: { saleId }, // Pass saleId as a query parameter
      }
    );
    return response.data; // Returns verification result and balance
  } catch (error) {
    console.error("Error verifying transaction:", error);
    throw error;
  }
};

// export const getCource = async () => {
//   try {
//     axios
//       .get("https://api.binance.com/api/v3/avgPrice?symbol=USDUSDT")
//       .then((response) => {
//         const body = response.data;
//         console.log(body.price);
//       });

//     // // Выводим результат
//     // console.log(`Exchange Rate: ${exchangeRateText}`);
//   } catch (error) {
//     console.error(`Error fetching data from:`, error);
//   }
// };

export const getCource = async () => {
  try {
    const response = await axiosInstance.get("/sales/getCource");

    console.log("cource");
    console.log(response);
    return 1 / response.data.price;
  } catch (error) {
    console.error("Произошла ошибка при получении данных:", error);
  }
};

// export const getCource = async () => {
//   try {
//     const responseEUR = await fetch("https://www.cbr-xml-daily.ru/latest.js");
//     if (!responseEUR.ok) {
//       throw new Error(`Error fetching data: ${responseEUR.statusText}`);
//     }

//     const data = await responseEUR.json();
//     const eurRate = data.rates.EUR;

//     const responseUSDT = await fetch(
//       "https://api.binance.com/api/v3/avgPrice?symbol=EURUSDT",
//     );

//     const dataUSDT = await responseUSDT.json();
//     const usdtRate = dataUSDT.price;

//     console.log(eurRate * usdtRate);
//     return eurRate * usdtRate;
//   } catch (error) {
//     console.error("Failed to get exchange rate:", error);
//   }
// };

export const broadcastNotification = async (formData) => {
  try {
    // Optional: Check if formData contains message and files before sending
    if (!formData.get("message")) {
      alert("Сообщение не может быть пустым!");
      return;
    }
    // Send POST request to backend `/broadcast` endpoint
    const response = await axiosInstance.post(
      "/notifications/broadcast",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure it's multipart/form-data
        },
      }
    );

    console.log("Broadcast sent successfully:", response.data);
    // alert("Сообщение успешно отправлено!");
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Server responded with error:", error.response.data);
      alert(
        "Ошибка при отправке сообщения: " + error.response.data.message ||
          "Неизвестная ошибка."
      );
    } else {
      console.error("Error sending broadcast notification:", error.message);
      alert("Ошибка при отправке сообщения.");
    }
    throw error;
  }
};

// Fetch an agreement by type (e.g., "offer", "service_rules", "warranty")
export const getAgreementByType = async (type) => {
  try {
    const response = await axiosInstance.get(`/agreements/${type}`);
    console.log(`Agreement data for type "${type}":`, response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

// Update an agreement text by type
export const updateAgreementByType = async (type, newText) => {
  try {
    const response = await axiosInstance.put(`/agreements/${type}`, {
      text: newText,
    });
    console.log(`Updated agreement for type "${type}":`, response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};
