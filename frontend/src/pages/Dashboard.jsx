import React, {useEffect, useState} from 'react';
import axios from 'axios';

export default function Dashboard(){
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [msg, setMsg] = useState('');

  const token = localStorage.getItem('token');

  useEffect(()=>{
    if(!token) return;
    const fetchAcc = async ()=>{
      try{
        const res = await axios.get('http://localhost:5000/api/accounts', { headers: { Authorization: 'Bearer '+token } });
        setAccount(res.data);
        const tx = await axios.get('http://localhost:5000/api/transactions', { headers: { Authorization: 'Bearer '+token } });
        setTransactions(tx.data);
      }catch(err){
        console.error(err);
      }
    };
    fetchAcc();
  }, [token]);

  const deposit = async ()=>{
    try{
      const res = await axios.post('http://localhost:5000/api/accounts/deposit', { amount }, { headers: { Authorization: 'Bearer '+token } });
      setAccount({ ...account, balance: res.data.balance });
      setMsg('Deposit successful');
    }catch(err){
      setMsg(err.response?.data?.message || 'Error');
    }
  };

  const withdraw = async ()=>{
    try{
      const res = await axios.post('http://localhost:5000/api/accounts/withdraw', { amount }, { headers: { Authorization: 'Bearer '+token } });
      setAccount({ ...account, balance: res.data.balance });
      setMsg('Withdrawal successful');
    }catch(err){
      setMsg(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="col-md-8 offset-md-2">
      <h2>Dashboard</h2>
      {account ? (
        <div>
          <div className="card mb-3">
            <div className="card-body">
              <h5>Account Number: {account.account_number}</h5>
              <h3>Balance: ₦{account.balance}</h3>
            </div>
          </div>
          <div className="input-group mb-3">
            <input className="form-control" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Amount" type="number" />
            <button className="btn btn-success" onClick={deposit}>Deposit</button>
            <button className="btn btn-warning" onClick={withdraw}>Withdraw</button>
          </div>
          {msg && <div className="alert alert-info">{msg}</div>}
          <h4>Transactions</h4>
          <ul className="list-group">
            {transactions.map(tx=> <li key={tx.id} className="list-group-item">{tx.type} ₦{tx.amount} — {new Date(tx.created_at).toLocaleString()}</li>)}
          </ul>
        </div>
      ) : (
        <p>Please login to view your dashboard.</p>
      )}
    </div>
  );
}
