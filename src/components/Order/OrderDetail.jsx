import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import "./AllOrders.css"

const OrderDetail = () => {
    const navigate = useNavigate();
    const logout = () => {
        sessionStorage.removeItem('userInfo');
        navigate('/login');
    }

    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const userInfo = sessionStorage.getItem('userInfo');
        const user = userInfo ? JSON.parse(userInfo) : null;

        if (user) {
            const fetchOrders = async () => {
                try {
                    const response = await axios.post(`http://localhost:4000/order/order-details?userName=${user.id}`);
                    setOrders(response.data);
                } catch (err) {
                    console.error("Error fetching orders taken by user:", err);
                    setError('Failed to fetch orders taken by you.');
                }
            };

            fetchOrders();
        } else {
            setError('User not logged in.');
        }
    }, []);
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
                <h2>Orders Taken By Me</h2>
                {error && <p>{error}</p>}
                {orders.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Pickup Location</th>
                                <th>Dropoff Location</th>
                                <th>Size</th>
                                <th>Vehicle</th>
                                <th>Handle With Care</th>
                                <th>Status</th>
                                <th>Host Name</th>
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
                                    <td>{order.active ? 'Active' : 'Inactive'}</td>
                                    <td>{order.hostId ? order.hostId.name : 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No orders taken by you found.</p>
                )}
            </div>
        </div>
    )
}

export default OrderDetail