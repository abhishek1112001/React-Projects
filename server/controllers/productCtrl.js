const Products = require("../models/productModel");

//Filter,Sorting and pagination

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filtering() {
    const queryObj = { ...this.queryString };

    const excludedFields = ["page", "sort", "limit"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lt|lte|regex)\b/g,
      (match) => "$" + match
    );
    this.query.find(JSON.parse(queryStr));

    return this;
  }
  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join("");

      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }
  pagination() {
    const page = this.queryString.page * 1 || 1;

    const limit = this.queryString.limit * 1 || 9;

    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

const productCtrl = {
  getProducts: async (req, resp) => {
    try {
      //console.log(req.query);
      const features = new APIfeatures(Products.find(), req.query)
        .filtering()
        .sorting()
        .pagination();
      const products = await features.query;

      resp.json({
        status: "success",
        result: products.length,
        products: products,
      });
    } catch (err) {
      return resp.status(500).json({ msg: err.message });
    }
  },
  createProducts: async (req, resp) => {
    try {
      const {
        product_id,
        title,
        price,
        description,
        content,
        images,
        category,
      } = req.body;
      if (!images) {
        return resp.json(400).json({ msg: "No Image Up" });
      }
      const product = await Products.findOne({ product_id });
      if (product) {
        return resp.status(400).json({ msg: "This product is already exists" });
      }
      const newProduct = new Products({
        product_id,
        title: title.toLowerCase(),
        price,
        description,
        content,
        images,
        category,
      });
      await newProduct.save();
      resp.json({ msg: "Create a product" });
    } catch (err) {
      return resp.status(500).json({ msg: err.message });
    }
  },
  deleteProduct: async (req, resp) => {
    try {
      await Products.findByIdAndDelete(req.params.id);
      resp.json({ msg: "Delete a Product" });
    } catch (err) {
      return resp.status(500).json({ msg: err.message });
    }
  },
  updateProduct: async (req, resp) => {
    try {
      const { title, price, description, content, images, category } = req.body;
      if (!images) {
        return resp.status(500).json({ msg: "No Image Upload" });
      }
      await Products.findOneAndUpdate(
        { _id: req.params.id },
        {
          title: title.toLowerCase(),
          price,
          description,
          content,
          images,
          category,
        }
      );
      resp.json({ msg: "Updated a Product" });
    } catch (err) {
      return resp.status(500).json({ msg: err.message });
    }
  },
};

module.exports = productCtrl;
