import React, { useEffect, useState } from 'react';
import { database } from "../../../firebase";
import { ref, set, onValue, update } from "firebase/database";
import './SellStocks.css';

function SellStocks() {
    const [formData, setFormData] = useState({
        consumerName: '',
        productName: '',
        quantity: '',
        price: '',
        rate: '',
        commission: '',
        paymentType: 'full'
    });

    const [products, setProducts] = useState([]);
    const [consumers, setConsumers] = useState([]);

    const generateUniqueId = () => {
        const digits = '0123456789';
        let id = 'SO';
        for (let i = 0; i < 6; i++) {
            id += digits[Math.floor(Math.random() * digits.length)];
        }
        return id;
    };

    // Fetch commission rate
    useEffect(() => {
        const commissionRef = ref(database, 'Admin/commissionRate/commission');
        onValue(commissionRef, (snapshot) => {
            const data = snapshot.val();
            setFormData(prev => ({ ...prev, commission: data }));
        });
    }, []);

    // Calculate price
    useEffect(() => {
        const quantity = parseFloat(formData.quantity) || 0;
        const rate = parseFloat(formData.rate) || 0;
        const commission = parseFloat(formData.commission) || 0;
        
        const subtotal = quantity * rate;
        const commissionAmount = subtotal * (commission / 100);
        const total = subtotal + commissionAmount;

        setFormData(prev => ({
            ...prev,
            price: total.toFixed(2)
        }));
    }, [formData.quantity, formData.rate, formData.commission]);

    // Fetch products
    useEffect(() => {
        const productsRef = ref(database, "Admin/Products");
        onValue(productsRef, (snapshot) => {
            const data = snapshot.val();
            // Transform data to include Firebase key as 'id'
            if (data) {
                const productsArray = Object.entries(data).map(([id, productData]) => ({
                    id: id, // Assign the Firebase key as the id
                    ...productData // Spread the rest of the data (Name, Rate, Quantity, etc.)
                }));
                setProducts(productsArray);
            } else {
                setProducts([]);
            }
        });
    }, []);

    // Fetch consumers
    useEffect(() => {
        const consumerRef = ref(database, "Admin/Consumer");
        onValue(consumerRef, (snapshot) => {
            const data = snapshot.val();
            setConsumers(data ? Object.values(data) : []);
            console.log("Consumers loaded:", data ? Object.values(data) : []); // Add debug log
        });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleProductChange = (e) => {
        const productId = e.target.value;
        const product = products.find(p => p.id === productId);
        if (product) {
            setFormData(prev => ({
                ...prev,
                productName: productId,
                rate: product.Rate
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const product = products.find(p => p.id === formData.productName);
        if (!product) {
            alert("Product not found!");
            return;
        }

        const quantityToSell = parseFloat(formData.quantity);
        if (quantityToSell > product.Quantity) {
            alert("Error: Quantity to sell exceeds current stock!");
            return;
        }

        // Update product quantity
        const productRef = ref(database, `Admin/Products/${formData.productName}`);
        update(productRef, {
            Quantity: product.Quantity - quantityToSell
        });

        // Create sale transaction
        const transactionRef = ref(database, 'Admin/Transaction/' + generateUniqueId());
        set(transactionRef, {
            ...formData,
            quantity: -quantityToSell, // Negative for sales
            timestamp: new Date().toISOString()
        })
        .then(() => {
            alert('Sale recorded successfully!');
            // Reset form
            setFormData({
                consumerName: '',
                productName: '',
                quantity: '',
                price: '',
                rate: '',
                commission: formData.commission, // Keep commission
                paymentType: 'full'
            });
        })
        .catch(error => {
            console.error('Error recording sale:', error);
            alert('Error recording sale');
        });
    };

    return (
        <div className="sell-stocks-container">
            <div className="stock-card">
                <div className="card-header-sell">
                    <h2>Sell Stock</h2>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit} className="stock-form">
                        <div className="form-group">
                            <label htmlFor="consumerName">Consumer</label>
                            <select
                                id="consumerName"
                                name="consumerName"
                                value={formData.consumerName}
                                onChange={handleInputChange}
                                required
                                style={{ color: "#333" }} // Ensure text is visible
                            >
                                <option value="">Select Consumer</option>
                                {consumers.map(consumer => (
                                    <option key={consumer.id} value={consumer.id}>
                                        {consumer.Name || consumer.name || consumer.id}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="productName">Product</label>
                            <select
                                id="productName"
                                name="productName"
                                value={formData.productName}
                                onChange={handleProductChange}
                                required
                                style={{ color: "#333" }} // Ensure text is visible
                            >
                                <option value="">Select Product</option>
                                {products.map(product => (
                                    <option key={product.id} value={product.id}>
                                        {product.Name || product.name || product.id} ({product.Quantity} gm available)
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="rate">Rate</label>
                                <div className="input-group">
                                    <input
                                        type="number"
                                        id="rate"
                                        name="rate"
                                        value={formData.rate}
                                        readOnly
                                    />
                                    <span className="input-suffix">₹/gm</span>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="commission">Commission</label>
                                <div className="input-group">
                                    <input
                                        type="number"
                                        id="commission"
                                        name="commission"
                                        value={formData.commission}
                                        readOnly
                                    />
                                    <span className="input-suffix">%</span>
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="quantity">Quantity</label>
                            <div className="input-group">
                                <input
                                    type="number"
                                    id="quantity"
                                    name="quantity"
                                    step="0.1"
                                    min="0.1"
                                    value={formData.quantity}
                                    onChange={handleInputChange}
                                    required
                                />
                                <span className="input-suffix">gm</span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="paymentType">Payment Type</label>
                            <select
                                id="paymentType"
                                name="paymentType"
                                value={formData.paymentType}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="full">Full Payment</option>
                                <option value="advance">Advance Payment</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="price">Total Price</label>
                            <div className="input-group">
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    readOnly
                                />
                                <span className="input-suffix">₹</span>
                            </div>
                        </div>

                        <button type="submit" className="submit-btn">
                            Sell Stock
                        </button>
                    </form>
                    <p className="form-note">
                        Please fill out the form to sell stock.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SellStocks;