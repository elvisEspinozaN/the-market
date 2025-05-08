// frontend/src/components/Navigation.jsx
import { Link } from "react-router-dom";
import styles from "../styles/Navigation.module.css";

const Navigation = () => {
  return (
    <nav className={styles.nav}>
      <div className={styles.navContainer}>
        <Link to="/" className={styles.navLogo}>
          The Market
        </Link>
        <input
          type="text"
          placeholder="Search"
          className={styles.navSearchBar}
        />
        <div className={styles.navLinks}>
          <Link to="/products" className={styles.navLink}>
            Shop
          </Link>
          <Link to="/" className={styles.navLink}>
            Wishlist
          </Link>
          <Link to="/" className={styles.navLink}>
            Profile
          </Link>
          <Link to="/" className={styles.navLink}>
            Cart
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
