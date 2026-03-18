import React from "react";
import { database } from "../../../firebase";
import { ref, get, set } from "firebase/database";
import './AddConsumer.css';

function AddConsumer() {
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);

        const consumerName = formData.get("consumerName");

        // Check if the consumer name already exists
        const consumerRef = ref(database, 'Admin/Consumer/' + consumerName);
        const consumerSnapshot = await get(consumerRef);

        if (consumerSnapshot.exists()) {
            alert('Consumer with this name already exists!');
        } else {
            const consumer = {
                "Name": consumerName,
                "Email": formData.get("email"),
                "Phone": formData.get("phone"),
                "Address": formData.get("address"),
                "City": formData.get("city"),
                "State": formData.get("state"),
                "Zipcode": formData.get("zipcode")
            };

            // Store data in Firebase Realtime Database
            set(consumerRef, consumer)
                .then(() => {
                    alert('Consumer added successfully!');
                    event.target.reset();
                })
                .catch(error => {
                    console.error('Error while adding consumer:', error);
                });
        }
    };

    return (
        <div className="consumer-container">
            <div className="consumer-card">
                <div className="card-header">
                    <h2>Add Consumer</h2>
                </div>
                <div className="card-body">
                    <form onSubmit={alert} className="consumer-form">
                        <div className="form-group">
                            <label htmlFor="consumerName">Consumer Name</label>
                            <input 
                                type="text" 
                                id="consumerName" 
                                name="consumerName" 
                                placeholder="Name of consumer"
                                pattern="^[A-Za-z ]+$"
                                onInput={(e) => {
                                    e.target.value = e.target.value.replace(/[^A-Za-z ]/g, '');
                                }}
                                title="Please enter only letters and spaces."
                                required 
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                placeholder="Email of consumer" 
                                required 
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="phone">Phone Number</label>
                            <input 
                                type="tel" 
                                id="phone" 
                                name="phone" 
                                placeholder="Phone of consumer" 
                                pattern="[0-9]{10}" 
                                maxLength="10"
                                title="Please enter exactly 10 digits."
                                required 
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="address">Address</label>
                            <textarea 
                                id="address" 
                                name="address" 
                                placeholder="Address of consumer" 
                                required
                            ></textarea>
                        </div>
                        
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="city">City</label>
                                <input 
                                    type="text" 
                                    id="city" 
                                    name="city" 
                                    placeholder="City of consumer" 
                                    required 
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="state">State</label>
                                <select 
                                    id="state" 
                                    name="state" 
                                    required
                                >
                                    <option value="">Select State</option>
                                    <option value="Karnataka">Karnataka</option>
                                    <option value="Maharashtra">Maharashtra</option>
                                    <option value="Goa">Goa</option>
                                    <option value="Kerala">Kerala</option>
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="zipcode">Zip Code</label>
                                <input 
                                    type="text" 
                                    id="zipcode" 
                                    name="zipcode" 
                                    placeholder="Postal Code of consumer" 
                                    required 
                                />
                            </div>
                        </div>
                        
                        <button type="submit" className="submit-btn5">
                            Add Consumer
                        </button>
                    </form>
                    <p className="form-note">
                        Please fill out the form to add a new consumer.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default AddConsumer;