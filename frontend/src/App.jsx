import React, { useState } from "react";
import { searchProducts, compareProducts } from "./api";
import "./App.css";

function Badge({ label, type }) {
  return (
    <span className={`badge ${type}`}>{label}</span>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [compare, setCompare] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    const q = query.trim();
    if (!q) return;

    setError("");
    setLoading(true);

    try {
      const [data, cmp] = await Promise.all([
        searchProducts(q),
        compareProducts(q),
      ]);

      setProducts(Array.isArray(data) ? data : []);
      setCompare(cmp || null);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to fetch results");
      setProducts([]);
      setCompare(null);
    } finally {
      setLoading(false);
    }
  };

  const renderBadges = (p) => {
    const badges = [];
    if (compare?.cheapest && compare.cheapest.productUrl === p.productUrl) badges.push({ label: "Cheapest", type: "cheapest" });
    if (compare?.bestRated && compare.bestRated.productUrl === p.productUrl) badges.push({ label: "Best Rated", type: "best-rated" });
    if (compare?.bestValue && compare.bestValue.productUrl === p.productUrl) badges.push({ label: "Best Value", type: "best-value" });
    return badges.map((b, idx) => <Badge key={idx} label={b.label} type={b.type} />);
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
          disabled={loading}
          aria-label="Search products"
        />
        <button onClick={handleSearch} disabled={loading} aria-label="Search">
          {loading ? "Searching…" : "Search"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}
      {loading && <p className="loading">Searching…</p>}

      {!loading && !error && products.length === 0 && (
        <p className="no-results">No products found — try a different query.</p>
      )}

      <div className="results">
        {products.map((p, i) => (
          <div className="card" key={i}>
            <div className="badge-row">{renderBadges(p)}</div>
            <div className="card-content">
              <div className="platform">{p.platform}</div>
              <div className="name">{p.name}</div>

              <div className="meta">
                <div className="price">₹{p.price}</div>
                <div className="rating">⭐ {p.rating} <span className="reviews">({p.reviewCount})</span></div>
              </div>

              <a href={p.productUrl} target="_blank" rel="noopener noreferrer" className="link">View product</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
