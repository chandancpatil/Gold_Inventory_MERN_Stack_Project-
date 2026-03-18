import React, { useEffect } from "react";
import { database } from "../../../firebase"; // Adjusted import path
import { ref, set, onValue } from "firebase/database";
import "./Commission.css";

export default function AddCommission() {
    useEffect(() => {
        const fetchData = async () => {
            const commissionRef = ref(database, 'Admin/commissionRate');
            onValue(commissionRef, (snapshot) => {
                const commissionData = snapshot.val();
                if (commissionData) {
                    document.getElementById('commission').value = commissionData.commission || '';
                }
            });
        };
        fetchData();
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const commissionValue = event.target.elements.commission.value;

        set(ref(database, 'Admin/commissionRate'), { commission: commissionValue })
            .then(() => {
                alert('Commission rate updated successfully!');
            })
            .catch(error => {
                console.error('Error updating commission:', error);
                alert('Failed to update commission rate');
            });
    };
    

    return (
        <div className="commission-container">
            

            {/* Commission Form */}
            <div className="commission-card">
                <div className="card-header">
                    <h2>Commission Rate</h2>
                </div>
                <div className="card-body">
                    <form onSubmit={alert} className="commission-form">
                        <div className="rate-group">
                            <label htmlFor="commission">Commission Rate (%)</label>
                            <div className="input-group">
                                <input 
                                    type="number" 
                                    id="commission" 
                                    name="commission" 
                                    step="0.1"
                                    placeholder="00"
                                    required
                                />
                                <span className="input-unit">%</span>
                            </div>
                        </div>
                        <button type="submit" className="submit-btn2">
                            Update Commission
                        </button>
                    </form>
                    <p className="form-note">
                        Please enter the commission rate as a percentage.
                    </p>
                </div>
            </div>
        </div>
    );
}