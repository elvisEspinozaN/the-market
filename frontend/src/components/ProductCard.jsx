import { Link } from "react-router-dom";
import styles from "../styles/ProductCard.module.css";

const ProductCard = ({ product }) => {
  return (
    <div className={styles.productCard}>
      <Link to={`/products/${product.id}`}>
        <img
          src={product.image_url}
          alt={product.name}
          className={styles.productImage}
        />
        <div className={styles.productDetails}>
          <h3 className={styles.productName}>{product.name}</h3>
          <p className={styles.productPrice}>$ {product.price}</p>
        </div>
      </Link>
      <button className={styles.productWishlistButton}></button>
    </div>
  );
};

export default ProductCard;
