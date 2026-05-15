import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaCheck, FaBoxOpen, FaTruck, FaEnvelope } from "react-icons/fa";
import { displayBrandName } from "../../utils/productDisplay";

const ThankYou = () => {
  const location = useLocation();
  const order = location.state?.order;

  const placedLabel = useMemo(() => {
    if (!order?.placedAt) return null;
    try {
      return new Date(order.placedAt).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return null;
    }
  }, [order?.placedAt]);

  const visibleItems = order?.items?.slice(0, 4) ?? [];
  const extraCount =
    order?.items?.length > 4 ? order.items.length - 4 : 0;

  return (
    <div className="thank-you-page">
      <div className="thank-you-page-inner">
        <nav className="checkout-breadcrumb" aria-label="Breadcrumb">
          <Link to="/" className="checkout-breadcrumb-link">
            Home
          </Link>
          <span className="checkout-breadcrumb-sep" aria-hidden="true">
            /
          </span>
          <Link to="/cart" className="checkout-breadcrumb-link">
            Cart
          </Link>
          <span className="checkout-breadcrumb-sep" aria-hidden="true">
            /
          </span>
          <span className="checkout-breadcrumb-current">Thank you</span>
        </nav>

        <header className="thank-you-hero">
          <div className="thank-you-icon-wrap" aria-hidden="true">
            <FaCheck className="thank-you-icon" />
          </div>
          <h1 className="thank-you-title">Thank you for your order</h1>
          <p className="thank-you-lead">
            {order
              ? "Your order is confirmed. We have emailed a receipt to the address you provided."
              : "Your purchase is complete. If you arrived here directly, order details are not available in this session."}
          </p>
          {placedLabel && (
            <p className="thank-you-meta">
              <span className="thank-you-meta-label">Placed</span>{" "}
              {placedLabel}
            </p>
          )}
        </header>

        <div className="thank-you-layout">
          <section
            className="thank-you-card thank-you-card--steps"
            aria-labelledby="thank-you-next-heading"
          >
            <h2 id="thank-you-next-heading" className="thank-you-card-title">
              What happens next
            </h2>
            <ol className="thank-you-steps">
              <li className="thank-you-step">
                <span className="thank-you-step-icon">
                  <FaEnvelope aria-hidden />
                </span>
                <div>
                  <p className="thank-you-step-title">Confirmation email</p>
                  <p className="thank-you-step-text">
                    You will receive an order summary and delivery updates at
                    your email.
                  </p>
                </div>
              </li>
              <li className="thank-you-step">
                <span className="thank-you-step-icon">
                  <FaBoxOpen aria-hidden />
                </span>
                <div>
                  <p className="thank-you-step-title">We prepare your items</p>
                  <p className="thank-you-step-text">
                    Our team picks and packs your products with care.
                  </p>
                </div>
              </li>
              <li className="thank-you-step">
                <span className="thank-you-step-icon">
                  <FaTruck aria-hidden />
                </span>
                <div>
                  <p className="thank-you-step-title">On the way</p>
                  <p className="thank-you-step-text">
                    Track shipping from your account once the parcel is
                    dispatched.
                  </p>
                </div>
              </li>
            </ol>
          </section>

          <aside
            className="thank-you-card thank-you-card--summary"
            aria-label="Order summary"
          >
            <h2 className="thank-you-card-title">Order summary</h2>

            {!order && (
              <p className="thank-you-empty">
                No order details to show. Continue shopping to find something
                you love.
              </p>
            )}

            {order && (
              <>
                <div className="thank-you-ship">
                  <p className="thank-you-ship-name">{order.shippingInfo?.fullName}</p>
                  <p className="thank-you-ship-line">
                    {[order.shippingInfo?.address, order.shippingInfo?.city]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  <p className="thank-you-ship-line">
                    {[order.shippingInfo?.state, order.shippingInfo?.zipCode]
                      .filter(Boolean)
                      .join(" ")}
                    {order.shippingInfo?.country
                      ? ` · ${order.shippingInfo.country}`
                      : ""}
                  </p>
                  <p className="thank-you-ship-meta">
                    {order.shippingInfo?.phone}
                    {order.shippingInfo?.email ? (
                      <>
                        <span className="thank-you-ship-sep">·</span>
                        {order.shippingInfo.email}
                      </>
                    ) : null}
                  </p>
                  <p className="thank-you-pay-badge">
                    Payment:{" "}
                    <strong>
                      {order.shippingInfo?.paymentMethod === "Online"
                        ? "Online"
                        : "Cash on delivery"}
                    </strong>
                  </p>
                </div>

                {visibleItems.length > 0 && (
                  <ul className="thank-you-items">
                    {visibleItems.map((item) => {
                      const qty = item.quantity || 1;
                      const brandLabel = displayBrandName(item.brand);
                      return (
                        <li key={item._id} className="thank-you-item-row">
                          <div className="thank-you-item-thumb">
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt="" />
                            ) : (
                              <span>No image</span>
                            )}
                          </div>
                          <div className="thank-you-item-body">
                            <p className="thank-you-item-name">{item.name}</p>
                            {brandLabel ? (
                              <p className="thank-you-item-brand">{brandLabel}</p>
                            ) : null}
                            <p className="thank-you-item-qty">
                              Qty {qty} × ₹{item.price}
                            </p>
                          </div>
                          <p className="thank-you-item-line">
                            ₹ {(item.price * qty).toFixed(0)}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                )}

                {extraCount > 0 && (
                  <p className="thank-you-more">+{extraCount} more item{extraCount !== 1 ? "s" : ""}</p>
                )}

                <dl className="thank-you-totals">
                  <div className="thank-you-total-row">
                    <dt>Subtotal</dt>
                    <dd>₹ {order.totals?.subtotal?.toFixed(0) ?? "—"}</dd>
                  </div>
                  <div className="thank-you-total-row">
                    <dt>Shipping</dt>
                    <dd>
                      {order.totals?.shipping === 0 ? (
                        <span className="checkout-summary-free">Free</span>
                      ) : (
                        `₹ ${order.totals?.shipping ?? "—"}`
                      )}
                    </dd>
                  </div>
                  <div className="thank-you-total-row">
                    <dt>Tax (18%)</dt>
                    <dd>₹ {order.totals?.tax?.toFixed(0) ?? "—"}</dd>
                  </div>
                </dl>
                <div className="thank-you-grand">
                  <span>Total paid</span>
                  <strong>₹ {order.totals?.total?.toFixed(0) ?? "—"}</strong>
                </div>
              </>
            )}
          </aside>
        </div>

        <div className="thank-you-actions">
          <Link to="/shop-product" className="btn-primary-rounded thank-you-cta-primary">
            Continue shopping
          </Link>
          <Link to="/" className="thank-you-cta-secondary">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
