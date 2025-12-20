import { useState } from "react";
import { searchProducts, compareProducts } from "./api";

export default function App() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [compare, setCompare] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;

    setLoading(true);
    const data = await searchProducts(query);
    const cmp = await compareProducts(query);

    setProducts(data);
    setCompare(cmp);
    setLoading(false);
  };

  return (
    <div className="page">
      <h1 className="logo">shopAI</h1>
      <p className="tagline">Compare smarter. Buy better.</p>

      <div className="search-box">
        <input
          placeholder="Search products like iPhone"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {loading && <p className="loading">Searching…</p>}

      <div className="results">
        {products.map((p, i) => {
          let badge = "";
          if (compare?.cheapest?.name === p.name) badge = "Cheapest";
          if (compare?.bestRated?.name === p.name) badge = "Best Rated";
          if (compare?.bestValue?.name === p.name) badge = "Best Value";

          return (
            <div className="card" key={i}>
              {badge && <span className="badge">{badge}</span>}
              <h3>{p.platform}</h3>
              <p className="name">{p.name}</p>
              <p className="price">₹{p.price}</p>
              <p className="rating">⭐ {p.rating}</p>
              <a href={p.productUrl} target="_blank">View product</a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
