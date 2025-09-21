import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService'; // <-- use the service

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser({ email, password }); // <-- use authService
      localStorage.setItem('token', res.data.token);
      setMsg('Login successful! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error logging in');
    }
  };

  return (
    <div className="col-md-6 offset-md-3">
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            className="form-control"
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            className="form-control"
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
            required
          />
        </div>
        <button className="btn btn-primary">Login</button>
        {msg && <div className="mt-3 alert alert-info">{msg}</div>}
      </form>
    </div>
  );
}



