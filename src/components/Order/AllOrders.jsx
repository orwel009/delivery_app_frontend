import React, { useEffect, useState } from 'react'
import "./AllOrders.css"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AllOrders = () => {

    const navigate = useNavigate();
    const logout = () => {
        sessionStorage.removeItem('userInfo');
        navigate('/login');
    }

    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchActiveOrders = async () => {
            try {
                const response = await axios.post(`http://localhost:4000/order/active-orders`);
                console.log("API Response:", response.data);
                if (response.data) {
                    setOrders(response.data);
                } else {
                    console.warn("No active orders found.");
                }
            } catch (err) {
                console.error("Error fetching active orders:", err.response ? err.response.data : err.message);
                setError('Failed to fetch active orders.');
            }
        };

        fetchActiveOrders();
    }, []);
    const handleOrder = async (orderId) => {
        if (window.confirm("Are you sure you want to take this order?")) {
            const userInfo = sessionStorage.getItem('userInfo');
            const user = userInfo ? JSON.parse(userInfo) : null; // Parse userInfo from sessionStorage

            if (user) {
                try {
                    const response = await axios.put(`http://localhost:4000/order/${orderId}/inactivate`, {
                        userName: user.id
                    });

                    if (response.status === 200) {
                        // Update the orders state to mark the order as inactive
                        setOrders(orders.map(order => order._id === orderId ? { ...order, active: false, takenBy: user.name } : order));
                        console.log("Order marked as inactive");
                    }
                } catch (err) {
                    console.error("Error marking order as inactive:", err.response ? err.response.data : err.message);
                    setError('Failed to mark order as inactive.');
                }
            } else {
                console.error("User info not found.");
            }
        }
    };

    return (
        <div className="main-section">
            <div className="sidebar">
                <ul>
                    <li><button onClick={() => navigate('/dp-registration')}>DP Registration</button></li>
                    <li><button onClick={() => navigate('/orders-posted')}>My Orders</button></li>
                    <li><button onClick={() => navigate('/all-orders')}>All Order</button></li>
                    <li><button onClick={() => navigate('/order-details')}>Order Details</button></li>
                    <li><button onClick={logout}>Logout</button></li>
                </ul>
            </div>
            <div className="content">
                <h2>All Active Orders</h2>
                {orders.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Host Name</th>
                                <th>Pickup Location</th>
                                <th>Dropoff Location</th>
                                <th>Size</th>
                                <th>Vehicle</th>
                                <th>Handle With Care</th>
                                <th>Status</th>
                                <th>Taken By</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td>{order.hostId ? order.hostId.name : 'N/A'}</td>
                                    <td>{order.pickup}</td>
                                    <td>{order.dropoff}</td>
                                    <td>{order.size}</td>
                                    <td>{order.vehicle}</td>
                                    <td>{order.handleWithCare ? 'Yes' : 'No'}</td>
                                    <td>{order.active ? 'Active' : 'Taken'}</td>
                                    <td>{order.takenBy ? order.takenBy : 'N/A'}</td>
                                    <td>
                                        {order.active && !order.takenBy && (
                                            <button onClick={() => handleOrder(order._id)}>Take Order</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No active orders found.</p>
                )}
            </div>
        </div>
    )
}

export default AllOrders