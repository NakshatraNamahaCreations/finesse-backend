const Product = require("../models/Product");
const Category = require("../models/Category");

/* ================= ADD PRODUCT ================= */
exports.addProduct = async (req, res) => {
  try {

    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    /* ---------- CATEGORY VALIDATION ---------- */

    const categoryExists = await Category.findById(req.body.category);

    if (!categoryExists) {
      return res.status(400).json({
        message: "Invalid category selected"
      });
    }

    if (categoryExists.status !== "Active") {
      return res.status(400).json({
        message: "Selected category is inactive"
      });
    }

    /* ---------- VARIANTS ---------- */

    let variants = [];

    if (req.body.variants) {
      try {

        const parsed = JSON.parse(req.body.variants);

        if (Array.isArray(parsed)) {
          variants = parsed.map(v => ({
            quantity: String(v.quantity),
            unit: String(v.unit),
            price: Number(v.price),
            discountPrice: v.discountPrice
              ? Number(v.discountPrice)
              : 0
          }));
        }

      } catch (err) {
        console.log("Variant parse error:", err);
      }
    }

    /* ---------- INGREDIENTS ---------- */

    let ingredients = [];
    if (req.body.ingredients) {
      ingredients = JSON.parse(req.body.ingredients);
    }

    /* ---------- HOW TO USE ---------- */

    let howToUse = [];
    if (req.body.howToUse) {
      howToUse = JSON.parse(req.body.howToUse);
    }

    /* ---------- WORKS BEST WITH ---------- */

    let worksBestWith = [];
    if (req.body.worksBestWith) {
      worksBestWith = JSON.parse(req.body.worksBestWith);
    }

    /* ---------- HIGHLIGHTS ---------- */

let highlights = [];

if (req.body.highlights) {
  highlights = JSON.parse(req.body.highlights);
}

/* ---------- BADGES ---------- */

let badges = [];

if (req.body.badges) {
  try {
    badges = JSON.parse(req.body.badges);
  } catch (err) {
    console.log("Badges parse error:", err);
  }
}

    /* ---------- FAQ ---------- */

    let faqs = [];
    if (req.body.faqs) {
      faqs = JSON.parse(req.body.faqs);
    }

    /* ---------- REVIEWS ---------- */

let reviews = [];

if (req.body.reviews) {
  try {
    reviews = JSON.parse(req.body.reviews);
  } catch (err) {
    console.log("Review parse error:", err);
  }
}

    /* ---------- IMAGES ---------- */

    let images = [];

    if (req.files && req.files.length > 0) {
      images = req.files.map(
        file => "/uploads/" + file.filename
      );
    }

    /* ---------- SAVE PRODUCT ---------- */

    const product = new Product({
      productName: req.body.productName,
      category: req.body.category,
      stock: Number(req.body.stock) || 0,
      description: req.body.description,

      variants,
      images,

      ingredients,
      howToUse,
      worksBestWith,
      highlights, 
      badges, 
      faqs,
      reviews  
    });

    await product.save();

    res.json({
      message: "Product added successfully",
      product
    });

  } catch (error) {

    console.log("ADD PRODUCT ERROR:", error);

    res.status(500).json({
      message: error.message
    });

  }
};


/* ================= GET ALL PRODUCTS ================= */
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name status")
      .sort({ createdAt: -1 });

    res.json(products);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= GET SINGLE PRODUCT ================= */
exports.getProduct = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id)
      .populate("category", "name status");

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json(product);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



/* ================= UPDATE PRODUCT ================= */

exports.updateProduct = async (req, res) => {
  try {

    const existingProduct = await Product.findById(req.params.id);

    if (!existingProduct) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    /* ---------- VARIANTS ---------- */

    let variants = existingProduct.variants;

    if (req.body.variants) {

      const parsed = JSON.parse(req.body.variants);

      variants = parsed.map(v => ({
        quantity: String(v.quantity),
        unit: String(v.unit),
        price: Number(v.price),
        discountPrice: v.discountPrice
          ? Number(v.discountPrice)
          : 0
      }));

    }

    /* ---------- EXTRA FIELDS ---------- */

    let ingredients = req.body.ingredients
      ? JSON.parse(req.body.ingredients)
      : existingProduct.ingredients;

    let howToUse = req.body.howToUse
      ? JSON.parse(req.body.howToUse)
      : existingProduct.howToUse;

    let worksBestWith = req.body.worksBestWith
      ? JSON.parse(req.body.worksBestWith)
      : existingProduct.worksBestWith;

      let highlights = req.body.highlights
  ? JSON.parse(req.body.highlights)
  : existingProduct.highlights;

  let reviews = req.body.reviews
  ? JSON.parse(req.body.reviews)
  : existingProduct.reviews;

    let faqs = req.body.faqs
      ? JSON.parse(req.body.faqs)
      : existingProduct.faqs;

      let badges = req.body.badges
  ? JSON.parse(req.body.badges)
  : existingProduct.badges;

    /* ---------- IMAGES ---------- */

    let images = existingProduct.images;

    if (req.files && req.files.length > 0) {
      images = req.files.map(
        file => "/uploads/" + file.filename
      );
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        productName: req.body.productName,
        category: req.body.category,
        description: req.body.description,
        stock: Number(req.body.stock),

        variants,
        images,

        ingredients,
         badges, 
        howToUse,
        worksBestWith,
         highlights,
faqs,
reviews
      },
      { new: true }
    ).populate("category", "name status");

    res.json(updatedProduct);

  } catch (error) {

    console.log("UPDATE ERROR:", error);

    res.status(500).json({
      message: error.message
    });

  }
};


/* ================= DELETE PRODUCT ================= */
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= ADD REVIEW ================= */

exports.addReview = async (req, res) => {
  try {

    const { name, rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    const review = {
      name,
      rating: Number(rating),
      comment
    };

    product.reviews.push(review);

    await product.save();

    res.json({
      message: "Review added successfully",
      reviews: product.reviews
    });

  } catch (error) {

    console.log("ADD REVIEW ERROR:", error);

    res.status(500).json({
      message: error.message
    });

  }
};