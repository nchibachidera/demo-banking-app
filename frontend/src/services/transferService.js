 import api from "../api";

export const transferAmount = (token, transferData) =>
  api.post("/accounts/transfer", transferData, {
    headers: { Authorization: `Bearer ${token}` },
  });