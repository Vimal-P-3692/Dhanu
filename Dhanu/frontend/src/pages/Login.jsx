import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    role: "user" // default role
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  // Admin credentials (in real app, this would be in backend)
  const ADMIN_EMAIL = "admin@hospital.com";
  const ADMIN_PASSWORD = "admin123";

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (credentials.role === 'admin') {
      if (credentials.email === ADMIN_EMAIL && credentials.password === ADMIN_PASSWORD) {
        login({ role: 'admin', email: credentials.email });
        navigate("/add-doctor");
      } else {
        setError("Invalid admin credentials");
      }
    } else {
      // For regular users, just login with email
      login({ role: 'user', email: credentials.email });
      navigate("/");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)" }}>
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <form onSubmit={handleSubmit} className="p-4 shadow rounded" style={{ background: "#fff", minWidth: 320 }}>
          <h3 className="mb-4 text-center" style={{ color: "#43c6ac" }}>Login</h3>
          
          <div className="mb-3">
            <select 
              className="form-select mb-3"
              value={credentials.role}
              onChange={(e) => setCredentials({...credentials, role: e.target.value})}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={credentials.email}
              onChange={(e) => setCredentials({...credentials, email: e.target.value})}
              required
            />
          </div>

          {credentials.role === 'admin' && (
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                required
              />
            </div>
          )}

          {error && <div className="text-danger mb-3 text-center small">{error}</div>}
          
          <button
            type="submit"
            className="btn btn-primary w-100"
            style={{
              background: "#43c6ac",
              border: "none",
              borderRadius: "2rem",
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
