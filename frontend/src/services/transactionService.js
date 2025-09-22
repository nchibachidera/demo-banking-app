import api from "../api";

export const getTransactions = (token) =>
  api.get("/transactions", {
    headers: { Authorization: `Bearer ${token}` },
  });



