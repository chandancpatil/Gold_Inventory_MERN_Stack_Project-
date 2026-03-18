import React, { useEffect, useState } from 'react';
import './CustomerList.css';
import { database } from "../../../firebase";
import { ref, onValue } from "firebase/database";

function CustomerList() {
    const [consumers, setConsumers] = useState([]);

    useEffect(() => {
        const consumerRef = ref(database, "Admin/Consumer");
        onValue(consumerRef, (snapshot) => {
            const consumerData = snapshot.val();
            if (consumerData) {
                const consumerList = Object.keys(consumerData).map((consumerId) => ({
                    id: consumerId,
                    ...consumerData[consumerId]
                }));
                setConsumers(consumerList);
            } else { 
                setConsumers([]);
            }
        });
    }, []);

    return (
        <div className="consumer-list-container">
            <h1>Consumer List</h1>
            <table className="consumer-table">
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
                    {consumers.map((consumer, index) => (
                        <tr key={consumer.id}>
                            <th scope="row">{index + 1}</th>
                            <td>{consumer.Name}</td>
                            <td>{consumer.Email}</td>
                            <td>{consumer.Phone}</td>
                            <td>{consumer.City}</td>
                            <td>{consumer.State}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CustomerList;