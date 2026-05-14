import React, { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { displayBrandName } from "../../utils/productDisplay";

const Cart = () => {
  const { cartItems, setItemQuantity, removeFromCart } = useContext(CartContext);

  const totals = useMemo(() => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * (item.quantity || 1),
      0
    );
    return { subtotal, count: cartItems.reduce((n, i) => n + (i.quantity || 1), 0) };
  }, [cartItems]);

  if (cartItems.length === 0) {
    return (
      <div className="cart-page cart-page--empty">
        <h1 className="cart-page-title">Your cart</h1>
        <p className="cart-page-empty-text">Your cart is empty.</p>
        <Link to="/" className="btn-primary-rounded cart-page-cta">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1 className="cart-page-title">Your cart</h1>
      <p className="cart-page-meta">{totals.count} item(s)</p>

      <ul className="cart-list">
        {cartItems.map((item) => {
          const qty = item.quantity || 1;
          const maxStock =
            typeof item.stock === "number" ? Math.max(1, item.stock) : 999;
          const imageUrl = item.images?.[0]?.url;

          return (
            <li key={item._id} className="cart-row">
              <Link to={`/product/${item._id}`} className="cart-row-image-link">
                <div className="cart-row-image-wrap">
                  {imageUrl ? (
                    <img src={imageUrl} alt="" className="cart-row-image" />
                  ) : (
                    <span className="cart-row-no-image">No image</span>
                  )}
                </div>
              </Link>

              <div className="cart-row-main">
                <Link to={`/product/${item._id}`} className="cart-row-name">
                  {item.name}
                </Link>
                <p className="cart-row-brand">
                  {displayBrandName(item.brand) ?? "No brand"}
                </p>
                <p className="cart-row-price">₹ {item.price} each</p>
                <div className="cart-row-qty">
                  <button
                    type="button"
                    className="cart-qty-btn"
                    aria-label="Decrease quantity"
                    disabled={qty <= 1}
                    onClick={() => setItemQuantity(item._id, qty - 1)}
                  >
                    −
                  </button>
                  <span className="cart-qty-value">{qty}</span>
                  <button
                    type="button"
                    className="cart-qty-btn"
                    aria-label="Increase quantity"
                    disabled={qty >= maxStock}
                    onClick={() => setItemQuantity(item._id, qty + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="cart-row-right">
                <p className="cart-row-line-total">₹ {(item.price * qty).toFixed(0)}</p>
                <button
                  type="button"
                  className="cart-remove-btn"
                  onClick={() => removeFromCart(item._id)}
                >
                  Remove
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="cart-summary">
        <div className="cart-summary-row">
          <span>Subtotal</span>
          <strong>₹ {totals.subtotal.toFixed(0)}</strong>
        </div>
        <Link to="/" className="btn-primary-rounded cart-page-cta">
          Continue shopping
        </Link>
      </div>
    </div>
  );
};

export default Cart;
