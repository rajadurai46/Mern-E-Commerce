import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import "../styles/category.css";

export default function Category() {
  const { name } = useParams();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  useEffect(() => {
    api
      .get("/products?category=all")
      .then(res => {
        setProducts(res.data.products || []); // ✅ FIX
      })
      .catch(err => console.error(err));
  }, [name]);

  const filteredProducts = products
    .filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "low") return a.price - b.price;
      if (sort === "high") return b.price - a.price;
      return 0;
    });

  return (
    <>
      <input
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="">Sort</option>
        <option value="low">Price: Low → High</option>
        <option value="high">Price: High → Low</option>
      </select>

      <div className="grid">
        {filteredProducts.length ? (
          filteredProducts.map(p => (
            <ProductCard key={p._id} product={p} />
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>
    </>
  );
}

