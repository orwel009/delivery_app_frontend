import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import './HostHomePage.css'; // External CSS for styling
import axios from "axios";

const HostHomePage = () => {
    const navigate = useNavigate();
    const [pickup, setPickup] = useState('');
    const [dropoff, setDropoff] = useState('');
    const [size, setSize] = useState('');
    const [vehicle, setVehicle] = useState('bike');
    const [handleWithCare, setHandleWithCare] = useState('no');

    const logout = () => {
        sessionStorage.removeItem('userInfo');
        navigate('/login');
    }

    useEffect(() => {
        const userInfo = sessionStorage.getItem('userInfo');
        if (!userInfo)navigate('/login');
    }, []);
    

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const parsedUserInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        const hostId = parsedUserInfo.id;
        const formData = {
            pickup,
            dropoff,
            size,
            vehicle,
            handleWithCare,
            hostId,
        };

        try {
            const response = await axios.post(
                `http://localhost:4000/order/add-order`,
                formData,
                { withCredentials: true }
            );
            if (response.status === 200) {
                const { host } = response.data;
                sessionStorage.setItem('userInfo', JSON.stringify(host));
                navigate("/my-orders");
            }
        } catch (e) {
            alert(e);
            console.warn(e);
        }
    };


    return (
        <div className="host-homepage">
            <div className="sidebar">
                <ul>
                    <li><button onClick={() => navigate('/dp-registration')}>DP Registration</button></li>
                    <li><button onClick={() => navigate('/orders-posted')}>My Orders</button></li>
                    <li><button onClick={() => navigate('/all-orders')}>All Orders</button></li>
                    <li><button onClick={() => navigate('/order-details')}>Order Details</button></li>
                    <li><button onClick={logout}>Logout</button></li>
                </ul>
            </div>

            <div className="content">
                <h1>Delivery Information</h1>
                <form onSubmit={handleSubmit} className="delivery-form">
                    <div className="form-group">
                        <label htmlFor="pickup">Pickup Location:</label>
                        <input 
                            type="text" 
                            id="pickup" 
                            value={pickup} 
                            onChange={(e) => setPickup(e.target.value)} 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="dropoff">Drop-off Location:</label>
                        <input 
                            type="text" 
                            id="dropoff" 
                            value={dropoff} 
                            onChange={(e) => setDropoff(e.target.value)} 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="size">Product Size:</label>
                        <input 
                            type="text" 
                            id="size" 
                            value={size} 
                            onChange={(e) => setSize(e.target.value)} 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="vehicle">Preferred Vehicle:</label>
                        <select 
                            id="vehicle" 
                            value={vehicle} 
                            onChange={(e) => setVehicle(e.target.value)} 
                            required
                        >
                            <option value="bike">Bike</option>
                            <option value="car">Car</option>
                            <option value="truck">Truck</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Handle with Care:</label>
                        <div>
                            <label>
                                <input 
                                    type="radio" 
                                    value="yes" 
                                    checked={handleWithCare === 'yes'} 
                                    onChange={() => setHandleWithCare('yes')} 
                                />
                                Yes
                            </label>
                            <label>
                                <input 
                                    type="radio" 
                                    value="no" 
                                    checked={handleWithCare === 'no'} 
                                    onChange={() => setHandleWithCare('no')} 
                                />
                                No
                            </label>
                        </div>
                    </div>

                    <button type="submit">Submit Delivery</button>
                </form>
            </div>
        </div>
    );
}

export default HostHomePage;
