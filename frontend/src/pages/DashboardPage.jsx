import { useSelector } from "react-redux";
import styles from "../styles/DashboardPage.module.css";
import { useState } from "react";
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useDeleteUserMutation,
  useGetUsersQuery,
  usePromoteUserMutation,
  useUpdateProductMutation,
  useUpdateUserMutation,
} from "../app/adminApi";

import { GrUserAdmin } from "react-icons/gr";
import { MdDeleteForever, MdOutlineDeleteForever } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { FaEye } from "react-icons/fa";
import { useFetchAllProductsQuery } from "../app/adminApi";
import { useDispatch } from "react-redux";
import { logout } from "../app/authSlice";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // user
  const { user } = useSelector((state) => state.auth);

  const [userError, setUserError] = useState(null);
  const [editUser, setEditUser] = useState(false);
  const [viewUser, setViewUser] = useState(false);
  const [editUserForm, setEditUserForm] = useState({
    name: "",
    phone: "",
    email_address: "",
    mailing_address: "",
  });

  const { data: users, isLoadingUsers, usersError } = useGetUsersQuery();

  const [promoteUser] = usePromoteUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const handlePromoteUser = async (userId) => {
    try {
      await promoteUser(userId).unwrap();
      setUserError(null);
    } catch (err) {
      console.error("Error on promoting user: ", err);
      setUserError(err.data?.message || "Something went wrong, try again.");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId).unwrap();
      setUserError(null);
    } catch (err) {
      console.error("Error on deleting user: ", err);
      setUserError(err.data?.message || "Something went wrong, try again.");
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await updateUser({
        userId: editUser.id,
        ...editUserForm,
      }).unwrap();
      setEditUser(null);
      setUserError(null);
    } catch (err) {
      console.error("Error on updating user: ", err);
      setUserError(err.data?.message || "Something went wrong, try again.");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  // product
  const [productError, setProductError] = useState(null);
  const [editProduct, setEditProduct] = useState(false);
  const [viewProduct, setViewProduct] = useState(false);
  const [createNewProduct, setCreateNewProduct] = useState(false);
  const [editProductForm, setEditProductForm] = useState({
    name: "",
    description: "",
    price: 0,
    image_url: "",
    stock: 0,
    is_active: true,
  });

  const {
    data: products,
    isLoadingProducts,
    productsError,
  } = useFetchAllProductsQuery();

  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteProduct(productId).unwrap();
      setProductError(null);
    } catch (err) {
      console.error("Error on deleting product: ", err);
      setProductError(err.data?.message || "Something went wrong, try again.");
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({
        productId: editProduct.id,
        ...editProductForm,
      }).unwrap();
      setEditProduct(null);
      setProductError(null);
    } catch (err) {
      console.error("Error on updating product: ", err);
      setProductError(err.data?.message || "Soemthign went wrong, try again.");
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await createProduct(editProductForm).unwrap();
      setCreateNewProduct(false);
      setProductError(null);
      setEditProductForm({
        name: "",
        description: "",
        price: 0,
        image_url: "",
        stock: 0,
        is_active: true,
      });
    } catch (err) {
      console.error("Error on creating product: ", err);
      setProductError(err.data?.message || "Soemthig went wrong, try again");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.adminContent}>
        <div className={styles.adminContentHeader}>
          <h3>Welcome {user.name}</h3>
          <button onClick={handleLogout} className={styles.logoutButton}>
            (Logout)
          </button>
        </div>
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
              <>
                <div className={styles.productsHeader}>
                  <h3>User Management</h3>
                </div>
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
                              onClick={() => handlePromoteUser(user.id)}
                            >
                              <GrUserAdmin />
                            </button>
                          )}
                          <button
                            className={styles.usersActionButton}
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <MdOutlineDeleteForever />
                          </button>
                          <button
                            className={styles.usersActionButton}
                            onClick={() => {
                              setEditUser(user);
                              setEditUserForm({
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
              </>
            )}

            {editUser && (
              <div className={styles.userEditContainer}>
                <div className={styles.userEditPageHeader}>
                  <h3>Edit User: {editUser.username}</h3>
                </div>
                <div className={styles.userEditPageForm}>
                  <form onSubmit={handleUpdateUser}>
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={editUserForm.name}
                      onChange={(e) =>
                        setEditUserForm({
                          ...editUserForm,
                          name: e.target.value,
                        })
                      }
                    />
                    <label>Email</label>
                    <input
                      type="text"
                      value={editUserForm.email_address}
                      onChange={(e) =>
                        setEditUserForm({
                          ...editUserForm,
                          email_address: e.target.value,
                        })
                      }
                    />
                    <label>Phone</label>
                    <input
                      type="text"
                      value={editUserForm.phone}
                      onChange={(e) =>
                        setEditUserForm({
                          ...editUserForm,
                          phone: e.target.value,
                        })
                      }
                    />
                    <label>Mailing Address</label>
                    <input
                      type="text"
                      value={editUserForm.mailing_address}
                      onChange={(e) =>
                        setEditUserForm({
                          ...editUserForm,
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
                    <strong>Full Name: </strong> {viewUser.name}
                  </p>
                  <p>
                    <strong>Email: </strong> {viewUser.email_address}
                  </p>
                  <p>
                    <strong>Phone: </strong> {viewUser.phone || "N/A"}
                  </p>
                  <p>
                    <strong>Address: </strong>
                    {viewUser.mailing_address || "N/A"}
                  </p>
                  <p>
                    <strong>Admin Status: </strong>
                    {viewUser.is_admin ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "products" && (
          <div className={styles.productsContainer}>
            {isLoadingProducts && <p>Loading Products...</p>}
            {userError && (
              <p className={styles.errorMessage}>
                Error loading data, try again.
              </p>
            )}
            {!editProduct && !viewProduct && !createNewProduct && (
              <>
                <div className={styles.productsHeader}>
                  <h3>Product Management</h3>
                  <button onClick={() => setCreateNewProduct(true)}>
                    Create Product
                  </button>
                </div>
                <table className={styles.usersTable}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Stock</th>
                      <th>Active</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products?.map((product) => (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{product.stock}</td>
                        <td>{product.is_active ? "Yes" : "No"}</td>
                        <td className={styles.usersActions}>
                          <button
                            className={styles.usersActionButton}
                            onClick={handleDeleteProduct}
                          >
                            <MdDeleteForever />
                          </button>
                          <button
                            className={styles.usersActionButton}
                            onClick={() => {
                              setEditProduct(product);
                              setEditProductForm({
                                name: product.name,
                                description: product.description,
                                price: product.price,
                                image_url: product.image_url,
                                stock: product.stock,
                                is_active: product.is_active,
                              });
                            }}
                          >
                            <CiEdit />
                          </button>
                          <button
                            className={styles.usersActionButton}
                            onClick={() => setViewProduct(product)}
                          >
                            <FaEye />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {editProduct && (
              <div className={styles.userEditContainer}>
                <div className={styles.userEditPageHeader}>
                  <h3>Edit Product: {editProduct.name}</h3>
                </div>
                <div className={styles.userEditPageForm}>
                  <form onSubmit={handleUpdateProduct}>
                    <label>Product Name</label>
                    <input
                      type="text"
                      value={editProductForm.name}
                      onChange={(e) =>
                        setEditProductForm({
                          ...editProductForm,
                          name: e.target.value,
                        })
                      }
                    />
                    <label>Descripton</label>
                    <textarea
                      value={editProductForm.description}
                      onChange={(e) =>
                        setEditProductForm({
                          ...editProductForm,
                          description: e.target.value,
                        })
                      }
                    />
                    <label>Price</label>
                    <input
                      type="number"
                      value={editProductForm.price}
                      onChange={(e) =>
                        setEditProductForm({
                          ...editProductForm,
                          price: e.target.value,
                        })
                      }
                    />
                    <label>Image</label>
                    <input
                      type="text"
                      value={editProductForm.image_url}
                      onChange={(e) =>
                        setEditProductForm({
                          ...editProductForm,
                          image_url: e.target.value,
                        })
                      }
                    />
                    <label>
                      Stock:
                      <input
                        type="number"
                        value={editProductForm.stock}
                        onChange={(e) =>
                          setEditProductForm({
                            ...editProductForm,
                            stock: e.target.value,
                          })
                        }
                      />
                    </label>

                    <label>
                      <input
                        type="checkbox"
                        checked={editProductForm.is_active}
                        onChange={(e) =>
                          setEditProductForm({
                            ...editProductForm,
                            is_active: e.target.checked,
                          })
                        }
                      />
                      Active Product
                    </label>

                    {productError && (
                      <p className={styles.errorMessage}>{productError}</p>
                    )}

                    <button type="submit">Save Changes</button>
                    <button
                      type="button"
                      onClick={() => setEditProduct(null)}
                      className={styles.cancelButton}
                    >
                      Cancel
                    </button>
                  </form>
                </div>
              </div>
            )}

            {viewProduct && (
              <div className={styles.userViewContainer}>
                <div className={styles.userViewHeader}>
                  <h3>{viewProduct.name}</h3>
                  <button
                    className={styles.cancelButton}
                    onClick={() => setViewProduct(null)}
                  >
                    x
                  </button>
                </div>
                <div className={styles.productViewDisplay}>
                  <div className={styles.userViewDisplay}>
                    <p>
                      <strong>Description: </strong> {viewProduct.description}
                    </p>
                    <p>
                      <strong>Price: </strong> ${viewProduct.price}
                    </p>
                    <p>
                      <strong>Active: </strong>
                      {viewProduct.is_active ? "Yes" : "No"}
                    </p>
                    <p>
                      <strong>Image Url: </strong> {viewProduct.image_url}
                    </p>
                  </div>

                  {viewProduct.image_url && (
                    <div className={styles.productViewImageContainer}>
                      <img
                        src={viewProduct.image_url}
                        alt={viewProduct.name}
                        className={styles.productViewImage}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {createNewProduct && (
              <div className={styles.userEditContainer}>
                <div className={styles.userEditPageHeader}>
                  <h3>Create New Product</h3>
                </div>
                <div className={styles.userEditPageForm}>
                  <form onSubmit={handleCreateProduct}>
                    <label>Product Name</label>
                    <input
                      type="text"
                      value={editProductForm.name}
                      onChange={(e) =>
                        setEditProductForm({
                          ...editProductForm,
                          name: e.target.value,
                        })
                      }
                      required
                    />

                    <label>Description</label>
                    <textarea
                      value={editProductForm.description}
                      onChange={(e) =>
                        setEditProductForm({
                          ...editProductForm,
                          description: e.target.value,
                        })
                      }
                      required
                    />

                    <label>Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editProductForm.price}
                      onChange={(e) =>
                        setEditProductForm({
                          ...editProductForm,
                          price: parseFloat(e.target.value),
                        })
                      }
                      required
                    />

                    <label>Image</label>
                    <input
                      type="text"
                      value={editProductForm.image_url}
                      onChange={(e) =>
                        setEditProductForm({
                          ...editProductForm,
                          image_url: e.target.value,
                        })
                      }
                    />

                    <label>Stock Quantity</label>
                    <input
                      type="number"
                      value={editProductForm.stock}
                      onChange={(e) =>
                        setEditProductForm({
                          ...editProductForm,
                          stock: parseInt(e.target.value),
                        })
                      }
                      required
                    />

                    <label>
                      <input
                        type="checkbox"
                        checked={editProductForm.is_active}
                        onChange={(e) =>
                          setEditProductForm({
                            ...editProductForm,
                            is_active: e.target.checked,
                          })
                        }
                      />
                      Active Product
                    </label>

                    {productError && (
                      <p className={styles.errorMessage}>{productError}</p>
                    )}

                    <button type="submit">Create Product</button>
                    <button
                      type="button"
                      onClick={() => setCreateNewProduct(false)}
                      className={styles.cancelButton}
                    >
                      Cancel
                    </button>
                  </form>
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
