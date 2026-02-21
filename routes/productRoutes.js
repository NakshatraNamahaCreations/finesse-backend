const express = require("express");
const router = express.Router();

const {
  addProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const upload = require("../middleware/upload");

router.post("/", upload.array("images", 10), addProduct);
router.get("/", getProducts);
router.get("/:id", getProduct);
router.put("/:id", upload.array("images", 10), updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
