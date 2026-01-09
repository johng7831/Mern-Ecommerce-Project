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

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />

        <Routes>
          <Route path="/" element={<ImageBanner />} />
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
      </Router>
    </AuthProvider>
  );
}

export default App;
