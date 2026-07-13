import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiHome, FiPackage, FiShoppingCart, FiUsers, FiBarChart3 } from 'react-icons/fi';

const Sidebar = ({ open, onToggle }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <div className={`sidebar ${!open ? 'closed' : ''}`}>
        <div className="sidebar-header">
          <h1>🏥 MediPOS</h1>
          <button className="toggle-btn" onClick={onToggle}>
            <FiX />
          </button>
        </div>
        <ul className="sidebar-menu">
          <li>
            <Link to="/" className={isActive('/') ? 'active' : ''}>
              <FiHome style={{ marginRight: '10px' }} /> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/inventory" className={isActive('/inventory') ? 'active' : ''}>
              <FiPackage style={{ marginRight: '10px' }} /> Inventory
            </Link>
          </li>
          <li>
            <Link to="/checkout" className={isActive('/checkout') ? 'active' : ''}>
              <FiShoppingCart style={{ marginRight: '10px' }} /> Checkout
            </Link>
          </li>
          <li>
            <Link to="/customers" className={isActive('/customers') ? 'active' : ''}>
              <FiUsers style={{ marginRight: '10px' }} /> Customers
            </Link>
          </li>
          <li>
            <Link to="/reports" className={isActive('/reports') ? 'active' : ''}>
              <FiBarChart3 style={{ marginRight: '10px' }} /> Reports
            </Link>
          </li>
        </ul>
      </div>
      {!open && (
        <button className="toggle-btn" onClick={onToggle} style={{ position: 'fixed', left: '10px', top: '10px', zIndex: 999 }}>
          <FiMenu />
        </button>
      )}
    </>
  );
};

export default Sidebar;
