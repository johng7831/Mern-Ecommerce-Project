import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/customer/Header";
import ImageBanner from "./components/customer/ImageBanner";
import Login from "./components/customer/Login";
import Register from "./components/customer/Register";
import AdminDashboard from "./components/customer/AdminDashboard";

function App() {
  return (
    <Router>
      <Header />

   
   

      <Routes>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/" element={<ImageBanner />} />
        <Route path="/shop" element={<h1>Shop</h1>} />
        <Route path="/cart" element={<h1>Cart</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
