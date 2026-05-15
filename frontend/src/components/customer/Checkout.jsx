import React, { useContext, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { CartContext } from "../../context/CartContext";
import { displayBrandName } from "../../utils/productDisplay";
import API_URL from "../../api";

const Checkout = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    paymentMethod: "COD",
  });

  const handleChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value,
    });
  };

  const totals = useMemo(() => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0
    );

    const shipping = subtotal > 999 ? 0 : 99;
    const tax = subtotal * 0.18;

    return {
      subtotal,
      shipping,
      tax,
      total: subtotal + shipping + tax,
    };
  }, [cartItems]);

  const itemCount = useMemo(() => {
    return cartItems.reduce((n, i) => n + (i.quantity || 1), 0);
  }, [cartItems]);

  // =========================
  // PLACE ORDER
  // =========================

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (cartItems.length === 0) {
        alert("Cart is empty");
        return;
      }

      const orderData = {
        fullName: shippingInfo.fullName,
        email: shippingInfo.email,
        phone: shippingInfo.phone,
        address: shippingInfo.address,
        city: shippingInfo.city,
        state: shippingInfo.state,
        zipCode: shippingInfo.zipCode,
        country: shippingInfo.country,
        paymentMethod: shippingInfo.paymentMethod,

        items: cartItems.map((item) => ({
          productId: item._id,
          name: item.name,
          image: item.images?.[0]?.url || "",
          price: item.price,
          quantity: item.quantity || 1,
        })),

        subtotal: totals.subtotal,
        shipping: totals.shipping,
        tax: totals.tax,
        total: totals.total,
      };

      console.log("ORDER DATA:", orderData);

      const res = await axios.post(
        `${API_URL}/admin/order`,
        orderData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("ORDER SUCCESS:", res.data);

      alert("Order placed successfully");

      clearCart();

      navigate("/thank-you", {
        state: {
          order: res.data,
        },
      });
    } catch (error) {
      console.log("FULL ERROR:", error);

      console.log("ERROR RESPONSE:", error.response);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to place order"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // EMPTY CART
  // =========================

  if (cartItems.length === 0) {
    return (
      <div className="cart-page cart-page--empty">
        <h1 className="cart-page-title">Checkout</h1>

        <p className="cart-page-empty-text">
          Your cart is empty. Add something before checkout.
        </p>

        <div className="checkout-empty-actions">
          <Link to="/cart" className="btn-primary-rounded cart-page-cta">
            Back to cart
          </Link>

          <Link
            to="/shop-product"
            className="btn-checkout checkout-empty-shop"
          >
            Browse shop
          </Link>
        </div>
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div className="checkout-page">
      <div className="checkout-page-inner">
        <nav className="checkout-breadcrumb">
          <Link to="/cart" className="checkout-breadcrumb-link">
            Cart
          </Link>

          <span className="checkout-breadcrumb-sep">/</span>

          <span className="checkout-breadcrumb-current">Checkout</span>
        </nav>

        <header className="checkout-header">
          <div>
            <h1 className="checkout-title">Checkout</h1>

            <p className="checkout-subtitle">
              {itemCount} item{itemCount !== 1 ? "s" : ""} · Secure checkout
            </p>
          </div>
        </header>

        <div className="checkout-layout">
          {/* LEFT */}
          <div className="checkout-main">
            {/* ORDER REVIEW */}
            <section className="checkout-card">
              <h2 className="checkout-card-title">Order review</h2>

              <ul className="checkout-order-list">
                {cartItems.map((item) => {
                  const qty = item.quantity || 1;

                  const imageUrl = item.images?.[0]?.url;

                  const line = item.price * qty;

                  return (
                    <li key={item._id} className="checkout-order-row">
                      <Link
                        to={`/product/${item._id}`}
                        className="checkout-order-image-link"
                      >
                        <div className="checkout-order-image-wrap">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={item.name}
                              className="checkout-order-image"
                            />
                          ) : (
                            <span>No image</span>
                          )}
                        </div>
                      </Link>

                      <div className="checkout-order-body">
                        <Link
                          to={`/product/${item._id}`}
                          className="checkout-order-name"
                        >
                          {item.name}
                        </Link>

                        <p className="checkout-order-brand">
                          {displayBrandName(item.brand) || "No brand"}
                        </p>

                        <p className="checkout-order-meta">
                          Qty {qty} × ₹{item.price}
                        </p>
                      </div>

                      <p className="checkout-order-line">
                        ₹ {line.toFixed(0)}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* SHIPPING */}
            <section className="checkout-card">
              <h2 className="checkout-card-title">Delivery details</h2>

              <form id="checkout-form" onSubmit={handlePlaceOrder}>
                <div className="checkout-form-grid">
                  <label className="checkout-field">
                    <span>Full name</span>

                    <input
                      type="text"
                      name="fullName"
                      className="checkout-input"
                      value={shippingInfo.fullName}
                      onChange={handleChange}
                      required
                    />
                  </label>

                  <label className="checkout-field">
                    <span>Email</span>

                    <input
                      type="email"
                      name="email"
                      className="checkout-input"
                      value={shippingInfo.email}
                      onChange={handleChange}
                      required
                    />
                  </label>

                  <label className="checkout-field">
                    <span>Phone</span>

                    <input
                      type="tel"
                      name="phone"
                      className="checkout-input"
                      value={shippingInfo.phone}
                      onChange={handleChange}
                      required
                    />
                  </label>

                  <label className="checkout-field">
                    <span>City</span>

                    <input
                      type="text"
                      name="city"
                      className="checkout-input"
                      value={shippingInfo.city}
                      onChange={handleChange}
                      required
                    />
                  </label>

                  <label className="checkout-field">
                    <span>State</span>

                    <input
                      type="text"
                      name="state"
                      className="checkout-input"
                      value={shippingInfo.state}
                      onChange={handleChange}
                      required
                    />
                  </label>

                  <label className="checkout-field">
                    <span>PIN code</span>

                    <input
                      type="text"
                      name="zipCode"
                      className="checkout-input"
                      value={shippingInfo.zipCode}
                      onChange={handleChange}
                      required
                    />
                  </label>

                  <label className="checkout-field checkout-field--full">
                    <span>Country</span>

                    <select
                      name="country"
                      className="checkout-input"
                      value={shippingInfo.country}
                      onChange={handleChange}
                    >
                      <option value="India">India</option>
                      <option value="Other">Other</option>
                    </select>
                  </label>
                </div>

                <label className="checkout-field checkout-field--block">
                  <span>Street address</span>

                  <textarea
                    name="address"
                    rows={3}
                    className="checkout-textarea"
                    value={shippingInfo.address}
                    onChange={handleChange}
                    required
                  />
                </label>

                {/* PAYMENT */}
                <fieldset className="checkout-payment">
                  <legend className="checkout-card-title">
                    Payment Method
                  </legend>

                  <div className="checkout-payment-grid">
                    <label className="checkout-pay-option">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={shippingInfo.paymentMethod === "COD"}
                        onChange={handleChange}
                      />

                      <span>Cash on Delivery</span>
                    </label>

                    <label className="checkout-pay-option">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Online"
                        checked={shippingInfo.paymentMethod === "Online"}
                        onChange={handleChange}
                      />

                      <span>Online Payment</span>
                    </label>
                  </div>
                </fieldset>

                <button
                  type="submit"
                  className="checkout-submit-mobile btn-checkout"
                  disabled={loading}
                >
                  {loading
                    ? "Placing Order..."
                    : `Place Order · ₹ ${totals.total.toFixed(0)}`}
                </button>
              </form>
            </section>
          </div>

          {/* RIGHT */}
          <aside className="checkout-aside">
            <div className="checkout-summary">
              <h2 className="checkout-summary-title">Summary</h2>

              <div className="checkout-summary-row">
                <span>Subtotal</span>
                <span>₹ {totals.subtotal.toFixed(0)}</span>
              </div>

              <div className="checkout-summary-row">
                <span>Shipping</span>

                <span>
                  {totals.shipping === 0
                    ? "Free"
                    : `₹ ${totals.shipping}`}
                </span>
              </div>

              <div className="checkout-summary-row">
                <span>Tax</span>
                <span>₹ {totals.tax.toFixed(0)}</span>
              </div>

              <div className="checkout-summary-total">
                <strong>Total</strong>

                <strong>₹ {totals.total.toFixed(0)}</strong>
              </div>

              <button
                type="submit"
                form="checkout-form"
                className="checkout-submit-desktop btn-checkout"
                disabled={loading}
              >
                {loading ? "Placing..." : "Place Order"}
              </button>

              <p className="checkout-summary-foot">
                By placing your order you agree to our delivery terms.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;