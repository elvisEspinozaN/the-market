import { useState } from "react";
import styles from "../styles/ProfilePage.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useUpdateProfileMutation } from "../app/userApiSlice";
import { logout, setCredentials } from "../app/authSlice";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("account");
  const [editMode, setEditMode] = useState(false);
  const [updateProfile] = useUpdateProfileMutation();
  const [accountErrorMessage, setAccountErrorMessage] = useState(null);
  const [emailError, setEmailError] = useState(null);

  const [formData, setFormData] = useState({
    name: user.name || "",
    phone: user.phone || "",
    email_address: user.email_address,
    mailing_address: user.mailing_address || "",
    billing_information: user.billing_information || "",
  });

  const [emailForm, setEmailForm] = useState({
    newEmail: "",
    confirmEmail: "",
    password: "",
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await updateProfile(formData).unwrap();
      dispatch(
        setCredentials({
          user: updatedUser,
          token: localStorage.getItem("token"),
        })
      );
      setAccountErrorMessage(null);
      setEditMode(false);
    } catch (err) {
      console.error("Error on account changes: ", err);
      setAccountErrorMessage(
        err.data?.message || "Something went wrong, try again."
      );
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (emailForm.newEmail !== emailForm.confirmEmail) {
      setEmailError("Emails do not match.");
      return;
    }

    try {
      const updatedEmail = await updateProfile({
        ...user,
        email_address: emailForm.newEmail,
      }).unwrap();

      dispatch(
        setCredentials({
          user: updatedEmail,
          token: localStorage.getItem("token"),
        })
      );
      setEmailError(null);
      setEmailForm({
        newEmail: "",
        confirmEmail: "",
        password: "",
      });
      setEditMode(false);
    } catch (err) {
      console.error("Error on security changes: ", err);
      setEmailError(err.data?.message || "Something went wrong, try again.");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className={styles.container}>
      <div className={styles.containerTabs}>
        <button
          className={`${activeTab === "account" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("account")}
        >
          Account
        </button>
        <button
          className={`${activeTab === "security" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("security")}
        >
          Security
        </button>
        <button
          className={`${activeTab === "publicProfile" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("publicProfile")}
        >
          Public Profile
        </button>
      </div>

      <div className={styles.userContent}>
        {activeTab === "account" && (
          <div className={styles.accountContainer}>
            <div className={`${styles.accountAboutYou} ${styles.sectionCard}`}>
              <h3>About You</h3>
              {!editMode ? (
                <div className={styles.accountDisplayed}>
                  <p>Full Name: {user.name}</p>
                  <p>Phone Number: {user.phone}</p>
                  <p>Mailing Address: {user.mailing_address}</p>
                  <p>Billing Info: {user.billing_information}</p>
                  <button onClick={() => setEditMode(true)}>
                    Edit Profile
                  </button>
                </div>
              ) : (
                <form onSubmit={handleAccountSubmit}>
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />

                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />

                  <label>Mailing Address</label>
                  <input
                    type="text"
                    value={formData.mailing_address}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mailing_address: e.target.value,
                      })
                    }
                  />

                  <label>Billing Information</label>
                  <input
                    type="text"
                    value={formData.billing_information}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        billing_information: e.target.value,
                      })
                    }
                  />

                  {accountErrorMessage && (
                    <div className={styles.errorMessage}>
                      {accountErrorMessage}
                    </div>
                  )}

                  <button type="submit">Save Changes</button>
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className={styles.cancelButton}
                  >
                    Cancel
                  </button>
                </form>
              )}

              <button
                type="button"
                className={styles.logoutButton}
                onClick={handleLogout}
              >
                Logout
              </button>

              <div className={styles.accountTableOrders}>
                <table>
                  <thead>
                    <tr>
                      <th>Review your order history</th>
                    </tr>
                  </thead>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className={`${styles.securityContainer} ${styles.sectionCard}`}>
            <div className={styles.securityPassword}>
              <h3>Password</h3>
              <p>Coming soon...</p>
            </div>
            <div className={styles.securitytEmail}>
              <h3>Email</h3>
              {!editMode ? (
                <>
                  <p>Current Email: {user.email_address}</p>
                  <button
                    className={styles.changeEmailButton}
                    onClick={() => setEditMode(true)}
                  >
                    Change Email
                  </button>
                </>
              ) : (
                <>
                  <form onSubmit={handleEmailSubmit}>
                    <label>New email</label>
                    <input
                      type="email"
                      value={emailForm.newEmail}
                      onChange={(e) =>
                        setEmailForm({ ...emailForm, newEmail: e.target.value })
                      }
                    />
                    <label>Confirm new email</label>
                    <input
                      type="email"
                      value={emailForm.confirmEmail}
                      onChange={(e) =>
                        setEmailForm({
                          ...emailForm,
                          confirmEmail: e.target.value,
                        })
                      }
                    />
                    <label>Password</label>
                    <input
                      type="password"
                      value={emailForm.password}
                      onChange={(e) =>
                        setEmailForm({ ...emailForm, password: e.target.value })
                      }
                    />
                    {emailError && <p>{emailError}</p>}
                    <button type="submit">Change email</button>
                    <button
                      type="button"
                      className={styles.cancelButton}
                      onClick={() => setEditMode(false)}
                    >
                      Cancel
                    </button>
                  </form>
                </>
              )}
            </div>
            <div className={styles.securityOptions}>
              <h3>Close your account</h3>
              <p>You are permenantly deleting your account.</p>
              <br />
              <button>Delete account</button>
            </div>
          </div>
        )}

        {activeTab === "publicProfile" && (
          <div className={`${styles.publicProfile} ${styles.sectionCard}`}>
            <h3>Public Profile Preview</h3>
            <div className={styles.publicInfo}>
              <p>Display name: {user.username}</p>
              <p>Name: {user.name}</p>
              <p>Member Since: {formatDate(user.created_at)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
