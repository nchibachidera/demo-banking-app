import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAccount, depositAmount, withdrawAmount } from "../services/accountService";
import { getTransactions } from "../services/transactionService";

const BankingDashboard = () => {
  // Original state from your dashboard
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // UI state for the enhanced interface
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showBalance, setShowBalance] = useState(true);

  // Your original authentication and data fetching logic
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    const fetchData = async () => {
      try {
        const acc = await getAccount(token);
        setAccount(acc.data);
        const tx = await getTransactions(token);
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
      const tx = await getTransactions(token);
      setTransactions(tx.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeposit = async () => {
    if (!amount) return setMsg("Enter an amount first!");
    try {
      await depositAmount(token, amount);
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
      await withdrawAmount(token, amount);
      setMsg("✅ Withdrawal successful");
      setAmount("");
      refreshData();
    } catch (err) {
      setMsg(err.response?.data?.message || "Withdrawal failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Dashboard component with real data
  const Dashboard = () => (
    <div className="row g-4">
      {/* Welcome Section */}
      <div className="col-12">
        <div className="card border-0 shadow-sm rounded-4" 
             style={{ background: 'linear-gradient(135deg, #007bff, #6f42c1)' }}>
          <div className="card-body text-white p-4">
            <h1 className="h3 fw-bold mb-2">Welcome back!</h1>
            <p className="mb-0 opacity-75">Here's your financial overview</p>
          </div>
        </div>
      </div>

      {/* Account Balance Card */}
      {account && (
        <div className="col-12">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h5 className="card-title fw-semibold mb-1">Main Account</h5>
                  <small className="text-muted">Account: {account.account_number}</small>
                </div>
                <span className="badge bg-primary rounded-pill">💳</span>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="display-5 fw-bold text-dark mb-1">
                    {showBalance ? `₦${parseFloat(account.balance).toFixed(2)}` : '••••••'}
                  </h2>
                  <small className="text-success">Available Balance</small>
                </div>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="btn btn-outline-secondary btn-sm rounded-circle"
                  style={{ width: '40px', height: '40px' }}
                >
                  {showBalance ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deposit/Withdraw Section */}
      <div className="col-12">
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-4">
            <h5 className="card-title fw-bold mb-4">Quick Actions</h5>
            <div className="row g-3">
              <div className="col-md-6">
                <input
                  className="form-control form-control-lg"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  type="number"
                  min="1"
                />
              </div>
              <div className="col-md-6">
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-success btn-lg flex-fill"
                    onClick={handleDeposit}
                  >
                    ➕ Deposit
                  </button>
                  <button 
                    className="btn btn-warning btn-lg flex-fill"
                    onClick={handleWithdraw}
                  >
                    📤 Withdraw
                  </button>
                </div>
              </div>
            </div>
            {msg && (
              <div className={`alert mt-3 ${
                msg.includes('✅') ? 'alert-success' : 'alert-danger'
              }`}>
                {msg}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="col-12">
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-header bg-transparent border-0 p-4">
            <h5 className="card-title fw-bold mb-0">Recent Transactions</h5>
          </div>
          <div className="card-body p-0">
            {transactions.length > 0 ? (
              <div className="list-group list-group-flush">
                {transactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="list-group-item border-0 p-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <div className={`rounded-3 d-inline-flex align-items-center justify-content-center me-3 ${
                          transaction.type === 'deposit' ? 'bg-success-subtle' : 'bg-danger-subtle'
                        }`} style={{ width: '45px', height: '45px' }}>
                          <span style={{ fontSize: '1.2rem' }}>
                            {transaction.type === 'deposit' ? '📥' : '📤'}
                          </span>
                        </div>
                        <div>
                          <h6 className="mb-1 fw-semibold text-capitalize">{transaction.type}</h6>
                          <small className="text-muted">{new Date(transaction.created_at).toLocaleDateString()}</small>
                        </div>
                      </div>
                      <h6 className={`mb-0 fw-bold ${
                        transaction.type === 'deposit' ? 'text-success' : 'text-danger'
                      }`}>
                        {transaction.type === 'deposit' ? '+' : '-'}₦{parseFloat(transaction.amount).toFixed(2)}
                      </h6>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-5">
                <div className="text-muted mb-3" style={{ fontSize: '3rem' }}>💳</div>
                <h6 className="text-muted">No transactions yet.</h6>
                <small className="text-muted">Start by making a deposit or withdrawal above!</small>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // All Transactions view
  const Transactions = () => (
    <div className="row g-4">
      <div className="col-12">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">All Transactions</h2>
        </div>
      </div>

      <div className="col-12">
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-0">
            {transactions.length > 0 ? (
              <div className="list-group list-group-flush">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="list-group-item border-0 p-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <div className={`rounded-3 d-inline-flex align-items-center justify-content-center me-3 ${
                          transaction.type === 'deposit' ? 'bg-success-subtle' : 'bg-danger-subtle'
                        }`} style={{ width: '50px', height: '50px' }}>
                          <span style={{ fontSize: '1.5rem' }}>
                            {transaction.type === 'deposit' ? '📥' : '📤'}
                          </span>
                        </div>
                        <div>
                          <h6 className="mb-1 fw-semibold text-capitalize">{transaction.type}</h6>
                          <small className="text-muted">
                            {new Date(transaction.created_at).toLocaleString()}
                          </small>
                        </div>
                      </div>
                      <div className="text-end">
                        <h6 className={`mb-1 fw-bold ${
                          transaction.type === 'deposit' ? 'text-success' : 'text-danger'
                        }`}>
                          {transaction.type === 'deposit' ? '+' : '-'}₦{parseFloat(transaction.amount).toFixed(2)}
                        </h6>
                        {account && (
                          <small className="text-muted">Balance: ₦{parseFloat(account.balance).toFixed(2)}</small>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-5">
                <div className="text-muted mb-3" style={{ fontSize: '4rem' }}>💳</div>
                <h5 className="text-muted">No transactions found.</h5>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Account Overview
  const AccountOverview = () => (
    <div className="row g-4">
      <div className="col-12">
        <h2 className="fw-bold">Account Overview</h2>
      </div>
      
      {account && (
        <>
          {/* Total Balance Card */}
          <div className="col-12">
            <div className="card border-0 shadow-lg rounded-4" 
                 style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              <div className="card-body text-white p-5">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="mb-2 opacity-75">Account Balance</p>
                    <h1 className="display-3 fw-bold mb-3">
                      {showBalance ? `₦${parseFloat(account.balance).toLocaleString()}` : '••••••••'}
                    </h1>
                    <p className="mb-0 opacity-75">Account: {account.account_number}</p>
                  </div>
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="btn btn-outline-light rounded-circle"
                    style={{ width: '50px', height: '50px' }}
                  >
                    {showBalance ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="col-12">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div>
                    <h4 className="fw-semibold mb-1">Main Account</h4>
                    <p className="text-muted mb-0">Account Number: {account.account_number}</p>
                  </div>
                  <span className="badge bg-primary rounded-pill px-3 py-2">Active</span>
                </div>
                
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h2 className="display-4 fw-bold text-dark mb-1">
                      {showBalance ? `₦${parseFloat(account.balance).toLocaleString()}` : '••••••••'}
                    </h2>
                    <small className="text-success">Available Balance</small>
                  </div>
                  <div className="d-flex gap-2">
                    <button 
                      onClick={() => setActiveTab('dashboard')}
                      className="btn btn-primary rounded-pill px-4"
                    >
                      Manage Account
                    </button>
                  </div>
                </div>

                {/* Account activity indicator */}
                <div className="card bg-light border-0 rounded-3" style={{ minHeight: '80px' }}>
                  <div className="card-body d-flex align-items-center justify-content-center">
                    <span className="me-2" style={{ fontSize: '2rem' }}>📈</span>
                    <span className="text-primary fw-semibold">
                      {transactions.length} transactions total
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderContent = () => {
    if (!account) {
      return (
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Loading account details...</p>
          </div>
        </div>
      );
    }

    switch(activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'transactions': return <Transactions />;
      case 'accounts': return <AccountOverview />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container-fluid px-4">
          <div className="d-flex align-items-center">
            <div className="bg-gradient rounded-3 me-2" 
                 style={{ width: '32px', height: '32px', background: 'linear-gradient(45deg, #007bff, #6f42c1)' }}></div>
            <span className="navbar-brand h4 fw-bold mb-0">MyBank</span>
          </div>
          
          <div className="d-none d-lg-flex ms-5">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
              { id: 'transactions', label: 'Transactions', icon: '💳' },
              { id: 'accounts', label: 'Account', icon: '📊' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`btn btn-link text-decoration-none me-3 ${
                  activeTab === tab.id 
                    ? 'text-primary fw-semibold' 
                    : 'text-secondary'
                }`}
              >
                <span className="me-1">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="d-flex align-items-center">
            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3" 
                 style={{ width: '32px', height: '32px' }}>
              <span>👤</span>
            </div>
            <button className="btn btn-link text-secondary p-1 me-2">⚙️</button>
            <button 
              className="btn btn-link text-secondary p-1" 
              onClick={handleLogout}
              title="Logout"
            >
              🚪
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="d-lg-none bg-white border-top">
        <div className="d-flex justify-content-around py-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
            { id: 'transactions', label: 'Transactions', icon: '💳' },
            { id: 'accounts', label: 'Account', icon: '📊' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`btn btn-link text-decoration-none d-flex flex-column align-items-center p-2 ${
                activeTab === tab.id ? 'text-primary' : 'text-secondary'
              }`}
            >
              <span style={{ fontSize: '1.2rem' }}>{tab.icon}</span>
              <small className="mt-1">{tab.label}</small>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="container-fluid px-4 py-4" style={{ maxWidth: '1400px' }}>
        {renderContent()}
      </main>
    </div>
  );
};

export default BankingDashboard;