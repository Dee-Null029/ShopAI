module.exports = async (query) => {
  return [
    {
      name: query + " (Amazon)",
      platform: "Amazon",
      price: 69999,
      rating: 4.4,
      reviewCount: 12000,
      productUrl: "https://amazon.in"
    }
  ];
};
