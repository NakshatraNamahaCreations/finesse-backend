const Wishlist = require("../models/Wishlist");

/* ======================================
   ADD TO WISHLIST
====================================== */
exports.addWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;  // ✅ from token
    const { productId } = req.body;

    const exists = await Wishlist.findOne({ userId, productId });

    if (exists) {
      return res.json({
        message: "Already in wishlist",
        item: exists
      });
    }

    const item = new Wishlist({ userId, productId });
    await item.save();

    res.json({
      message: "Added to wishlist",
      item
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ======================================
   GET USER WISHLIST
====================================== */
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user.userId; // ✅ from token

    const list = await Wishlist.find({ userId })
      .populate({
        path: "productId",
        populate: {
          path: "category",
          model: "Category"
        }
      })
      .sort({ createdAt: -1 });

    res.json(list);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ======================================
   REMOVE SINGLE WISHLIST ITEM
====================================== */
exports.removeWishlist = async (req, res) => {
  try {
    const userId = req.user.userId; // ✅ from token
    const itemId = req.params.id;

    const item = await Wishlist.findOne({ _id: itemId, userId });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    await Wishlist.findByIdAndDelete(itemId);

    res.json({
      message: "Removed from wishlist"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ======================================
   CHECK IF PRODUCT IN WISHLIST
====================================== */
exports.checkWishlist = async (req, res) => {
  try {
    const userId = req.user.userId; // ✅ from token
    const { productId } = req.params;

    const exists = await Wishlist.findOne({ userId, productId });

    res.json({ exists: !!exists });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};