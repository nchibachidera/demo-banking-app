import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAccount, depositAmount, withdrawAmount, transferAmount } from "../services/accountService";
import { getTransactions } from "../services/transactionService";

const ProfessionalBankingDashboard = () => {
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showBalance, setShowBalance] = useState(true);

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
        setMsg("Failed to load account or transactions.");
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
      setMsg("Deposit successful");
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
      setMsg("Withdrawal successful");
      setAmount("");
      refreshData();
    } catch (err) {
      setMsg(err.response?.data?.message || "Withdrawal failed");
    }
  };


  const handleTransfer = async () => {
    if (!amount) return setMsg("Enter an amount first!");
    try {
      await transferAmount(token, amount);
      setMsg("transfer successful");
      setAmount("");
      refreshData();
    } catch (err) {
      setMsg(err.response?.data?.message || "transfer failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const Dashboard = () => (
    <div className="row g-0">
      {/* Main Content */}
      <div className="col-md-8">
        <div className="p-4">
          {/* Balance Cards */}
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <div className="card border-0" style={{ backgroundColor: '#f8f9fc' }}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="text-muted small">Total Balance</span>
                    <span className="badge bg-success small">+2.36%</span>
                  </div>
                  {account && (
                    <h3 className="mb-0 fw-bold" style={{ color: '#2c3e50' }}>
                      {showBalance ? `₦${parseFloat(account.balance).toFixed(2)}` : '••••••'}
                    </h3>
                  )}
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card border-0" style={{ backgroundColor: '#f8f9fc' }}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="text-muted small">Available</span>
                    <span className="badge bg-info small">Available</span>
                  </div>
                  {account && (
                    <h3 className="mb-0 fw-bold" style={{ color: '#2c3e50' }}>
                      {showBalance ? `₦${parseFloat(account.balance).toFixed(2)}` : '••••••'}
                    </h3>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card border-0 mb-4" style={{ backgroundColor: '#ffffff', boxShadow: '0 0.125rem 0.25rem rgba(0,0,0,0.075)' }}>
            <div className="card-header bg-transparent border-0 pt-3 pb-2">
              <h6 className="mb-0 fw-semibold" style={{ color: '#2c3e50' }}>Quick Transfer</h6>
            </div>
            <div className="card-body pt-2">
              <div className="row g-3">
                <div className="col-md-8">
                  <input
                    className="form-control"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    type="text"
                    inputMode="decimal"
                    style={{ border: '1px solid #e3e6f0', borderRadius: '0.35rem' }}
                  />
                </div>
                <div className="col-md-4">
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-sm flex-fill"
                      onClick={handleDeposit}
                      style={{ 
                        backgroundColor: '#1cc88a', 
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.35rem'
                      }}
                    >
                      Deposit
                    </button>
                    <button 
                      className="btn btn-sm flex-fill"
                      onClick={handleWithdraw}
                      style={{ 
                        backgroundColor: '#f6c23e', 
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.35rem'
                      }}
                    >
                      Withdraw
                    </button>
                  </div>
                </div>
              </div>
              {msg && (
                <div className={`mt-2 p-2 small rounded ${
                  msg.includes('successful') 
                    ? 'text-success' 
                    : 'text-danger'
                }`} style={{ backgroundColor: msg.includes('successful') ? '#d1e7dd' : '#f8d7da' }}>
                  {msg}
                </div>
              )}
            </div>
          </div>

          {/* Statistics Chart Placeholder */}
          <div className="card border-0" style={{ backgroundColor: '#ffffff', boxShadow: '0 0.125rem 0.25rem rgba(0,0,0,0.075)' }}>
            <div className="card-header bg-transparent border-0 pt-3 pb-2">
              <h6 className="mb-0 fw-semibold" style={{ color: '#2c3e50' }}>Account Activity</h6>
            </div>
            <div className="card-body">
              <div style={{ height: '200px', backgroundColor: '#f8f9fc', borderRadius: '0.25rem' }} className="d-flex align-items-center justify-content-center">
                <div className="text-center text-muted">
                  <div style={{ fontSize: '48px', marginBottom: '8px' }}>📊</div>
                  <small>Account activity chart</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="col-md-4" style={{ backgroundColor: '#f8f9fc', borderLeft: '1px solid #e3e6f0' }}>
        <div className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0 fw-semibold" style={{ color: '#2c3e50' }}>Transactions</h6>
            <button 
              className="btn btn-sm btn-link p-0 text-decoration-none"
              onClick={() => setActiveTab('transactions')}
              style={{ color: '#858796' }}
            >
              View all
            </button>
          </div>
          
          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {transactions.length > 0 ? (
              transactions.slice(0, 8).map((transaction) => (
                <div key={transaction.id} className="d-flex align-items-center mb-3 p-2 rounded" style={{ backgroundColor: 'white' }}>
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{ 
                      width: '40px', 
                      height: '40px',
                      backgroundColor: transaction.type === 'deposit' ? '#1cc88a20' : '#e74a3b20'
                    }}
                  >
                    <div style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%',
                      backgroundColor: transaction.type === 'deposit' ? '#1cc88a' : '#e74a3b'
                    }}></div>
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="fw-medium small text-capitalize" style={{ color: '#2c3e50' }}>
                          {transaction.type}
                        </div>
                        <div className="text-muted" style={{ fontSize: '11px' }}>
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-end">
                        <div className={`fw-medium small ${
                          transaction.type === 'deposit' ? 'text-success' : 'text-danger'
                        }`}>
                          {transaction.type === 'deposit' ? '+' : '-'}₦{parseFloat(transaction.amount).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted py-4">
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>💳</div>
                <small>No transactions yet</small>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const Transactions = () => (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0 fw-semibold" style={{ color: '#2c3e50' }}>All Transactions</h5>
      </div>

      <div className="card border-0" style={{ boxShadow: '0 0.125rem 0.25rem rgba(0,0,0,0.075)' }}>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead style={{ backgroundColor: '#f8f9fc' }}>
              <tr>
                <th className="border-0 fw-medium text-muted small py-3">Type</th>
                <th className="border-0 fw-medium text-muted small py-3">Date</th>
                <th className="border-0 fw-medium text-muted small py-3 text-end">Amount</th>
                <th className="border-0 fw-medium text-muted small py-3 text-end">Balance</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="py-3">
                      <div className="d-flex align-items-center">
                        <div 
                          className="rounded-circle d-flex align-items-center justify-content-center me-3"
                          style={{ 
                            width: '32px', 
                            height: '32px',
                            backgroundColor: transaction.type === 'deposit' ? '#1cc88a20' : '#e74a3b20'
                          }}
                        >
                          <div style={{ 
                            width: '6px', 
                            height: '6px', 
                            borderRadius: '50%',
                            backgroundColor: transaction.type === 'deposit' ? '#1cc88a' : '#e74a3b'
                          }}></div>
                        </div>
                        <span className="fw-medium text-capitalize" style={{ color: '#2c3e50' }}>
                          {transaction.type}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-muted small">
                      {new Date(transaction.created_at).toLocaleString()}
                    </td>
                    <td className={`py-3 text-end fw-medium ${
                      transaction.type === 'deposit' ? 'text-success' : 'text-danger'
                    }`}>
                      {transaction.type === 'deposit' ? '+' : '-'}₦{parseFloat(transaction.amount).toFixed(2)}
                    </td>
                    <td className="py-3 text-end text-muted small">
                      {account && `₦${parseFloat(account.balance).toFixed(2)}`}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const AccountOverview = () => (
    <div className="p-4">
      <h5 className="mb-4 fw-semibold" style={{ color: '#2c3e50' }}>Account Overview</h5>
      
      {account && (
        <div className="row g-3">
          <div className="col-md-8">
            <div className="card border-0" style={{ backgroundColor: '#4e73df', color: 'white' }}>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <div className="small mb-1 opacity-75">Account Balance</div>
                    <h2 className="mb-0 fw-bold">
                      {showBalance ? `₦${parseFloat(account.balance).toFixed(2)}` : '••••••••'}
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="btn btn-sm btn-outline-light"
                    style={{ border: '1px solid rgba(255,255,255,0.3)' }}
                  >
                    {showBalance ? 'Hide' : 'Show'}
                  </button>
                </div>
                <div className="small opacity-75">
                  Account: {account.account_number}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 h-100" style={{ backgroundColor: '#f8f9fc' }}>
              <div className="card-body d-flex flex-column justify-content-center text-center">
                <div className="mb-2" style={{ fontSize: '32px' }}>📈</div>
                <div className="fw-medium" style={{ color: '#2c3e50' }}>
                  {transactions.length} Total
                </div>
                <small className="text-muted">Transactions</small>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    if (!account) {
      return (
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <div className="spinner-border" role="status" style={{ color: '#4e73df' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="mt-2 text-muted">Loading account details...</div>
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
    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fc' }}>
      {/* Top Navigation */}
      <nav className="navbar navbar-expand-lg" style={{ backgroundColor: 'white', borderBottom: '1px solid #e3e6f0' }}>
        <div className="container-fluid px-4">
          <div className="d-flex align-items-center">
            <div 
              className="rounded me-3 d-flex align-items-center justify-content-center"
              style={{ 
                width: '40px', 
                height: '40px', 
                backgroundColor: '#4e73df',
                color: 'white'
              }}
            >
              <span className="fw-bold">B</span>
            </div>
            <span className="navbar-brand h5 fw-bold mb-0" style={{ color: '#2c3e50' }}>
              Banking Portal
            </span>
          </div>
          
          <div className="d-flex align-items-center">
            <div className="me-3 text-end">
              <div className="fw-medium small" style={{ color: '#2c3e50' }}>Online Banking</div>
              <div className="text-muted" style={{ fontSize: '11px' }}>
                {new Date().toLocaleDateString()}
              </div>
            </div>
            <button 
              className="btn btn-sm btn-outline-secondary"
              onClick={handleLogout}
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Side Navigation */}
      <div className="d-flex">
        <div style={{ width: '220px', backgroundColor: 'white', minHeight: 'calc(100vh - 70px)', borderRight: '1px solid #e3e6f0' }}>
          <div className="p-3">
            <nav className="nav flex-column">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
                { id: 'transactions', label: 'Transactions', icon: '⟷' },
                { id: 'accounts', label: 'Accounts', icon: '⚏' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`nav-link btn text-start border-0 mb-1 ${
                    activeTab === tab.id 
                      ? 'fw-medium' 
                      : ''
                  }`}
                  style={{ 
                    color: activeTab === tab.id ? '#4e73df' : '#858796',
                    backgroundColor: activeTab === tab.id ? '#eaecf4' : 'transparent'
                  }}
                >
                  <span className="me-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow-1">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalBankingDashboard;


