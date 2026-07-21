import React, { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { displayBrandName } from "../../utils/productDisplay";

const Cart = () => {
  const { cartItems, setItemQuantity, removeFromCart } = useContext(CartContext);

  const totals = useMemo(() => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0
    );
    const count = cartItems.reduce((n, item) => n + (item.quantity || 1), 0);
    return { subtotal, count };
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
    <div className="cart-page cart-page--filled">
      <div className="cart-page-inner">
        <header className="cart-page-header">
          <div>
            <h1 className="cart-page-title">Your cart</h1>
            <p className="cart-page-meta">{totals.count} item(s)</p>
          </div>
        </header>

        <div className="cart-layout">
          <div className="cart-main">
            <ul className="cart-list">
              {cartItems.map((item, index) => {
                const qty = item.quantity || 1;

                // Determine stock limit
                const availableStock = item.selectedVariant?.stock ?? item.stock;
                const maxStock =
                  typeof availableStock === "number" ? Math.max(1, availableStock) : 999;

                const imageUrl = item.images?.[0]?.url;

                // Extract variant info
                const variantSize = item.selectedVariant?.size || item.selectedSize;
                const variantColor = item.selectedVariant?.color || item.selectedColor;

                // Unique identifier used for actions & list key
                const identifier =
                  item.cartItemId ||
                  `${item._id}-${variantSize || ""}-${variantColor || ""}-${index}`;

                return (
                  <li key={identifier} className="cart-row">
                    <Link to={`/product/${item._id}`} className="cart-row-image-link">
                      <div className="cart-row-image-wrap">
                        {imageUrl ? (
                          <img src={imageUrl} alt={item.name} className="cart-row-image" />
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

                      {/* Variant Details (Size & Color) */}
                      {(variantSize || variantColor) && (
                        <div
                          className="cart-row-variant-info"
                          style={{
                            display: "flex",
                            gap: "8px",
                            margin: "4px 0 8px 0",
                            fontSize: "13px",
                            color: "#555",
                          }}
                        >
                          {variantSize && (
                            <span
                              style={{
                                background: "#f1f1f1",
                                padding: "2px 8px",
                                borderRadius: "4px",
                                border: "1px solid #ddd",
                              }}
                            >
                              <strong>Size:</strong> {variantSize}
                            </span>
                          )}
                          {variantColor && (
                            <span
                              style={{
                                background: "#f1f1f1",
                                padding: "2px 8px",
                                borderRadius: "4px",
                                border: "1px solid #ddd",
                              }}
                            >
                              <strong>Color:</strong> {variantColor}
                            </span>
                          )}
                        </div>
                      )}

                      <p className="cart-row-price">₹ {item.price} each</p>

                      <div className="cart-row-qty">
                        <button
                          type="button"
                          className="cart-qty-btn"
                          aria-label="Decrease quantity"
                          disabled={qty <= 1}
                          onClick={() => setItemQuantity(identifier, qty - 1)}
                        >
                          −
                        </button>
                        <span className="cart-qty-value">{qty}</span>
                        <button
                          type="button"
                          className="cart-qty-btn"
                          aria-label="Increase quantity"
                          disabled={qty >= maxStock}
                          onClick={() => setItemQuantity(identifier, qty + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="cart-row-right">
                      <p className="cart-row-line-total">
                        ₹ {((item.price || 0) * qty).toFixed(0)}
                      </p>
                      <button
                        type="button"
                        className="cart-remove-btn"
                        onClick={() => removeFromCart(identifier)}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="cart-main-footer">
              <Link to="/" className="btn-primary-rounded cart-page-cta">
                Continue shopping
              </Link>
            </div>
          </div>

          <aside className="cart-aside" aria-label="Cart summary">
            <div className="cart-summary-card">
              <h2 className="cart-summary-card-title">Summary</h2>
              <div className="cart-summary-card-row">
                <span>Subtotal</span>
                <strong>₹ {totals.subtotal.toFixed(0)}</strong>
              </div>
              <p className="cart-summary-card-hint">
                Shipping and tax are calculated at checkout.
              </p>
              <Link to="/checkout" className="cart-checkout-btn btn-checkout">
                Continue to checkout
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Cart;