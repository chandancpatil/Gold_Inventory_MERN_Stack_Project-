import React, { useEffect } from "react";
import { database } from "../../../firebase"; // Adjusted import path
import { ref, onValue, update } from "firebase/database";
import "./GoldRated.css";

export default function GoldRates() {
    useEffect(() => {
        const fetchData = async () => {
            const starCountRef = ref(database, 'Admin/Products');
            onValue(starCountRef, (snapshot) => {
                document.getElementById('18_carat').value = snapshot.child('18_carat').child('Rate').val();
                document.getElementById('20_carat').value = snapshot.child('20_carat').child('Rate').val();
                document.getElementById('22_carat').value = snapshot.child('22_carat').child('Rate').val();
                document.getElementById('24_carat').value = snapshot.child('24_carat').child('Rate').val();
            });
        };
        fetchData();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);

        const goldRates = {
            "18_carat": { "Rate": formData.get("18_carat"), "Name": "18_carat" },
            "20_carat": { "Rate": formData.get("20_carat"), "Name": "20_carat" },
            "22_carat": { "Rate": formData.get("22_carat"), "Name": "22_carat" },
            "24_carat": { "Rate": formData.get("24_carat"), "Name": "24_carat" }
        };

        let updatePromises = [];

        Object.values(goldRates).forEach((product) => {
            let updatePromise = update(ref(database, 'Admin/Products/' + product.Name), { Rate: product.Rate })
                .catch(error => {
                    console.error('Error updating gold rates:', error);
                });
            updatePromises.push(updatePromise);
        });

        try {
            await Promise.all(updatePromises);
            alert('Gold rates updated successfully');
        } catch (error) {
            console.error('Error updating one or more gold rates:', error);
        }
    };

    return (
        <div className="gold-rates-container">
            <div className="gold-rates-card">
                <div className="card-header">
                    <h2>Gold Rates</h2>
                </div>
                <div className="card-body">
                    <form onSubmit={alert} className="gold-rates-form">
                        <div className="rate-group">
                            <label htmlFor="18_carat">18 Carat Gold Rate</label>
                            <div className="input-group">
                                <input 
                                    type="number" 
                                    id="18_carat" 
                                    name="18_carat" 
                                    step="0.1"
                                    placeholder="00" 
                                    required 
                                />
                                <span className="input-unit">per gram</span>
                            </div>
                        </div>
                        
                        <div className="rate-group">
                            <label htmlFor="20_carat">20 Carat Gold Rate</label>
                            <div className="input-group">
                                <input 
                                    type="number" 
                                    id="20_carat" 
                                    name="20_carat" 
                                    step="0.1"
                                    placeholder="00" 
                                    required 
                                />
                                <span className="input-unit">per gram</span>
                            </div>
                        </div>
                        
                        <div className="rate-group">
                            <label htmlFor="22_carat">22 Carat Gold Rate</label>
                            <div className="input-group">
                                <input 
                                    type="number" 
                                    id="22_carat" 
                                    name="22_carat" 
                                    step="0.1"
                                    placeholder="00" 
                                    required 
                                />
                                <span className="input-unit">per gram</span>
                            </div>
                        </div>
                        
                        <div className="rate-group">
                            <label htmlFor="24_carat">24 Carat Gold Rate</label>
                            <div className="input-group">
                                <input 
                                    type="number" 
                                    id="24_carat" 
                                    name="24_carat" 
                                    step="0.1"
                                    placeholder="00" 
                                    required 
                                />
                                <span className="input-unit">per gram</span>
                            </div>
                        </div>
                        
                        <button type="submit" className="submit-btn3">Update Rates</button>
                    </form>
                    <p className="form-note">Gold rates for different carats available in rupees per gram.</p>
                </div>
            </div>
        </div>
    );
}