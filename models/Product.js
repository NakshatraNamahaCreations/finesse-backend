const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
  quantity: String,
  unit: String,
  price: Number,
  discountPrice: Number,
});

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    category: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Category",
  required: true
},

    description: String,
    stock: {
      type: Number,
      default: 0,
    },
    images: [String],
    variants: [variantSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
