const express = require("express");
const router = express.Router();
const User = require("../models/User");
const verifyToken = require("../middleware/authMiddleware");


// GET ALL ADDRESSES
router.get("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("addresses");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// ADD NEW ADDRESS
router.post("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const isFirst = user.addresses.length === 0;

    // If new address marked default → remove others default
    if (req.body.isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    user.addresses.push({
      ...req.body,
      isDefault: isFirst || req.body.isDefault
    });

    await user.save();

    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: "Error adding address" });
  }
});


// DELETE ADDRESS
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const address = user.addresses.id(req.params.id);

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    const wasDefault = address.isDefault;

    address.deleteOne();

    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: "Error deleting address" });
  }
});


// SET DEFAULT ADDRESS
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const address = user.addresses.id(req.params.id);

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    // If updating default → remove others default
    if (req.body.isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    Object.assign(address, req.body);

    await user.save();

    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: "Error updating address" });
  }
});
module.exports = router;