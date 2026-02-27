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


// ✅ Get All Orders (Admin)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);

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

// ✅ Update Order Status (Admin)
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;

    if (status === "Delivered") {
      order.deliveredAt = new Date();
    }

    const updatedOrder = await order.save();

    res.json(updatedOrder);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;