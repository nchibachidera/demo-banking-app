import React, {useState} from 'react';
import axios from 'axios';

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try{
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      setMsg('Logged in! Token saved.');
      localStorage.setItem('token', res.data.token);
    }catch(err){
      setMsg(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="col-md-6 offset-md-3">
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input className="form-control" value={email} onChange={e=>setEmail(e.target.value)} type="email" required/>
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input className="form-control" value={password} onChange={e=>setPassword(e.target.value)} type="password" required/>
        </div>
        <button className="btn btn-primary">Login</button>
        {msg && <div className="mt-3 alert alert-info">{msg}</div>}
      </form>
    </div>
  );
}
