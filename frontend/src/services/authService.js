// authService.js
import API from "../api";

// Register user
export async function registerUser(userData) {
  return API.post("/auth/register", userData); // <-- remove /api here
}

// Login user
export async function loginUser(credentials) {
  const res = await API.post("/auth/login", credentials); // <-- remove /api here
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
  }
  return res;
}

