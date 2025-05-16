import { useGetProductsQuery } from "../app/productApi";
import styles from "../styles/ProductsPage.module.css";
import ProductCard from "../components/ProductCard";

const ProductsPage = () => {
  const { data: products, isLoading, error } = useGetProductsQuery();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>All Products</h1>
        <p>Check out some of our products.</p>
      </div>
      {isLoading && <p>Loading products...</p>}
      {error && <p>Error loading poroducts</p>}

      <div className={styles.grid}>
        {products?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
