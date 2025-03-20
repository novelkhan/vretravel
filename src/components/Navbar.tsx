import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import useUserHasRole from '../hooks/useUserHasRole';
import useUserHasNotRole from '../hooks/useUserHasNotRole';

const Navbar = () => {
  const [collapsed, setCollapsed] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isAdmin = useUserHasRole(['Admin']);
  const isNotAdmin = useUserHasNotRole(['Admin']);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <img src="./assets/images/logo.png" className="me-3" alt="Logo" />
          </Link>
          <button className="navbar-toggler" type="button" onClick={toggleCollapsed}>
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse ${collapsed ? '' : 'show'}`}>
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              {user && (
                <>
                  {isNotAdmin && (
                    <li className="nav-item">
                      <Link className="nav-link" to="/customer">Customer</Link>
                    </li>
                  )}
                  {isAdmin && (
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin">Admin</Link>
                    </li>
                  )}
                </>
              )}
            </ul>
            {!user ? (
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="btn btn-secondary mx-2" to="/account/register">Create account</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-secondary" to="/account/login">Login</Link>
                </li>
              </ul>
            ) : (
              <div className="d-flex align-items-center">
                <span className="text-white me-2">Hi <span className="h3 text-warning">{user.firstName}</span></span>
                <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;