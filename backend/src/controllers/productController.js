const Product = require("../models/Product");
const amazonService = require("../services/amazonService");
const flipkartService = require("../services/flipkartService");
const compare = require("../utils/compare");

exports.searchProduct = async (req, res) => {
  const { q } = req.query;

  if (!q) return res.status(400).json({ message: "Query missing" });

  // fetch from platforms
  const amazonData = await amazonService(q);
  const flipkartData = await flipkartService(q);

  const results = [...amazonData, ...flipkartData];

  // save to DB
  await Product.insertMany(results);

  res.json(results);
};

exports.compareProduct = async (req, res) => {
  const { q, topN } = req.query;

  if (!q) return res.status(400).json({ message: "Query missing" });

  const products = await Product.find({
    name: new RegExp(q, "i")
  });

  if (!products.length) {
    return res.status(404).json({ message: "No data found" });
  }

  const parsedTopN = topN ? parseInt(topN, 10) : undefined;
  const comparison = compare(products, { topN: parsedTopN });

  res.json(comparison);
};
