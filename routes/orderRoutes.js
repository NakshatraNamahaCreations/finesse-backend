const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Order = require("../models/Order");


// ✅ Create Order
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress } = req.body;

    const order = new Order({
      user: req.user.id,
      items,
      totalAmount,
      shippingAddress
    });

    const savedOrder = await order.save();

    res.status(201).json(savedOrder);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ✅ Get Logged-in User Orders
router.get("/my-orders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;