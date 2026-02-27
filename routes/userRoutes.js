const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");

/* ===============================
   🔐 LOGGED-IN USER ROUTES
================================ */

// Get logged in user
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update logged-in user
router.put("/update", authMiddleware, async (req, res) => {
  try {
    const { name, phone } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;

    const updatedUser = await user.save();

    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    res.json(userResponse);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ===============================
   🛠 ADMIN CUSTOMER ROUTES
================================ */

// ✅ Get all users (Admin)
router.get("/", async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(users);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Delete user (Admin)
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();

    res.json({ message: "User deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;