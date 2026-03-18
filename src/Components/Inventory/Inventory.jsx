import React from 'react';
import { Link } from 'react-router-dom';
import './Inventory.css';

const Inventory = () => {
  return (
    <div className="inventory-container">
      <h1>Inventory</h1>

      {/* Three Boxes for Products, Add Stocks, and Sell Stocks */}
      <div className="cards-container">
        <div className="card">
          <h2>Products</h2>
          <p>View and manage your product inventory.</p>
          <Link to="" className="card-link">
            View Products
          </Link>
        </div>

        <div className="card">
          <h2>Add Stocks</h2>
          <p>Add new stock to your inventory.</p>
          <Link to="" className="card-link">
            Add Stocks
          </Link>
        </div>

        <div className="card">
          <h2>Sell Stocks</h2>
          <p>Sell stocks from your inventory.</p>
          <Link to="" className="card-link">
            Sell Stocks
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Inventory;