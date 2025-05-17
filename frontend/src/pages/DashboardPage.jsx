import { useSelector } from "react-redux";
import styles from "../styles/DashboardPage.module.css";
import { useState } from "react";
import { useGetUsersQuery } from "../app/adminApi";
import { useGetProductsQuery } from "../app/productApi";

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("overview");
  const { data: users, isLoadingUsers, usersError } = useGetUsersQuery();
  const {
    data: products,
    isLoadingProducts,
    productsError,
  } = useGetProductsQuery();

  return (
    <div className={styles.container}>
      <div className={styles.adminContent}>
        <h3>Welcome {user.name}</h3>
        <div className={styles.tabContainer}>
          <button
            className={`${activeTab === "overview" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`${activeTab === "users" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
          <button
            className={`${activeTab === "products" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("products")}
          >
            Products
          </button>
          <button
            className={`${activeTab === "orders" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            Orders
          </button>
        </div>
      </div>

      <div className={styles.dashboardContent}>
        {activeTab === "overview" && (
          <div className={styles.overviewContainer}>
            {(isLoadingProducts || isLoadingUsers) && (
              <p>Loading overview data...</p>
            )}
            {(usersError || productsError) && (
              <p className={styles.errorMessage}>
                Error loading data, try again.
              </p>
            )}
            <div className={styles.overviewQuickContainer}>
              <div className={styles.overviewQuickView}>
                <div className={styles.overviewQuickViewHeader}>
                  <h3>Total Customers</h3>
                  <p onClick={() => setActiveTab("users")}>i</p>
                </div>
                <p className={styles.overviewQuickViewStat}>
                  {users?.length ?? 0}
                </p>
              </div>
              <div className={styles.overviewQuickView}>
                <div className={styles.overviewQuickViewHeader}>
                  <h3>Current Products</h3>
                  <p onClick={() => setActiveTab("products")}>i</p>
                </div>
                <p className={styles.overviewQuickViewStat}>
                  {products?.length ?? 0}
                </p>
              </div>
              <div className={styles.overviewQuickView}>
                <div className={styles.overviewQuickViewHeader}>
                  <h3>Orders</h3>
                  <p onClick={() => setActiveTab("orders")}>i</p>
                </div>
                <p className={styles.overviewQuickViewStat}>20</p>
              </div>
            </div>
            <div className={styles.overviewDepthContainer}>
              <div className={styles.overviewDepthView}>
                <h4>Recent Orders</h4>
                <ul>
                  <li>Order #2345 — John Doe — $34.99</li>
                  <li>Order #2344 — Jane Smith — $99.00</li>
                  <li>Order #2343 — Bob Johnson — $15.50</li>
                </ul>
              </div>
              <div className={styles.overviewDepthView}>
                <h4>Top Products</h4>
                <ul>
                  <li>Tote Bag — 40 Sold</li>
                  <li>Bananas — 30 Sold</li>
                  <li>Key Chain — 20 Sold</li>
                </ul>
              </div>
            </div>
            <div className={styles.lowStockContainer}>
              <h4>Low Stock Alert</h4>
              <ul>
                {products
                  ?.filter((product) => product.stock <= 3)
                  .map((product) => (
                    <li key={product.id}>
                      {product.name} - only {product.stock} left!
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
