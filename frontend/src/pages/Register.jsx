import React, {useState} from 'react';
import axios from 'axios';

export default function Register(){
  const [full_name, setFull] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try{
      const res = await axios.post('http://localhost:5000/api/auth/register', { full_name, email, password });
      setMsg('Registered! Token received (demo).');
      localStorage.setItem('token', res.data.token);
    }catch(err){
      setMsg(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="col-md-6 offset-md-3">
      <h2>Register</h2>
      <form onSubmit={submit}>
        <div className="mb-3">
          <label className="form-label">Full name</label>
          <input className="form-control" value={full_name} onChange={e=>setFull(e.target.value)} required/>
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input className="form-control" value={email} onChange={e=>setEmail(e.target.value)} type="email" required/>
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input className="form-control" value={password} onChange={e=>setPassword(e.target.value)} type="password" required/>
        </div>
        <button className="btn btn-primary">Register</button>
        {msg && <div className="mt-3 alert alert-info">{msg}</div>}
      </form>
    </div>
  );
}
