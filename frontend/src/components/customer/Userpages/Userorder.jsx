import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../../../api";

const Userorder = ({ onEdit }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_URL}/admin/myorders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Direct mapping (based on your API response)
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Name:</strong> {order.fullName}</p>
            <p><strong>Email:</strong> {order.email}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Total:</strong> ₹{order.total}</p>
            <p><strong>Payment:</strong> {order.paymentMethod}</p>

            <h4>Items:</h4>
            {order.items.map((item) => (
              <div key={item._id} style={{ marginLeft: "10px" }}>
                <p>{item.name} - ₹{item.price} × {item.quantity}</p>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default Userorder;