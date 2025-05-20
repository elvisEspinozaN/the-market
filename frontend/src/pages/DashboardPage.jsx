import { useSelector } from "react-redux";
import styles from "../styles/DashboardPage.module.css";
import { useState } from "react";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  usePromoteUserMutation,
  useUpdateUserMutation,
} from "../app/adminApi";

import { useGetProductsQuery } from "../app/productApi";
import { GrUserAdmin } from "react-icons/gr";
import { MdOutlineDeleteForever } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { FaEye } from "react-icons/fa";

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("overview");
  const [userError, setUserError] = useState(null);
  const [editUser, setEditUser] = useState(false);
  const [viewUser, setViewUser] = useState(false);

  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    email_address: "",
    mailing_address: "",
  });

  const { data: users, isLoadingUsers, usersError } = useGetUsersQuery();
  const {
    data: products,
    isLoadingProducts,
    productsError,
  } = useGetProductsQuery();

  const [promoteUser] = usePromoteUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const handlePromote = async (userId) => {
    try {
      await promoteUser(userId).unwrap();
      setUserError(null);
    } catch (err) {
      console.error("Error on promoting user: ", err);
      setUserError(err.data?.message || "Something went wrong, try again.");
    }
  };

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId).unwrap();
      setUserError(null);
    } catch (err) {
      console.error("Error on deleting user: ", err);
      setUserError(err.data?.message || "Something went wrong, try again.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateUser({
        userId: editUser.id,
        ...editForm,
      }).unwrap();
      setEditUser(null);
      setUserError(null);
    } catch (err) {
      console.error("Error on updating user: ", err);
    }
  };

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

        {activeTab === "users" && (
          <div className={styles.usersContainer}>
            {isLoadingUsers && <p>Loading Users data...</p>}
            {userError && (
              <p className={styles.errorMessage}>
                Error loading data, try again.
              </p>
            )}
            {!editUser && !viewUser && (
              <table className={styles.usersTable}>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Admin</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((user) => (
                    <tr key={user.id}>
                      <td>{user.username}</td>
                      <td>{user.email_address}</td>
                      <td>{user.is_admin ? "Yes" : "No"}</td>
                      <td className={styles.usersActions}>
                        {!user.is_admin && (
                          <button
                            className={styles.usersActionButton}
                            onClick={() => handlePromote(user.id)}
                          >
                            <GrUserAdmin />
                          </button>
                        )}
                        <button
                          className={styles.usersActionButton}
                          onClick={() => handleDelete(user.id)}
                        >
                          <MdOutlineDeleteForever />
                        </button>
                        <button
                          className={styles.usersActionButton}
                          onClick={() => {
                            setEditUser(user);
                            setEditForm({
                              name: user.name,
                              email_address: user.email_address || "",
                              phone: user.phone || "",
                              mailing_address: user.mailing_address || "",
                            });
                          }}
                        >
                          <CiEdit />
                        </button>
                        <button
                          className={styles.usersActionButton}
                          onClick={() => setViewUser(user)}
                        >
                          <FaEye />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {editUser && (
              <div className={styles.userEditContainer}>
                <div className={styles.userEditPageHeader}>
                  <h3>Edit User: {editUser.username}</h3>
                </div>
                <div className={styles.userEditPageForm}>
                  <form onSubmit={handleUpdate}>
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                    />
                    <label>Email</label>
                    <input
                      type="text"
                      value={editForm.email_address}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          email_address: e.target.value,
                        })
                      }
                    />
                    <label>Phone</label>
                    <input
                      type="text"
                      value={editForm.phone}
                      onChange={(e) =>
                        setEditForm({ ...editForm, phone: e.target.value })
                      }
                    />
                    <label>Mailing Address</label>
                    <input
                      type="text"
                      value={editForm.mailing_address}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          mailing_address: e.target.value,
                        })
                      }
                    />

                    {userError && (
                      <p className={styles.errorMessage}>{userError}</p>
                    )}

                    <button type="submit">Save Changes</button>
                    <button
                      type="button"
                      onClick={() => setEditUser(null)}
                      className={styles.cancelButton}
                    >
                      Cancel
                    </button>
                  </form>
                </div>
              </div>
            )}

            {viewUser && (
              <div className={styles.userViewContainer}>
                <div className={styles.userViewHeader}>
                  <h3>{viewUser.username}</h3>
                  <button
                    className={styles.cancelButton}
                    onClick={() => setViewUser(null)}
                  >
                    x
                  </button>
                </div>
                <div className={styles.userViewDisplay}>
                  <p>
                    <strong>Full Name:</strong> {viewUser.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {viewUser.email_address}
                  </p>
                  <p>
                    <strong>Phone:</strong> {viewUser.phone || "N/A"}
                  </p>
                  <p>
                    <strong>Address:</strong>
                    {viewUser.mailing_address || "N/A"}
                  </p>
                  <p>
                    <strong>Admin Status:</strong>
                    {viewUser.is_admin ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
