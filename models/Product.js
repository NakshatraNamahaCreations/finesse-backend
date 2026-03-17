const mongoose = require("mongoose");

/* =========================
   VARIANT SCHEMA
========================= */

const variantSchema = new mongoose.Schema({
  quantity: String,
  unit: String,
  price: Number,
  discountPrice: Number
});

/* =========================
   REVIEW SCHEMA
========================= */

const reviewSchema = new mongoose.Schema({
  name: String,
  rating: Number,
  comment: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/* =========================
   FAQ SCHEMA
========================= */

const faqSchema = new mongoose.Schema({
  question: String,
  answer: String
});

/* =========================
   PRODUCT SCHEMA
========================= */

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    description: String,

    stock: {
      type: Number,
      default: 0
    },

    images: [String],

    /* PRODUCT VARIANTS */
    variants: [variantSchema],

    /* INGREDIENTS */
    ingredients: [String],

    /* HOW TO USE */
    howToUse: [String],

    /* WORKS BEST WITH */
    worksBestWith: [String],

    /* PRODUCT HIGHLIGHTS */
    highlights: [String],

    /* BADGE*/
     badges: [String],

    /* REVIEWS */
    reviews: [reviewSchema],

    /* FAQs */
    faqs: [faqSchema]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Product", productSchema);