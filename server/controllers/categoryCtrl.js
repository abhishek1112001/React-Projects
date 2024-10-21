const Category = require("../models/categoryModel");

const categoryCtrl = {
  getCategories: async (req, resp) => {
    try {
      const categories = await Category.find();
      resp.json(categories);
    } catch (err) {
      resp.status(500).json({ msg: err.message });
    }
  },
  createCategory: async (req, resp) => {
    try {
      const { name } = req.body;
      const category = await Category.findOne({ name });
      if (category) {
        return resp.status(400).json({ msg: "Category already Exixts" });
      }
      const newCategory = new Category({ name });
      await newCategory.save();

      resp.json({ msg: "Created a category" });
    } catch (err) {
      return resp.status(500).json({ msg: err.message });
    }
  },
  deleteCategory: async (req, resp) => {
    try {
      await Category.findByIdAndDelete(req.params.id);
      resp.json({ msg: "Deleted a Category" });
    } catch (err) {
      return resp.status(500).json({ msg: err.message });
    }
  },
  updateCategory: async (req, resp) => {
    try {
      const { name } = req.body;
      await Category.findByIdAndUpdate({ _id: req.params.id }, { name });
      resp.json({ msg: "Updated" });
    } catch (err) {
      resp.status(500).json({ msg: err.message });
    }
  },
};

module.exports = categoryCtrl;
