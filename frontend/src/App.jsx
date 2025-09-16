import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App(){ 
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <Link className="navbar-brand" to="/">MyBank</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
        </Routes>
      </div>
    </Router>
  );
}
