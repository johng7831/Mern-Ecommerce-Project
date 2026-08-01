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

import ProductDetails from "./components/customer/product";
import Cart from "./components/customer/Cart";
import Footer from "./components/customer/Footer";
import Shopproduct from "./components/customer/Shopproduct";
import Checkout from "./components/customer/Checkout";
import Thankyou from "./components/customer/Thankyou";

import Featuredcollecion from "./components/customer/Featuredcollection";
import Toppicks from "./components/customer/Toppicks";
import Promobanner from "./components/customer/Promobanner";
import Collections from "./components/customer/Collections";
import CollectionProducts from "./components/customer/CollectionProducts";
import Brands from "./components/customer/Brands";
import BrandProducts from "./components/customer/BrandProducts";
import SearchResults from "./components/customer/SearchResults";
import ChatBot from "./components/customer/ChatBot";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />

        <Routes>
          {/* ================= HOME PAGE ================= */}
          <Route
            path="/"
            element={
              <>
                <ImageBanner />
                <Featuredcollecion />
                <Toppicks />
                <Collections />
                <Brands />
                <Promobanner />
              </>
            }
          />

          {/* ================= PUBLIC ROUTES ================= */}

          {/* Product Details */}
          <Route path="/product/:id" element={<ProductDetails />} />

          {/* Collection Products */}
          <Route
            path="/collection/:id"
            element={<CollectionProducts />}
          />

          {/* Brand Products */}
          <Route
            path="/brand/:brandId"
            element={<BrandProducts />}
          />

          {/* Cart */}
          <Route path="/cart" element={<Cart />} />

          {/* Shop */}
          <Route
            path="/shop-product"
            element={<Shopproduct />}
          />

          {/* Search */}
          <Route path="/search" element={<SearchResults />} />

          {/* Checkout */}
          <Route
            path="/checkout"
            element={<Checkout />}
          />

          {/* Thank You */}
          <Route
            path="/thank-you"
            element={<Thankyou />}
          />

          {/* ================= AUTH ROUTES ================= */}

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminLogin />} />

          {/* ================= PROTECTED ROUTES ================= */}

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
        <ChatBot />
      </Router>
    </AuthProvider>
  );
}

export default App;