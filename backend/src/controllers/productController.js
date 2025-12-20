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
const cache = require("../utils/cache");

  const results = [...amazonData, ...flipkartData];

  // save to DB
  for (const p of results) {
  await Product.updateOne(
    { name: p.name, platform: p.platform },
    { $set: p },
    { upsert: true }
  );
}


  res.json(results);
};

exports.compareProduct = async (req, res) => {
  const { q } = req.query;

  const products = await Product.find({
    name: new RegExp(q, "i")
  });

  if (!products.length) {
    return res.status(404).json({ message: "No data found" });
  }

  const comparison = compare(products);

  res.json(comparison);
};
