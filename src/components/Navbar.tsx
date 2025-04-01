import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import accountService from '../services/AccountService';
import { UserHasRole } from './directives/UserHasRole';
import { UserHasNotRole } from './directives/UserHasNotRole';
import { useAccount } from '../context/AccountContext';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true);
  const { user } = useAccount();

  const toggleCollapsed = () => setCollapsed(!collapsed);
  const logout = () => accountService.logout();

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <a className="navbar-brand">
            <img src="/assets/images/logo.png" className="me-3" alt="Logo" />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleCollapsed}
            aria-expanded={!collapsed}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse ${collapsed ? 'collapse' : ''}`}>
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <NavLink
                  to="/"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  end
                >
                  Home
                </NavLink>
              </li>
              {user && (
                <>
                  <UserHasNotRole roles={['Admin']}>
                    <li className="nav-item">
                      <NavLink
                        to="/customer"
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                      >
                        Customer
                      </NavLink>
                    </li>
                  </UserHasNotRole>
                  <UserHasRole roles={['Admin']}>
                    <li className="nav-item">
                      <NavLink
                        to="/admin"
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                      >
                        Admin
                      </NavLink>
                    </li>
                  </UserHasRole>
                </>
              )}
            </ul>

            {!user ? (
              <ul className="navbar-nav">
                <li className="nav-item">
                  <NavLink
                    to="/account/register"
                    className={({ isActive }) => `btn btn-secondary mx-2 ${isActive ? 'active' : ''}`}
                  >
                    Create account
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/account/login"
                    className={({ isActive }) => `btn btn-secondary ${isActive ? 'active' : ''}`}
                  >
                    Login
                  </NavLink>
                </li>
              </ul>
            ) : (
              <div className="d-flex align-items-center">
                <a className="text-white" style={{ textDecoration: 'none', cursor: 'pointer' }}>
                  Hi{' '}
                  <span className="h3 text-warning">
                    {user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)}
                  </span>
                </a>
                <button className="btn btn-secondary ms-2" onClick={logout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;