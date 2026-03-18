import React, { useEffect, useState } from 'react';
import './ViewProducts.css';
import { database } from "../../../firebase";
import { ref, onValue } from "firebase/database";

function ViewProduct() {
    const [products, setProducts] = useState([]);

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
            } else {
                setProducts([]);
            }
        });
    }, []);

    return (
        <div className="product-container">
            <h1 className='h1'>Product List</h1>
            <table className="product-table">
                <thead>
                    <tr className="table-header">
                        <th>S/N</th>
                        <th>Name</th>
                        <th>Rate</th>
                        <th>Quantity</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, index) => (
                        <tr key={product.id}>
                            <td>{index + 1}</td>
                            <td>{product.id}</td>


                            <td>{product.Rate}</td>
                            <td>{(product.Quantity ?? 0).toFixed(2)} gm</td>
                            <td>{((product.Rate ?? 0) * (product.Quantity ?? 0)).toFixed(2)} INR</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ViewProduct;