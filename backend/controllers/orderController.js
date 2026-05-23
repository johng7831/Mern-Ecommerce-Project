const Order = require("../models/Order");

// ========================
// ✅ Create Order
// ========================
const createOrder = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      country,
      paymentMethod,
      items,
      subtotal,
      shipping,
      tax,
      total,
    } = req.body;

    // Validation
    if (!fullName || !email || !phone || !address || !items?.length) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // ✅ Create Order
    const order = new Order({
      user: req.user._id,
      fullName,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      country,
      paymentMethod,
      items,
      subtotal,
      shipping,
      tax,
      total,
      status: "Pending",
    });

    const savedOrder = await order.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ========================
// ✅ Get Logged In User Orders
// ========================
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("My Orders Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ========================
// ✅ Get All Orders (ADMIN)
// ========================
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email");

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get Orders Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ========================
// ✅ Get Order By ID
// ========================
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // ✅ Only owner or admin can view
    if (
      order.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this order",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get Order Error:", error);
    res.status(500).json({
      success: false,
      message: "Invalid order ID or server error",
    });
  }
};

// ========================
// ✅ Update Order Status (ADMIN)
// ========================
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status || order.status;

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Update Order Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ========================
// ✅ Delete Order (ADMIN)
// ========================
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Delete Order Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ========================
// ✅ EXPORTS
// ========================
module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
};