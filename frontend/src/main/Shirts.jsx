import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import "../styles/category.css";
import { decrypt } from "../utils/responseEncryptDycrypt.jsx";

export default function Shirts() {
  const [products, setProducts] = useState([]);
  const { name } = useParams(); // shirts, shoes, watches, bottles

  useEffect(() => {
    api
      .get(`/products?category=${name}`)
      .then((res) => {
         const decryptedProducts = decrypt(res.data.data);

      console.log("decrypted------", decryptedProducts);
        // ✅ FIX: access products array properly
        setProducts(decryptedProducts.data);
      })
      .catch((err) => console.error(err));
  }, [name]);

  return (
    <div className="category-page">
      <h2 className="category-title">
        {name?.toUpperCase()}
      </h2>

      <div className="grid">
        {products.length > 0 ? (
          products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))
        ) : (
          <p className="empty-text">No products found</p>
        )}
      </div>
    </div>
  );
}

