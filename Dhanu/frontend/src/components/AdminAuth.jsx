import React, { useState } from 'react';
import { FaLock } from 'react-icons/fa';

const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

const AdminAuth = ({ onAuth }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (credentials.username === ADMIN_CREDENTIALS.username && 
        credentials.password === ADMIN_CREDENTIALS.password) {
      onAuth(true);
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card shadow-sm" style={{ maxWidth: 400 }}>
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <FaLock size={40} style={{ color: '#43c6ac' }} />
            <h4 className="mt-2">Admin Access Required</h4>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                required
              />
            </div>
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
            {error && <div className="alert alert-danger">{error}</div>}
            <button
              type="submit"
              className="btn btn-primary w-100"
              style={{
                background: '#43c6ac',
                border: 'none',
                borderRadius: '2rem',
              }}
            >
              Verify
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;
