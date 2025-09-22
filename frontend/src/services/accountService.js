import api from "../api";

// ✅ Get account info
export const getAccount = (token) =>
  api.get("/accounts", {
    headers: { Authorization: `Bearer ${token}` },
  });

// ✅ Deposit money
export const depositAmount = (token, amount) =>
  api.post(
    "/accounts/deposit",
    { amount },
    { headers: { Authorization: `Bearer ${token}` } }
  );

// ✅ Withdraw money
export const withdrawAmount = (token, amount) =>
  api.post(
    "/accounts/withdraw",
    { amount },
    { headers: { Authorization: `Bearer ${token}` } }
  );




