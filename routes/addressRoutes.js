const express = require("express");
const router = express.Router();
const User = require("../models/User");
const verifyToken = require("../middleware/authMiddleware");


// GET ALL ADDRESSES
router.get("/", verifyToken, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user.addresses || []);
});


// ADD NEW ADDRESS
router.post("/", verifyToken, async (req, res) => {
  const user = await User.findById(req.user.id);

  // If first address, make default
  const isFirst = user.addresses.length === 0;

  user.addresses.push({
    ...req.body,
    isDefault: isFirst
  });

  await user.save();
  res.json(user.addresses);
});


// DELETE ADDRESS
router.delete("/:id", verifyToken, async (req, res) => {
  const user = await User.findById(req.user.id);

  user.addresses = user.addresses.filter(
    addr => addr._id.toString() !== req.params.id
  );

  await user.save();
  res.json(user.addresses);
});


// SET DEFAULT ADDRESS
router.put("/default/:id", verifyToken, async (req, res) => {
  const user = await User.findById(req.user.id);

  user.addresses.forEach(addr => {
    addr.isDefault = addr._id.toString() === req.params.id;
  });

  await user.save();
  res.json(user.addresses);
});

module.exports = router;