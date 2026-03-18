import React, { useEffect, useState } from 'react';
import './SupplierList.css';
import { database } from "../../../firebase";
import { ref, onValue } from "firebase/database";

function SupplierList() {
    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
        const supplierRef = ref(database, "Admin/Supplier");
        onValue(supplierRef, (snapshot) => {
            const supplierData = snapshot.val();
            if (supplierData) {
                const supplierList = Object.keys(supplierData).map((supplierId) => ({
                    id: supplierId,
                    ...supplierData[supplierId]
                }));
                setSuppliers(supplierList);
            } else {
                setSuppliers([]);
            }
        });
    }, []);

    return (
        <div className="supplier-list-container">
            <h1>Supplier List</h1>
            <table className="supplier-table">
                <thead>
                    <tr>
                        <th scope="col">S/N</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Phone</th>
                        <th scope="col">City</th>
                        <th scope="col">State</th>
                    </tr>
                </thead>
                <tbody>
                    {suppliers.map((supplier, index) => (
                        <tr key={supplier.id}>
                            <th scope="row">{index + 1}</th>
                            <td>{supplier.Name}</td>
                            <td>{supplier.Email}</td>
                            <td>{supplier.Phone}</td>
                            <td>{supplier.City}</td>
                            <td>{supplier.State}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default SupplierList;