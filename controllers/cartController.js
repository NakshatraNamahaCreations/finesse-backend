const Cart = require("../models/Cart");

/* ================= ADD TO CART ================= */
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity, packSize } = req.body;
    const userId = req.user.id;

    const existing = await Cart.findOne({
      userId,
      productId,
      packSize
    });

    if (existing) {
      existing.quantity += quantity;
      await existing.save();
      return res.json(existing);
    }

    const cart = new Cart({
      userId,
      productId,
      quantity,
      packSize
    });

    await cart.save();
    res.status(201).json(cart);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET CART ================= */
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.find({
      userId: req.user.id
    }).populate("productId");

    res.json(cart);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= REMOVE ITEM ================= */
exports.removeFromCart = async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.json({ message: "Item removed" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= CLEAR CART ================= */
exports.clearCart = async (req, res) => {
  try {
    await Cart.deleteMany({ userId: req.user.id });
    res.json({ message: "Cart cleared" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};