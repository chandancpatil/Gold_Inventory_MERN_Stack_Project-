import React, { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { database } from "../../firebase";
import { ref, onValue } from "firebase/database";
import './Connections.css';

const Connections = () => {
  const [consumerCount, setConsumerCount] = useState(0);
  const [supplierCount, setSupplierCount] = useState(0);

  useEffect(() => {
    // Fetch consumers
    const consumersRef = ref(database, 'Admin/Consumer');
    onValue(consumersRef, (snapshot) => {
      const consumers = snapshot.val();
      const count = consumers ? Object.keys(consumers).length : 0;
      setConsumerCount(count);
    });

    // Fetch suppliers
    const suppliersRef = ref(database, 'Admin/Supplier');
    onValue(suppliersRef, (snapshot) => {
      const suppliers = snapshot.val();
      const count = suppliers ? Object.keys(suppliers).length : 0;
      setSupplierCount(count);
    });
  }, []);

  return (
    <div className="connections-container">
      <h1>Connections</h1>

      {/* Stats Box */}
      <div className="stats-box">
        <h2>Client Statistics</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Number of Consumers</span>
            <span className="stat-value">{consumerCount}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Number of Suppliers</span>
            <span className="stat-value">{supplierCount}</span>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="action-cards">
        <div className="action-card">
          <h2>Add Consumer</h2>
          <p>Add a new consumer to the system.</p>
          <Link to="/dashboard/connections/add-consumer" className="card-link">
            Add Consumer
          </Link>
        </div>

        <div className="action-card">
          <h2>Add Supplier</h2>
          <p>Add a new supplier to the system.</p>
          <Link to="/dashboard/connections/add-supplier" className="card-link">
            Add Supplier
          </Link>
        </div>
      </div>

      <Outlet /> {/* This will render the nested routes (AddConsumer, AddSupplier) */}
    </div>
  );
};

export default Connections;