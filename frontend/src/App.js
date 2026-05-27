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
import Cart from "./components/customer/Cart";
import Footer from "./components/customer/Footer";
import Shopproduct from "./components/customer/Shopproduct";
import Checkout from "./components/customer/Checkout";
import Thankyou from "./components/customer/Thankyou";
import Featuredcollecion from "./components/customer/Featuredcollection";
import Toppicks from "./components/customer/Toppicks";
import Promobanner from "./components/customer/Promobanner";
import Collections from "./components/customer/Collections";

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
                <Featuredcollecion/>
                <Toppicks/>
                 <Collections/>
                 <Promobanner/>
                
                {/* <FeaturedProducts /> */}
                {/* <NewArrivals /> */}
              </>
            }
          />

         {/* =============Public Route Pages =============*/}
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/shop-product" element={<Shopproduct />} />
          <Route path="/checkout" element={<Checkout />}/>
          <Route path="/thank-you" element={<Thankyou/>} />


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
