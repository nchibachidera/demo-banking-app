import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAccount, depositAmount, withdrawAmount } from "../services/accountService";
import { getTransactions } from "../services/transactionService";

export default function Dashboard() {
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login"); // 🚀 redirect if not logged in
      return;
    }

    const fetchData = async () => {
      try {
        const acc = await getAccount(token);
        setAccount(acc.data);

        const tx = await getTransactions(token); // ✅ now passes token
        setTransactions(tx.data);
      } catch (err) {
        console.error(err);
        setMsg("❌ Failed to load account or transactions.");
      }
    };

    fetchData();
  }, [token, navigate]);

  const refreshData = async () => {
    try {
      const acc = await getAccount(token);
      setAccount(acc.data);

      const tx = await getTransactions(token); // ✅ now passes token
      setTransactions(tx.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeposit = async () => {
    if (!amount) return setMsg("Enter an amount first!");
    try {
      await depositAmount(token, amount); // ✅ token passed
      setMsg("✅ Deposit successful");
      setAmount("");
      refreshData();
    } catch (err) {
      setMsg(err.response?.data?.message || "Deposit failed");
    }
  };

  const handleWithdraw = async () => {
    if (!amount) return setMsg("Enter an amount first!");
    try {
      await withdrawAmount(token, amount); // ✅ token passed
      setMsg("✅ Withdrawal successful");
      setAmount("");
      refreshData();
    } catch (err) {
      setMsg(err.response?.data?.message || "Withdrawal failed");
    }
  };

  return (
    <div className="col-md-8 offset-md-2">
      <h2 className="mb-4">Dashboard</h2>
      {account ? (
        <div>
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Account Number: {account.account_number}</h5>
              <h3 className="card-text">Balance: ₦{account.balance}</h3>
            </div>
          </div>

          <div className="input-group mb-3">
            <input
              className="form-control"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              type="number"
              min="1"
            />
            <button className="btn btn-success" onClick={handleDeposit}>
              Deposit
            </button>
            <button className="btn btn-warning" onClick={handleWithdraw}>
              Withdraw
            </button>
          </div>

          {msg && <div className="alert alert-info">{msg}</div>}

          <h4 className="mt-4">Transactions</h4>
          {transactions.length > 0 ? (
            <ul className="list-group">
              {transactions.map((tx) => (
                <li key={tx.id} className="list-group-item">
                  <strong>{tx.type}</strong> ₦{tx.amount} —{" "}
                  {new Date(tx.created_at).toLocaleString()}
                </li>
              ))}
            </ul>
          ) : (
            <p>No transactions yet.</p>
          )}
        </div>
      ) : (
        <p>Loading account details...</p>
      )}
    </div>
  );
}



