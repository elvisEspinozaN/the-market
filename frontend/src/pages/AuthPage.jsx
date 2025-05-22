import { useState } from "react";
import styles from "../styles/AuthPage.module.css";
import { useLoginMutation, useRegisterMutation } from "../app/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../app/authSlice";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const [loginCard, setLoginCard] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    email_address: "",
  });
  const [login] = useLoginMutation();
  const [register] = useRegisterMutation();
  const [errorMessage, setErrorMessage] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = loginCard
        ? await login({
            username: formData.username,
            password: formData.password,
          }).unwrap()
        : await register(formData).unwrap();

      dispatch(setCredentials({ token: response.token, user: response.user }));

      navigate("/");
    } catch (err) {
      console.error("Error on login or register: ", err);
      setErrorMessage(err.data?.message || "Something went wrong, try again.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.authCard}>
        <h2>{loginCard ? "Welcome Back" : "Create Account"}</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
          {!loginCard && (
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          )}
          {!loginCard && (
            <input
              type="email"
              placeholder="Email"
              value={formData.email_address}
              onChange={(e) =>
                setFormData({ ...formData, email_address: e.target.value })
              }
              required
            />
          )}
          {errorMessage && (
            <div className={styles.errorMessage}>{errorMessage}</div>
          )}
          <button type="submit">{loginCard ? "Login" : "Register"}</button>
        </form>
        <p>
          {loginCard ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => setLoginCard(!loginCard)}
            className={styles.authToggleButton}
          >
            {loginCard ? "Register here" : "Login here"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
