const express = require("express");
const router = express.Router();
const Tip = require("../models/Tip");

router.get("/", async (req, res) => {
  try {
    const tip = await Tip.findOne().sort({ _id: -1 });
    res.json(tip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;