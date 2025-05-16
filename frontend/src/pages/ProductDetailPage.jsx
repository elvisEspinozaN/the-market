import { useParams } from "react-router-dom";
import { useGetProductByIdQuery, useGetProductsQuery } from "../app/productApi";
import styles from "../styles/ProductDetailPage.module.css";
import ProductCard from "../components/ProductCard";
import { useState } from "react";

const ProductDetailPage = () => {
  const { id } = useParams();
  const { data: product, isLoading, error } = useGetProductByIdQuery(id);
  const {
    data: products,
    isLoadingProducts,
    errorProducts,
  } = useGetProductsQuery();
  const [activeTab, setActiveTab] = useState("reviews");

  if (isLoading) return <p>Loading product...</p>;
  if (error) return <p>Error loading product</p>;

  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <img
          src={product.image_url}
          alt={product.name}
          className={styles.image}
        />
      </div>
      <div className={styles.productDetail}>
        <h1>{product.name}</h1>
        <p className={styles.price}>$ {product.price}</p>

        {product.stock === 0 && <p className={styles.soldOut}>Sold Out</p>}

        {product.stock > 0 && product.stock <= 3 && (
          <p className={styles.lowStock}>Only a few left!</p>
        )}

        <div className={styles.description}>
          <p>{product.description}</p>
        </div>
        <div className={styles.actions}>
          <button className={styles.addToCart} disabled={product.stock === 0}>
            {product.stock === 0 ? "Out of stock" : "Add to Cart"}
          </button>
          <button className={styles.addToWishlist}>Wishlist</button>
        </div>
      </div>

      <div className={styles.tabContainer}>
        <div className={styles.tabButtons}>
          <button
            className={`${activeTab === "reviews" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews
          </button>
          <button
            className={`${activeTab === "related" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("related")}
          >
            Related Products
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === "reviews" && (
            <div className={styles.reviewsContainer}>
              <div className={styles.reviewsSummary}>
                <h2>{product.name} reviews - avg stars</h2>
                <p>Coming Soon</p>
              </div>

              <div className={styles.reviewsContent}>
                <div className={styles.reviewsCard}>
                  <p>stars</p>
                  <p>review paragraph</p>
                  <p>user - date</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "related" && (
            <section className={styles.relatedContainer}>
              <h2>Related Searches</h2>
              {isLoadingProducts && <p>Loading products...</p>}
              {errorProducts && <p>Error loading products</p>}

              <div className={styles.relatedGrid}>
                {products?.slice(0, 5).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
export default ProductDetailPage;
