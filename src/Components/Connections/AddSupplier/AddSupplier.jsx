import React from "react";
import { database } from "../../../firebase";
import { ref, get, set } from "firebase/database";
import './AddSupplier.css';

function AddSupplier() {
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
    
        const supplierName = formData.get("supplierName");
    
        // Check if the supplier name already exists
        const supplierRef = ref(database, 'Admin/Supplier/' + supplierName);
        const supplierSnapshot = await get(supplierRef);
    
        if (supplierSnapshot.exists()) {
            alert('Supplier with this name already exists!');
        } else {
            const supplier = {
                "Name": supplierName,
                "Email": formData.get("email"),
                "Phone": formData.get("phone"),
                "Address": formData.get("address"),
                "City": formData.get("city"),
                "State": formData.get("state"),
                "Zipcode": formData.get("zipcode")
            };
    
            // Store data in Firebase Realtime Database
            set(supplierRef, supplier)
                .then(() => {
                    alert('Supplier added successfully!');
                    event.target.reset();
                })
                .catch(error => {
                    console.error('Error while adding supplier:', error);
                });
        }
    };

    return (
        <div className="supplier-container">
            <div className="supplier-card">
                <div className="card-header">
                    <h2>Add Supplier</h2>
                </div>
                <div className="card-body">
                    <form onSubmit={alert} className="supplier-form">
                        <div className="form-group">
                            <label htmlFor="supplierName">Supplier Name</label>
                            <input 
                                type="text" 
                                id="supplierName" 
                                name="supplierName" 
                                placeholder="Name of supplier" 
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
                                placeholder="Email of supplier" 
                                required 
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="phone">Phone Number</label>
                            <input 
                                type="tel" 
                                id="phone" 
                                name="phone" 
                                placeholder="Phone of supplier" 
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
                                placeholder="Address of supplier" 
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
                                    placeholder="City of supplier" 
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
                                    placeholder="Postal Code of supplier" 
                                    required 
                                />
                            </div>
                        </div>
                        
                        <button type="submit" className="submit-btn6">
                            Add Supplier
                        </button>
                    </form>
                    <p className="form-note">
                        Please fill out the form to add a new supplier.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default AddSupplier;