import React, { useEffect, useState } from 'react';
import { database } from "../../../firebase";
import { ref,  onValue, update } from "firebase/database";
import './AddStocks.css';

function AddStocks() {
    const [formData, setFormData] = useState({
        supplierName: '',
        productName: '',
        quantity: '',
        price: '',
        rate: '',
        tax: ''
    });

    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
        const taxRef = ref(database, 'Admin/gstTax/tax');
        onValue(taxRef, (snapshot) => {
            const data = snapshot.val();
            setFormData(prevState => ({ ...prevState, tax: data }));
        }, (error) => {
            console.error('Error fetching tax data:', error);
        });
    }, []);

    useEffect(() => {
        const newPrice = parseFloat(formData.quantity) * parseFloat(formData.rate);
        const totalTax = (newPrice * parseFloat(formData.tax)) / 100;
        const finalPrice = newPrice + totalTax;

        setFormData(prevState => ({ 
            ...prevState, 
            price: isNaN(finalPrice) ? '' : finalPrice.toFixed(2) 
        }));
    }, [formData.quantity, formData.rate, formData.tax]);

    useEffect(() => {
        const productsRef = ref(database, "Admin/Products");
        onValue(productsRef, (snapshot) => {
            const productsData = snapshot.val();
            if (productsData) {
                const productList = Object.keys(productsData).map((productId) => ({
                    id: productId,
                    ...productsData[productId]
                }));
                setProducts(productList);
                console.log("Products loaded:", productList);
            }
        });
    }, []);

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
            }
        });
    }, []);

    const generateUniqueId = () => {
        const digits = '0123456789';
        let id = 'SI';
        for (let i = 0; i < 6; i++) {
            id += digits[Math.floor(Math.random() * digits.length)];
        }
        return id;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleProductChange = (e) => {
        const selectedProductId = e.target.value;
        const selectedProduct = products.find(p => p.id === selectedProductId);
        if (selectedProduct) {
            setFormData(prev => ({ 
                ...prev, 
                productName: selectedProductId, 
                rate: selectedProduct.Rate 
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const existingProduct = products.find(p => p.id === formData.productName);
        const newQuantity = existingProduct?.Quantity 
            ? existingProduct.Quantity + parseFloat(formData.quantity) 
            : parseFloat(formData.quantity);

        const updates = {
            [`Admin/Products/${formData.productName}/Quantity`]: newQuantity,
            [`Admin/Transaction/${generateUniqueId()}`]: {
                id: generateUniqueId(),
                supplierName: formData.supplierName,
                productName: formData.productName,
                rate: formData.rate,
                price: formData.price,
                quantity: formData.quantity,
                tax: formData.tax,
                paymentType: "full",
                timestamp: new Date().toISOString()
            }
        };

        update(ref(database), updates)
            .then(() => {
                alert('Stock added successfully!');
                setFormData({
                    supplierName: '',
                    productName: '',
                    quantity: '',
                    price: '',
                    rate: '',
                    tax: formData.tax // Keep tax value
                });
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error adding stock');
            });
    };

    return (
        <div className="add-stock-container">
            <div className="stock-card">
                <div className="card-header1">
                    <h2>Add Stock</h2>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit} className="stock-form">
                        <div className="form-group">
                            <label htmlFor="supplierName">Supplier</label>
                            <select
                                id="supplierName"
                                name="supplierName"
                                value={formData.supplierName}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Supplier</option>
                                {suppliers.map(supplier => (
                                    <option key={supplier.id} value={supplier.id}>
                                        {supplier.Name}
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
                                style={{ color: "#333" }}
                            >
                                <option value="">Select Product</option>
                                {products.map(product => (
                                    <option key={product.id} value={product.id}>
                                        {product.Name || product.name || product.id}
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
                                    <span className="input-suffix">%</span>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="tax">TAX</label>
                                <div className="input-group">
                                    <input
                                        type="number"
                                        id="tax"
                                        name="tax"
                                        value={formData.tax}
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
                                    value={formData.quantity}
                                    onChange={handleInputChange}
                                    required
                                />
                                <span className="input-suffix">gm</span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="price">Price</label>
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

                        <button type="submit" className="submit-btn-add">
                            Add Stock
                        </button>
                    </form>
                    <p className="form-note">
                        Please fill out the form to add new stock.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default AddStocks;