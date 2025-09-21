import api from "../api";

// ✅ Get account info
export const getAccount = () => api.get("/accounts/me"); // <-- updated

// ✅ Deposit money
export const depositAmount = (amount) => api.post("/accounts/deposit", { amount });

// ✅ Withdraw money
export const withdrawAmount = (amount) => api.post("/accounts/withdraw", { amount });

