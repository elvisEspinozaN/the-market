import { useGetProductsQuery } from "../app/productApi";
import ProductCard from "../components/ProductCard";
import styles from "../styles/Home.module.css";

const Home = () => {
  const { data: products, isLoading, error } = useGetProductsQuery();

  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <div className={styles.heroContainer}>
          <h1>Simple, find what you love.</h1>
          <p>Amazing sales, find what fits you best.</p>
        </div>
        <img
          src="/assets/shutter-speed-BQ9usyzHx_w-unsplash.jpg"
          alt="hero-banner"
        />
      </header>

      <section className={styles.featuredProducts}>
        <h2>Featured Products</h2>
        {isLoading && <p>Loading products...</p>}
        {error && <p>Error loading products</p>}

        <div className={styles.productsGrid}>
          {products?.slice(0, 5).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
