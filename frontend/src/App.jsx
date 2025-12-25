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
  const [topN, setTopN] = useState(3);
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

  // Helper to determine if two product records refer to the same product
  const isSameProduct = (a = {}, b = {}) => {
    if (!a || !b) return false;
    // Prefer exact productUrl match when available
    if (a.productUrl && b.productUrl && a.productUrl === b.productUrl) return true;
    // Fall back to name match (case-insensitive, trimmed) and price equality within small tolerance
    const nameA = (a.name || "").trim().toLowerCase();
    const nameB = (b.name || "").trim().toLowerCase();
    if (nameA && nameB && nameA === nameB) return true;
    const priceA = Number(a.price) || 0;
    const priceB = Number(b.price) || 0;
    if (priceA && priceB && Math.abs(priceA - priceB) <= Math.max(1, priceA * 0.02)) return true; // within 2%
    return false;
  };

  const renderBadges = (p) => {
    const badges = [];
    if (compare?.cheapest && isSameProduct(compare.cheapest, p)) badges.push({ label: "Cheapest", type: "cheapest" });
    if (compare?.bestRated && isSameProduct(compare.bestRated, p)) badges.push({ label: "Best Rated", type: "best-rated" });
    if (compare?.bestValue && isSameProduct(compare.bestValue, p)) badges.push({ label: "Best Value", type: "best-value" });

    // Top cheapest entry (from comparator)
    const topEntry = (compare?.topCheapest || []).find((t) => isSameProduct(t, p));
    if (topEntry) {
      badges.push({ label: `Top ${topN} Cheapest`, type: "top-cheapest" });
      if (topEntry.recommended) badges.push({ label: "Recommended", type: "recommended" });
    }

    // Platform-specific cheapest
    if (compare?.platformCheapest && Object.keys(compare.platformCheapest).some((k) => isSameProduct(compare.platformCheapest[k], p))) {
      badges.push({ label: "Platform Cheapest", type: "platform-cheapest" });
    }

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

        <div className="topn-control">
          <label htmlFor="topn">Top N:</label>
          <input
            id="topn"
            type="number"
            min={1}
            max={20}
            value={topN}
            onChange={(e) => setTopN(Number(e.target.value || 1))}
            disabled={loading}
          />
        </div>

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
        <div className="cards">
          {products.map((p, i) => {
            const topEntry = compare?.topCheapest?.find((t) => t.productUrl === p.productUrl);
            return (
              <div className="card" key={i}>
                <div className="badge-row">{renderBadges(p)}</div>
                <div className="card-content">
                  <div className="platform">{p.platform}</div>
                  <div className="name">{p.name}</div>

                  <div className="meta">
                    <div className="price">₹{p.price}</div>
                    <div className="rating">⭐ {p.rating} <span className="reviews">({p.reviewCount})</span></div>
                  </div>

                  {topEntry && (
                    <div className="inline-savings">{topEntry.percentBelowAvg?.toFixed(1)}% below avg</div>
                  )}

                  <a href={p.productUrl} target="_blank" rel="noopener noreferrer" className="link">View product</a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
