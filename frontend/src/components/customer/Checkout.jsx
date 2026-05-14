import React, { useContext, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { displayBrandName } from "../../utils/productDisplay";

const Checkout = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

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

  const itemCount = useMemo(
    () => cartItems.reduce((n, i) => n + (i.quantity || 1), 0),
    [cartItems]
  );

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    console.log("ORDER:", {
      shippingInfo,
      cartItems,
      totals,
    });

    clearCart();
    alert("Order placed successfully!");
    navigate("/");
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page cart-page--empty">
        <h1 className="cart-page-title">Checkout</h1>
        <p className="cart-page-empty-text">
          Your cart is empty. Add something before you check out.
        </p>
        <div className="checkout-empty-actions">
          <Link to="/cart" className="btn-primary-rounded cart-page-cta">
            Back to cart
          </Link>
          <Link to="/shop-product" className="btn-checkout checkout-empty-shop">
            Browse shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-page-inner">
        <nav className="checkout-breadcrumb" aria-label="Breadcrumb">
          <Link to="/cart" className="checkout-breadcrumb-link">
            Cart
          </Link>
          <span className="checkout-breadcrumb-sep" aria-hidden="true">
            /
          </span>
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
          <div className="checkout-main">
            <section className="checkout-card" aria-labelledby="checkout-order-heading">
              <h2 id="checkout-order-heading" className="checkout-card-title">
                Order review
              </h2>
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
                              alt=""
                              className="checkout-order-image"
                            />
                          ) : (
                            <span className="checkout-order-no-image">No image</span>
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
                          {displayBrandName(item.brand) ?? "No brand"}
                        </p>
                        <p className="checkout-order-meta">
                          Qty {qty} × ₹{item.price}
                        </p>
                      </div>
                      <p className="checkout-order-line">₹ {line.toFixed(0)}</p>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section className="checkout-card" aria-labelledby="checkout-ship-heading">
              <h2 id="checkout-ship-heading" className="checkout-card-title">
                Delivery details
              </h2>
              <form id="checkout-form" onSubmit={handlePlaceOrder}>
                <div className="checkout-form-grid">
                  <label className="checkout-field">
                    <span className="checkout-label">Full name</span>
                    <input
                      name="fullName"
                      className="checkout-input"
                      autoComplete="name"
                      onChange={handleChange}
                      required
                    />
                  </label>
                  <label className="checkout-field">
                    <span className="checkout-label">Email</span>
                    <input
                      name="email"
                      type="email"
                      className="checkout-input"
                      autoComplete="email"
                      onChange={handleChange}
                      required
                    />
                  </label>
                  <label className="checkout-field">
                    <span className="checkout-label">Phone</span>
                    <input
                      name="phone"
                      type="tel"
                      className="checkout-input"
                      autoComplete="tel"
                      onChange={handleChange}
                      required
                    />
                  </label>
                  <label className="checkout-field">
                    <span className="checkout-label">City</span>
                    <input
                      name="city"
                      className="checkout-input"
                      autoComplete="address-level2"
                      onChange={handleChange}
                      required
                    />
                  </label>
                  <label className="checkout-field">
                    <span className="checkout-label">State</span>
                    <input
                      name="state"
                      className="checkout-input"
                      autoComplete="address-level1"
                      onChange={handleChange}
                      required
                    />
                  </label>
                  <label className="checkout-field">
                    <span className="checkout-label">PIN code</span>
                    <input
                      name="zipCode"
                      className="checkout-input"
                      autoComplete="postal-code"
                      onChange={handleChange}
                      required
                    />
                  </label>
                  <label className="checkout-field checkout-field--full">
                    <span className="checkout-label">Country</span>
                    <select
                      name="country"
                      className="checkout-input checkout-select"
                      value={shippingInfo.country}
                      onChange={handleChange}
                    >
                      <option value="India">India</option>
                      <option value="Other">Other</option>
                    </select>
                  </label>
                </div>
                <label className="checkout-field checkout-field--block">
                  <span className="checkout-label">Street address</span>
                  <textarea
                    name="address"
                    className="checkout-textarea"
                    rows={3}
                    autoComplete="street-address"
                    onChange={handleChange}
                    required
                  />
                </label>

                <fieldset className="checkout-payment">
                  <legend className="checkout-card-title checkout-payment-legend">
                    Payment
                  </legend>
                  <div className="checkout-payment-grid">
                    <label
                      className={`checkout-pay-option ${
                        shippingInfo.paymentMethod === "COD"
                          ? "checkout-pay-option--active"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={shippingInfo.paymentMethod === "COD"}
                        onChange={handleChange}
                        className="checkout-pay-input"
                      />
                      <span className="checkout-pay-title">Cash on delivery</span>
                      <span className="checkout-pay-desc">Pay when your order arrives</span>
                    </label>
                    <label
                      className={`checkout-pay-option ${
                        shippingInfo.paymentMethod === "Online"
                          ? "checkout-pay-option--active"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Online"
                        checked={shippingInfo.paymentMethod === "Online"}
                        onChange={handleChange}
                        className="checkout-pay-input"
                      />
                      <span className="checkout-pay-title">Online payment</span>
                      <span className="checkout-pay-desc">Card, UPI, or netbanking</span>
                    </label>
                  </div>
                </fieldset>

                <button type="submit" className="checkout-submit-mobile btn-checkout">
                  Place order · ₹ {totals.total.toFixed(0)}
                </button>
              </form>
            </section>
          </div>

          <aside className="checkout-aside" aria-label="Order summary">
            <div className="checkout-summary">
              <h2 className="checkout-summary-title">Summary</h2>
              {totals.subtotal > 999 && (
                <p className="checkout-summary-note">
                  You qualify for free shipping on orders over ₹999.
                </p>
              )}
              <dl className="checkout-summary-rows">
                <div className="checkout-summary-row">
                  <dt>Subtotal</dt>
                  <dd>₹ {totals.subtotal.toFixed(0)}</dd>
                </div>
                <div className="checkout-summary-row">
                  <dt>Shipping</dt>
                  <dd>
                    {totals.shipping === 0 ? (
                      <span className="checkout-summary-free">Free</span>
                    ) : (
                      `₹ ${totals.shipping}`
                    )}
                  </dd>
                </div>
                <div className="checkout-summary-row">
                  <dt>Tax (18%)</dt>
                  <dd>₹ {totals.tax.toFixed(0)}</dd>
                </div>
              </dl>
              <div className="checkout-summary-total">
                <span>Total</span>
                <strong>₹ {totals.total.toFixed(0)}</strong>
              </div>
              <button
                type="submit"
                form="checkout-form"
                className="checkout-submit-desktop btn-checkout"
              >
                Place order
              </button>
              <p className="checkout-summary-foot">
                By placing your order you agree to our delivery terms. This demo does not
                process real payments.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
