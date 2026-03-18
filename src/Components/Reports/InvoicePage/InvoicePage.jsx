import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { database } from "../../../firebase";
import { ref, onValue, get } from "firebase/database";
import './InvoicePage.css';

const InvoicePage = () => {
    const { id, supplierName } = useParams();
    const today = new Date();

    const [companyInfo, setCompanyInfo] = useState({
        name: '', email: '', phone: '', address: '', description: '', website: ''
    });

    const [transactionInfo, setTransactionInfo] = useState({
        id: '', 
        paymentType: '', 
        price: 0, 
        productName: '', 
        quantity: 0, 
        rate: 0, 
        supplierName: '', 
        tax: 0, 
        timestamp: ''
    });

    const [clientInfo, setClientInfo] = useState({
        Name: '', Email: '', Phone: '', Address: '', City: '', State: '', Zipcode: ''
    });

    useEffect(() => {
        // Fetch company details
        const companyRef = ref(database, 'Admin/CompanyDetails');
        onValue(companyRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setCompanyInfo({
                    name: data.cname || '',
                    email: data.cemail || '',
                    phone: data.cphone || '',
                    address: data.caddress || '',
                    description: data.cdescription || '',
                    website: data.cwebsite || ''
                });
            }
        });

        // Fetch all products first to get product names
        const productsRef = ref(database, 'Admin/Products');
        get(productsRef).then((productsSnapshot) => {
            const productsData = productsSnapshot.val() || {};
            
            // Fetch transaction details
            const transactionRef = ref(database, `Admin/Transaction/${id}`);
            onValue(transactionRef, (snapshot) => {
                const data = snapshot.val();
                console.log('Raw Transaction Data:', data);
                
                if (data) {
                    // Find actual product name from product ID
                    const productId = data.productName || '';
                    const productName = productsData[productId]?.Name || productId;
                    
                    setTransactionInfo({
                        id: id,
                        paymentType: data.paymentType || '',
                        price: Number(data.price) || 0,
                        productName: productName,
                        quantity: Math.abs(Number(data.quantity)) || 0,
                        rate: Number(data.rate) || 0,
                        supplierName: data.supplierName || supplierName || '',
                        tax: Number(data.tax) || 0,
                        timestamp: data.timestamp || ''
                    });
                }
            });
        });

        // Fetch client details
        if (id && supplierName) {
            let clientPath = 'Admin';
            if (id.includes("SO")) {
                clientPath += `/Consumer/${supplierName}`;
            } else if (id.includes("SI")) {
                clientPath += `/Supplier/${supplierName}`;
            }

            const clientRef = ref(database, clientPath);
            onValue(clientRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setClientInfo({
                        Name: data.Name || '',
                        Email: data.Email || '',
                        Phone: data.Phone || '',
                        Address: data.Address || '',
                        City: data.City || '',
                        State: data.State || '',
                        Zipcode: data.Zipcode || ''
                    });
                }
            });
        }
    }, [id, supplierName]);

    // Debug logs
    useEffect(() => {
        console.log('Current Transaction Info:', transactionInfo);
    }, [transactionInfo]);

    const handlePrintInvoice = () => {
        window.print();
    };

    return (
        <div className="invoice-container">
            <div className="invoice-card">
                <div className="invoice-header">
                    <h4>Invoice</h4>
                </div>
                <div className="invoice-body">
                    <div className="invoice-address-section">
                        <div className="invoice-from">
                            <h5>From:</h5>
                            <address>
                                <strong>{companyInfo.name}</strong><br />
                                {companyInfo.address}<br />
                                Email: {companyInfo.email}<br />
                                Phone: {companyInfo.phone}<br />
                                Website: {companyInfo.website}<br />
                                {companyInfo.description && `Description: ${companyInfo.description}`}
                            </address>
                        </div>
                        <div className="invoice-to">
                            <h5>To:</h5>
                            <address>
                                <strong>{supplierName}</strong><br />
                                {clientInfo.Address}<br />
                                {clientInfo.City && `${clientInfo.City}, `}
                                {clientInfo.State && `${clientInfo.State}, `}
                                {clientInfo.Zipcode}<br />
                                {clientInfo.Email && `Email: ${clientInfo.Email}`}<br />
                                {clientInfo.Phone && `Phone: ${clientInfo.Phone}`}
                            </address>
                        </div>
                    </div>

                    <div className="invoice-details-section">
                        <div className="invoice-number">
                            <h5>Invoice Number: {id}</h5>
                            <h5>Invoice Date: {transactionInfo.timestamp ? new Date(transactionInfo.timestamp).toLocaleDateString() : today.toDateString()}</h5>
                        </div>
                    </div>

                    {/* Wrap table in a responsive container */}
                    <div className="invoice-table-wrapper">
                        <table className="invoice-table">
                            <thead>
                                <tr>
                                    <th>Index</th>
                                    <th>Product Name</th>
                                    <th>Quantity</th>
                                    <th>Rate</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="text-center">1</td>
                                    <td>{transactionInfo.productName}</td>
                                    <td>{transactionInfo.quantity} gm</td>
                                    <td>₹{transactionInfo.rate.toFixed(2)}</td>
                                    <td>₹{transactionInfo.price.toFixed(2)}</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th colSpan="4" className="text-right">Total</th>
                                    <th>₹{transactionInfo.price.toFixed(2)}</th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    <div className="invoice-actions">
                        <button className="print-button" onClick={handlePrintInvoice}>
                            Print Invoice
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoicePage;
