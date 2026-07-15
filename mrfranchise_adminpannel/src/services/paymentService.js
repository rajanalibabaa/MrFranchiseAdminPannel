import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/v1",
});

export const fetchPaymentHistoryAPI = async (params) => {
  const response = await API.get(
    "/payment/allpayment/history",
    {
      params,
    }
  );

  return response.data;
};