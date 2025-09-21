import api from "../api";

// ✅ Get all transactions
export const getTransactions = () => api.get("/transactions");

