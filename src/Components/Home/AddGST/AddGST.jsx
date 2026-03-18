import React, { useEffect } from "react";
import { database } from "../../../firebase";
import { ref, set, onValue } from "firebase/database";
import "./AddGST.css";

export default function AddGstTax() {
    useEffect(() => {
        const fetchData = async () => {
            const starCountRef = ref(database, 'Admin/gstTax');
            onValue(starCountRef, (snapshot) => {
                const taxData = snapshot.val();
                if (taxData) {
                    document.getElementById('tax').value = taxData.tax || '';
                }
            });
        };
        fetchData();
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const taxValue = event.target.elements.tax.value;

        set(ref(database, 'Admin/gstTax'), { tax: taxValue })
            .then(() => {
                alert('GST Tax updated successfully!');
            })
            .catch(error => {
                console.error('Error updating tax:', error);
                alert('Failed to update GST Tax');
            });
    };

    return (
        <div className="gst-tax-container">

            {/* GST Tax Form */}
            <div className="gst-tax-card">
                <div className="card-header">
                    <h2>GST Tax</h2>
                </div>
                <div className="card-body">
                    <form onSubmit={alert} className="gst-tax-form">
                        <div className="tax-group">
                            <label htmlFor="tax">Tax Rate (%)</label>
                            <div className="input-group">
                                <input 
                                    type="number" 
                                    id="tax" 
                                    name="tax" 
                                    step="0.1"
                                    placeholder="00"
                                    required
                                />
                                <span className="input-unit">%</span>
                            </div>
                        </div>
                        <button type="submit" className="submit-btn1">
                            Update Tax Rate
                        </button>
                    </form>
                    <p className="form-note">
                        Please enter the tax rate as a percentage.
                    </p>
                </div>
            </div>
        </div>
    );
}