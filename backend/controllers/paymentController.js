// controllers/paymentController.js

const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");

// ==============================
// ✅ Create Razorpay Order
// ==============================
const createRazorpayOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (!order.total) {
      return res.status(400).json({
        success: false,
        message: "Order total missing",
      });
    }

    const options = {
      amount: order.total * 100, // paisa
      currency: "INR",
      receipt: `receipt_${orderId}`,
    };

    const rzpOrder = await razorpay.orders.create(options);

    // Save Razorpay Order ID
    order.razorpayOrderId = rzpOrder.id;
    await order.save();

    res.status(200).json({
      success: true,
      orderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });

  } catch (error) {
    console.error("Razorpay Create Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==============================
// ✅ Verify Payment
// ==============================
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      orderId,
    } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "failed",
      });

      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // ✅ Payment success
    const order = await Order.findById(orderId);

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.razorpayPaymentId = razorpayPaymentId;
    order.razorpaySignature = razorpaySignature;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      order,
    });

  } catch (error) {
    console.error("Verify Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createRazorpayOrder,
  verifyPayment,
};