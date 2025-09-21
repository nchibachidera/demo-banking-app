import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); // go back to home
  };

  return (
    <div className="text-center">
      <h1>Welcome to MyBank (Demo)</h1>
      <p className="lead">
        This is a demo banking app. Use Register to create an account or Login
        if you already have one.
      </p>

      {!token ? (
        <div>
          <Link to="/register" className="btn btn-success m-2">
            Register
          </Link>
          <Link to="/login" className="btn btn-primary m-2">
            Login
          </Link>
        </div>
      ) : (
        <div>
          <Link to="/dashboard" className="btn btn-warning m-2">
            Go to Dashboard
          </Link>
          <button onClick={handleLogout} className="btn btn-danger m-2">
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

