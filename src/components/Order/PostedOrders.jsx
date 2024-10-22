import React, { useEffect, useState } from 'react'
import "./PostedOrders.css"
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

const PostedOrders = () => {
    const navigate = useNavigate();
    const logout = () => {
        sessionStorage.removeItem('userInfo');
        navigate('/login');
    }
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const userInfo = sessionStorage.getItem('userInfo');
                const parsedUserInfo = JSON.parse(userInfo);
                const hostId = parsedUserInfo.id;

                // Fetch orders for the logged-in host
                const response = await axios.post(`http://localhost:4000/order/my-orders?hostId=${hostId}`);
                setOrders(response.data);
            } catch (err) {
                setError('Failed to fetch orders.');
                console.error(err);
            }
        };

        fetchOrders();
    }, []);

    const handleDelete = async (orderId) => {
        if (window.confirm("Are you sure you want to delete this order?")) { 
            try {
                const response = await axios.delete(`http://localhost:4000/order/delete/${orderId}`);
                if (response.status === 200) {
                    setOrders(orders.filter(order => order._id !== orderId));
                    console.log("Order deleted successfully");
                }
            } catch (err) {
                console.error("Error deleting order:", err.response ? err.response.data : err.message);
                setError('Failed to delete order.'); // Handle errors
            }
        }
    };

    return (
        <div className="main-section">
            <div className="sidebar">
                <ul>
                    <li><button onClick={() => navigate('/dp-registration')}>DP Registration</button></li>
                    <li><button onClick={() => navigate('/home')}>Place Order</button></li>
                    <li><button onClick={() => navigate('/all-orders')}>All Order</button></li>
                    <li><button onClick={() => navigate('/order-details')}>Order Details</button></li>
                    <li><button onClick={logout}>Logout</button></li>
                </ul>
            </div>
            <div className="content">
                <h1>Posted Orders</h1>
                {orders.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Pickup</th>
                                <th>Dropoff</th>
                                <th>Size</th>
                                <th>Vehicle</th>
                                <th>Handle With Care</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td>{order.pickup}</td>
                                    <td>{order.dropoff}</td>
                                    <td>{order.size}</td>
                                    <td>{order.vehicle}</td>
                                    <td>{order.handleWithCare ? 'Yes' : 'No'}</td>
                                    <td>{order.active ? 'Active' : 'Taken'}</td>
                                    <td>
                                        {order.active && (
                                            <button onClick={() => handleDelete(order._id)}>Delete</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No orders found.</p>
                )}
            </div>
        </div>
    )
}

export default PostedOrders