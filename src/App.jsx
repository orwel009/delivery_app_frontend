import { Navigate, Route, Routes } from "react-router-dom";
import HostLogin from "./components/Host/HostLogin";
import HostRegistration from "./components/Host/HostRegistration";
import HostHomePage from "./components/Host/HostHomePage";
import DPRegistration from "./components/DeliveryPersonnel/DPRegistration";
import DPHomePage from "./components/DeliveryPersonnel/DPHomePage";
import PostedOrders from "./components/Order/PostedOrders";
import AllOrders from "./components/Order/AllOrders";
import OrderDetail from "./components/Order/OrderDetail";

function App() {
    return (
        <Routes>
            <Route path="/login" element={<HostLogin />} />
            <Route path="/register" element={<HostRegistration />} />
            <Route path="/home" element={<HostHomePage />} />
            <Route path="/dp-registration" element={<DPRegistration />} />
            <Route path="/dp-home" element={<DPHomePage />} />
            <Route path="/orders-posted" element={<PostedOrders />} />
            <Route path="/all-orders" element={<AllOrders />} />
            <Route path="/order-details" element={<OrderDetail />} />
            <Route path="*" element={<Navigate to="/register" />} />
        </Routes>
    );
}

export default App;
