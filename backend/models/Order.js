const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  address: String,
  city: String,
  state: String,
  zipCode: String,
  country: String,
  paymentMethod: String,

  items: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: Number,
    },
  ],

  subtotal: Number,
  shipping: Number,
  tax: Number,
  total: Number,

  status: {
    type: String,
    default: "Pending",
  },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);