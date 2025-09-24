import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); // go back to home
  };

  const features = [
    { title: "Secure Banking", description: "Bank-grade security with 256-bit encryption", icon: "🔐" },
    { title: "Easy Payments", description: "Send money instantly to anyone, anywhere", icon: "💳" },
    { title: "Smart Analytics", description: "Track your spending with detailed insights", icon: "📊" },
    { title: "Investment Tools", description: "Grow your wealth with our investment platform", icon: "📈" }
  ];

  const stats = [
    { number: "1M+", label: "Active Users" },
    { number: "99.9%", label: "Uptime" },
    { number: "$50B+", label: "Transactions" },
    { number: "150+", label: "Countries" }
  ];

  if (token) {
    // Logged in user view
    return (
      <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              {/* Welcome Back Section */}
              <div className="card shadow-lg border-0 rounded-4 mb-4">
                <div className="card-body text-center p-5">
                  <div className="mb-4">
                    <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                      <span style={{ fontSize: '2rem' }}>👥</span>
                    </div>
                    <h1 className="display-4 fw-bold text-dark mb-3">
                      Welcome back to MyBank!
                    </h1>
                    <p className="lead text-muted mb-4">
                      Your secure banking dashboard is ready. Manage your finances with confidence.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                    <Link 
                      to="/dashboard" 
                      className="btn btn-primary btn-lg px-4 py-3 rounded-pill shadow"
                      style={{ background: 'linear-gradient(45deg, #007bff, #6f42c1)' }}
                    >
                      <span className="me-2">📊</span>
                      Go to Dashboard
                    </Link>
                    <button 
                      onClick={handleLogout} 
                      className="btn btn-outline-danger btn-lg px-4 py-3 rounded-pill"
                    >
                      <span className="me-2">🔒</span>
                      Logout
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="row g-3">
                {stats.map((stat, index) => (
                  <div key={index} className="col-6 col-md-3">
                    <div className="card border-0 shadow-sm text-center rounded-3">
                      <div className="card-body py-4">
                        <h3 className="fw-bold text-primary mb-1">{stat.number}</h3>
                        <small className="text-muted">{stat.label}</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not logged in user view
  return (
    <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Hero Section */}
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            {/* Main Hero */}
            <div className="text-center mb-5">
              <div className="mb-4">
                <div className="bg-light rounded-4 d-inline-flex align-items-center justify-content-center mb-4 shadow-sm" 
                     style={{ width: '100px', height: '100px', transform: 'rotate(12deg)' }}>
                  <span style={{ fontSize: '3rem' }}>💳</span>
                </div>
                <h1 className="display-2 fw-bold text-white mb-4">
                  Welcome to <span className="text-warning">MyBank</span>
                </h1>
                <p className="lead text-white mb-4 fs-4">
                  Experience the future of banking with our secure, user-friendly platform. 
                  Manage your finances with confidence and style.
                </p>
                <p className="text-white-50 mb-5 fs-5">
                  This is a demo banking app - explore all features risk-free!
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center mb-5">
                <Link 
                  to="/register" 
                  className="btn btn-success btn-lg px-5 py-3 rounded-pill shadow-lg"
                >
                  <span className="me-2">👥</span>
                  Create Account
                </Link>
                <Link 
                  to="/login" 
                  className="btn btn-light btn-lg px-5 py-3 rounded-pill shadow-lg"
                >
                  <span className="me-2">🔒</span>
                  Sign In
                </Link>
              </div>
            </div>

            {/* Features Grid */}
            <div className="row g-4 mb-5">
              {features.map((feature, index) => (
                <div key={index} className="col-md-6 col-lg-3">
                  <div className="card h-100 border-0 shadow-sm rounded-4">
                    <div className="card-body text-center p-4">
                      <div className="bg-primary bg-opacity-10 rounded-3 d-inline-flex align-items-center justify-content-center mb-3" 
                           style={{ width: '60px', height: '60px' }}>
                        <span style={{ fontSize: '1.5rem' }}>{feature.icon}</span>
                      </div>
                      <h5 className="card-title fw-bold mb-3">{feature.title}</h5>
                      <p className="card-text text-muted">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats Section */}
            <div className="card border-0 shadow-lg rounded-4 mb-5">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h2 className="display-5 fw-bold text-dark mb-3">Trusted by millions worldwide</h2>
                  <p className="text-muted">Join our growing community of satisfied customers</p>
                </div>
                <div className="row g-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="col-6 col-md-3 text-center">
                      <h3 className="display-4 fw-bold text-primary mb-2">{stat.number}</h3>
                      <p className="text-muted">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Features */}
            <div className="row g-4">
              {[
                { icon: "⚡", title: "Lightning Fast", description: "Instant transfers and real-time notifications" },
                { icon: "🔐", title: "Ultra Secure", description: "Military-grade encryption and fraud protection" },
                { icon: "🌍", title: "Global Access", description: "Bank from anywhere in the world, 24/7" }
              ].map((feature, index) => (
                <div key={index} className="col-md-4">
                  <div className="card h-100 border-0 shadow-sm rounded-4">
                    <div className="card-body text-center p-4">
                      <div className="bg-primary bg-opacity-10 rounded-3 d-inline-flex align-items-center justify-content-center mb-3" 
                           style={{ width: '60px', height: '60px' }}>
                        <span style={{ fontSize: '1.5rem' }}>{feature.icon}</span>
                      </div>
                      <h5 className="card-title fw-bold mb-3">{feature.title}</h5>
                      <p className="card-text text-muted">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-light py-4 mt-5">
        <div className="container">
          <div className="text-center">
            <p className="mb-0">&copy; 2024 MyBank Demo. Built for demonstration purposes.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

