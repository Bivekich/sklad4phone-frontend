import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://api.sklad4phone.ru",
  //   baseURL: "http://localhost:3000",
  timeout: 10000, // Set timeout to 10 seconds
});

const getUserByPhoneNumber = async (phoneNumber) => {
  try {
    const response = await axiosInstance.post("/users/get", {
      phoneNumber: phoneNumber,
    });

    console.log("User data:", response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

const handleAxiosError = (error) => {
  if (error.response) {
    console.error("Error:", error.response.data.message);
  } else if (error.request) {
    console.error("No response from server:", error.request);
  } else {
    console.error("Error", error.message);
  }
};

// Export the user after it is fetched
export const user = await getUserByPhoneNumber("+79521514787");
