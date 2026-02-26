import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/customer/Header";
import ImageBanner from "./components/customer/ImageBanner";
import Login from "./components/customer/Login";
import Register from "./components/customer/Register";

import AdminLogin from "./components/admin/AdminLogin";
import AdminDashboard from "./components/admin/AdminDashboard";
import UserDashboard from "./components/customer/UserDashboard";

import { AuthProvider } from "./context/AuthContext";
import { AdminRoute, UserRoute } from "./utils/ProtectedRoutes";
import FeaturedProducts from "./components/customer/Featuredproduct";
import NewArrivals from "./components/customer/NewArrivalproduct";
import ProductDetails from "./components/customer/product";
import Footer from "./components/customer/Footer";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />

        <Routes>
          {/* =============Home page sections =============*/}
          <Route
            path="/"
            element={
              <>
                <ImageBanner />
                <FeaturedProducts />
                <NewArrivals />
              </>
            }
          />
          <Route path="/product/:id" element={<ProductDetails />} />

          {/* =============Customer Login Register  Pages =============*/}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminLogin />} />

          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/user"
            element={
              <UserRoute>
                <UserDashboard />
              </UserRoute>
            }
          />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
