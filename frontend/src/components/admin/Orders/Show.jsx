import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../../../api";

const OrderShow = ({ onEdit }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_URL}/admin/getorders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("API RESPONSE:", res.data);

      // ✅ Handle multiple possible API formats
      if (Array.isArray(res.data)) {
        setOrders(res.data);
      } else if (Array.isArray(res.data.orders)) {
        setOrders(res.data.orders);
      } else if (Array.isArray(res.data.data)) {
        setOrders(res.data.data);
      } else {
        setOrders([]);
      }

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
      <h2>Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Phone</th>
              <th>City</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order, index) => (
              <tr key={order._id}>
                <td>{index + 1}</td>
                <td>{order.fullName}</td>
                <td>{order.phone}</td>
                <td>{order.city}</td>

                {/* ✅ Items display */}
                <td>
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item) => (
                      <div key={item._id}>
                        {item.name} × {item.quantity}
                      </div>
                    ))
                  ) : (
                    "No items"
                  )}
                </td>

                <td>₹{order.total}</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderShow;