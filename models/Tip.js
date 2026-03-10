const mongoose = require("mongoose");

const TipSchema = new mongoose.Schema({
  tipPill: {
    type: String,
    required: true
  },
  tipTitle: {
    type: String,
    required: true
  },
  tipSub: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Tip", TipSchema);