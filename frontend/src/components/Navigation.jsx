import { Link } from "react-router-dom";
import styles from "../styles/Navigation.module.css";
import { useSelector } from "react-redux";

const Navigation = () => {
  const { user } = useSelector((state) => state.auth);

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

          {user ? (
            <>
              {user.is_admin && (
                <Link to="/dashboard" className={styles.navLink}>
                  Dashboard
                </Link>
              )}
              <Link to="/profile" className={styles.navLink}>
                Profile
              </Link>
            </>
          ) : (
            <Link to="/login" className={styles.navLink}>
              Login
            </Link>
          )}
          <Link to="/cart" className={styles.navLink}>
            Cart
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
