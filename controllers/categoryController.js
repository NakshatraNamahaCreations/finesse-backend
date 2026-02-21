const Category = require("../models/Category");
const Product = require("../models/Product");

/* ================= ADD CATEGORY ================= */
exports.addCategory = async (req, res) => {
  try {
    const { name, status, parentCategory } = req.body;

    // check duplicate name
    const exists = await Category.findOne({ name });
    if (exists) {
      return res.status(400).json({
        message: "Category already exists",
      });
    }

    // validate parent
    if (parentCategory) {
      const parentExists = await Category.findById(parentCategory);
      if (!parentExists) {
        return res.status(400).json({
          message: "Parent category not found",
        });
      }
    }

    const category = new Category({
      name,
      status,
      parentCategory: parentCategory || null,
    });

    await category.save();

    res.json({
      message: "Category added successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET ALL ================= */
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate("parentCategory", "name")
      .sort({ createdAt: -1 });

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET SINGLE ================= */
exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate("parentCategory", "name");

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= UPDATE CATEGORY ================= */
exports.updateCategory = async (req, res) => {
  try {
    const { name, status, parentCategory } = req.body;
    const categoryId = req.params.id;

    // check category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    // prevent self parent
    if (parentCategory && parentCategory === categoryId) {
      return res.status(400).json({
        message: "Category cannot be its own parent",
      });
    }

    // check duplicate name (except current)
    if (name) {
      const exists = await Category.findOne({
        name,
        _id: { $ne: categoryId },
      });

      if (exists) {
        return res.status(400).json({
          message: "Category name already exists",
        });
      }
    }

    // validate parent category
    if (parentCategory) {
      const parentExists = await Category.findById(parentCategory);
      if (!parentExists) {
        return res.status(400).json({
          message: "Parent category not found",
        });
      }

      // prevent circular hierarchy
      let parent = parentExists;

      while (parent) {
        if (parent.parentCategory?.toString() === categoryId) {
          return res.status(400).json({
            message: "Circular category hierarchy not allowed",
          });
        }

        parent = await Category.findById(parent.parentCategory);
      }
    }

    // update fields
    category.name = name || category.name;
    category.status = status || category.status;
    category.parentCategory = parentCategory || null;

    await category.save();

    res.json({
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= DELETE CATEGORY ================= */
exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    // check products exist
    const productExists = await Product.findOne({
      category: categoryId,
    });

    if (productExists) {
      return res.status(400).json({
        message:
          "Cannot delete category. Products exist in this category.",
      });
    }

    // check subcategories exist
    const childExists = await Category.findOne({
      parentCategory: categoryId,
    });

    if (childExists) {
      return res.status(400).json({
        message:
          "Cannot delete category. Subcategories exist.",
      });
    }

    await Category.findByIdAndDelete(categoryId);

    res.json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
