module.exports = (products) => {
  const cheapest = products.reduce((a, b) =>
    a.price < b.price ? a : b
  );

  const bestRated = products.reduce((a, b) =>
    a.rating > b.rating ? a : b
  );

  const bestValue = products.reduce((a, b) =>
    a.rating / a.price > b.rating / b.price ? a : b
  );

  return {
    cheapest,
    bestRated,
    bestValue
  };
};
