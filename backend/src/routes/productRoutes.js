const express = require("express");
const router = express.Router();
const {
  searchProduct,
  compareProduct
} = require("../controllers/productController");

router.get("/search", searchProduct);
router.get("/compare", compareProduct);

module.exports = router;
