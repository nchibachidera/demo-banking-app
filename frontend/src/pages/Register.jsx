import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService'; // <-- use the service

export default function Register() {
  const [full_name, setFull] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await registerUser({ full_name, email, password }); // <-- call service
      localStorage.setItem('token', res.data.token);
      setMsg('Registration successful! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error registering user');
    }
  };

  return (
    <div className="col-md-6 offset-md-3">
      <h2>Register</h2>
      <form onSubmit={submit}>
        <div className="mb-3">
          <label className="form-label">Full name</label>
          <input
            className="form-control"
            value={full_name}
            onChange={e => setFull(e.target.value)}
            required
          />
        </div>
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
        <button className="btn btn-primary">Register</button>
        {msg && <div className="mt-3 alert alert-info">{msg}</div>}
      </form>
    </div>
  );
}



