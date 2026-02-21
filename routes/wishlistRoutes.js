const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  addWishlist,
  getWishlist,
  removeWishlist,
  checkWishlist
} = require("../controllers/wishlistController");

router.post("/add", authMiddleware, addWishlist);
router.get("/", authMiddleware, getWishlist);
router.delete("/:id", authMiddleware, removeWishlist);
router.get("/check/:productId", authMiddleware, checkWishlist);

module.exports = router;