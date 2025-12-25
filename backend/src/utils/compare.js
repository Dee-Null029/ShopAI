/**
 * Enhanced comparison utility
 * - Returns top-N cheapest items
 * - Keeps backward-compatible `cheapest`, `bestRated`, `bestValue`
 * - Adds `topCheapest`, `platformCheapest`, `priceStats`, and per-item metrics
 */
module.exports = (products = [], options = {}) => {
  const topN = Number.isInteger(options.topN) && options.topN > 0 ? options.topN : 3;

  // Normalize and filter invalid entries
  const normalized = products
    .map((p) => ({
      name: p.name || "",
      platform: p.platform || "Unknown",
      price: Number(p.price) || null,
      rating: Number(p.rating) || 0,
      reviewCount: Number(p.reviewCount) || 0,
      productUrl: p.productUrl || ""
    }))
    .filter((p) => p.price !== null && !Number.isNaN(p.price));

  if (!normalized.length) {
    return {
      cheapest: null,
      bestRated: null,
      bestValue: null,
      topCheapest: [],
      platformCheapest: {},
      priceStats: {
        count: 0,
        min: null,
        max: null,
        avg: null,
        median: null
      }
    };
  }

  // Sort by price ascending
  const byPrice = [...normalized].sort((a, b) => a.price - b.price);

  const cheapest = byPrice[0];

  // Top N cheapest with some derived metrics
  const avgPrice = byPrice.reduce((s, it) => s + it.price, 0) / byPrice.length;

  const medianPrice = (() => {
    const n = byPrice.length;
    if (n % 2 === 1) return byPrice[(n - 1) / 2].price;
    return (byPrice[n / 2 - 1].price + byPrice[n / 2].price) / 2;
  })();

  const topCheapest = byPrice.slice(0, topN).map((it) => ({
    ...it,
    percentBelowAvg: ((avgPrice - it.price) / avgPrice) * 100,
    percentFromCheapest: ((it.price - cheapest.price) / cheapest.price) * 100,
    recommended: it.price <= cheapest.price * 1.05 // within 5% of cheapest
  }));

  // Best rated
  const bestRated = normalized.reduce((a, b) => (a.rating >= b.rating ? a : b));

  // Best value = max (rating / price)
  const bestValue = normalized.reduce((a, b) => (a.rating / a.price >= b.rating / b.price ? a : b));

  // Cheapest per platform
  const platformCheapest = {};
  for (const item of normalized) {
    const key = item.platform || "Unknown";
    if (!platformCheapest[key] || item.price < platformCheapest[key].price) {
      platformCheapest[key] = item;
    }
  }

  // Price stats
  const priceStats = {
    count: byPrice.length,
    min: byPrice[0].price,
    max: byPrice[byPrice.length - 1].price,
    avg: Number(avgPrice.toFixed(2)),
    median: Number(medianPrice.toFixed(2))
  };

  return {
    cheapest,
    bestRated,
    bestValue,
    topCheapest,
    platformCheapest,
    priceStats
  };
};
