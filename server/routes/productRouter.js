const productCtrl = require("../controllers/productCtrl");

const router = require("express").Router();

router
  .route("/products")
  .get(productCtrl.getProducts)
  .post(productCtrl.createProducts);

router
  .route("/products/:id")
  .put(productCtrl.updateProduct)
  .delete(productCtrl.deleteProduct);

module.exports = router;
