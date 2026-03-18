import React from 'react';
import { Link } from 'react-router-dom';
import './Accounts.css';

const Accounts = () => {
  return (
    <div className="accounts-container">
      <h1>Accounts</h1>

      {/* Two Boxes for Customer List and Supplier List */}
      <div className="cards-container">
        <div className="card">
          <h2>Customer List</h2>
          <p>View and manage your customer list.</p>
          <Link to="/dashboard/accounts/customer-list" className="card-link">
            View Customer List
          </Link>
        </div>

        <div className="card">
          <h2>Supplier List</h2>
          <p>View and manage your supplier list.</p>
          <Link to="/dashboard/accounts/supplier-list" className="card-link">
            View Supplier List
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Accounts;