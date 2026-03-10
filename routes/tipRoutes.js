const express = require("express");
const router = express.Router();
const Tip = require("../models/Tip");

router.get("/", async (req, res) => {
  const tips = await Tip.find().sort({ _id: -1 });
  res.json(tips);
});

router.post("/", async (req, res) => {
  const tip = new Tip(req.body);
  await tip.save();
  res.json(tip);
});

router.delete("/:id", async (req, res) => {
  await Tip.findByIdAndDelete(req.params.id);
  res.json({ message: "Tip deleted" });
});

module.exports = router;