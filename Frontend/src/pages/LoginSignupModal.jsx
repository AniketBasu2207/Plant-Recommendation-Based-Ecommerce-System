/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from "react";
import axios from "axios";
import Success_Alert from "./Success_Alert";

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const LoginSignupModal = ({ onLoginChange, page_open }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loginError, setLoginError] = useState("");
  const [signupError, setSignupError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/check");

        if (response.data.isAuthenticated) {
          setIsLoggedIn(true);
          onLoginChange(true);
          setShowModal(false);
        } else if (page_open === false) {
          setIsLoggedIn(false);
          onLoginChange(false);
          setShowModal(false);
        } else {
          setIsLoggedIn(false);
          onLoginChange(false);
          setShowModal(true);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsLoggedIn(false);
        onLoginChange(false);
        if (page_open !== false) {
          setShowModal(true);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [onLoginChange, page_open]);

  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;
    if (formType === "login") {
      setLoginData((prev) => ({ ...prev, [name]: value }));
      setLoginError("");
    } else {
      setSignupData((prev) => ({ ...prev, [name]: value }));
      setSignupError("");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      setLoginError("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.post("/login", {
        email: loginData.email,
        password: loginData.password,
      });

      if (response.data.success) {
        setIsLoggedIn(true);
        localStorage.setItem("isLoggedIn", JSON.stringify(true));
        onLoginChange(true);
        setShowModal(false);
        setLoginData({ email: "", password: "" });
      } else {
        setLoginError(
          response.data.message || "Username or password is incorrect"
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        setLoginError(error.response.data.message || "Login failed");
      } else if (error.request) {
        setLoginError("No response from server");
      } else {
        setLoginError("Login request failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !signupData.name ||
      !signupData.email ||
      !signupData.password ||
      !signupData.confirmPassword
    ) {
      setSignupError("Please fill in all fields");
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      setSignupError("Passwords do not match");
      return;
    }

    if (signupData.password.length < 8) {
      setSignupError("Password must be at least 8 characters");
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.post("/signup", {
        name: signupData.name,
        email: signupData.email,
        password: signupData.password,
      });

      if (response.data.success) {
        Success_Alert("Signup successful! You can now log in.");
        setActiveTab("login");
        setSignupData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setSignupError("");
      } else {
        setSignupError(response.data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      if (error.response) {
        setSignupError(error.response.data.message || "Signup failed");
      } else if (error.request) {
        setSignupError("No response from server");
      } else {
        setSignupError("Signup request failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setLoginError("");
    setSignupError("");
  };

  return (
    <>
      {showModal && (
        <div className="modal show" style={{ display: "block" }} tabIndex="-1">
          <div className="modal-dialog" style={{ width: "35rem" }}>
            <div className="modal-content body-bg-color">
              <div className="modal-header">
                <h5 className="modal-title body-text-color fw-bold fs-4">
                  {isLoading ? "Processing..." : "Login / Signup"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                  disabled={isLoading}
                ></button>
              </div>
              <div className="modal-body">
                <ul className="nav nav-tabs">
                  <li className="nav-item">
                    <button
                      className={`body-text-color fw-bold nav-link ${
                        activeTab === "login" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("login")}
                      disabled={isLoading}
                    >
                      Login
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link body-text-color fw-bold ${
                        activeTab === "signup" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("signup")}
                      disabled={isLoading}
                    >
                      Signup
                    </button>
                  </li>
                </ul>

                <div className="tab-content mt-3">
                  {activeTab === "login" && (
                    <form onSubmit={handleLogin}>
                      <div className="mb-3">
                        <label className="form-label">Email address</label>
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          value={loginData.email}
                          onChange={(e) => handleInputChange(e, "login")}
                          required
                          disabled={isLoading}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                          type="password"
                          name="password"
                          className="form-control"
                          value={loginData.password}
                          onChange={(e) => handleInputChange(e, "login")}
                          required
                          disabled={isLoading}
                        />
                      </div>
                      {loginError && (
                        <div className="alert alert-danger text-center">
                          {loginError}
                        </div>
                      )}
                      <div className="d-flex justify-content-center align-items-center">
                        <button
                          type="submit"
                          className="btn body-dark-bg-color body-light-text-color fw-bold w-75 mt-4"
                          disabled={isLoading}
                        >
                          {isLoading ? "Logging in..." : "Login"}
                        </button>
                      </div>

                      <p className="mt-2 text-center body-text-color fw-bold">
                        Don't have an account?{" "}
                        <span
                          className="text-primary"
                          style={{ cursor: "pointer" }}
                          onClick={() => setActiveTab("signup")}
                        >
                          Signup
                        </span>
                      </p>
                    </form>
                  )}

                  {activeTab === "signup" && (
                    <form onSubmit={handleSignup}>
                      <div className="mb-3">
                        <label className="form-label">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          className="form-control"
                          value={signupData.name}
                          onChange={(e) => handleInputChange(e, "signup")}
                          required
                          disabled={isLoading}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Email address</label>
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          value={signupData.email}
                          onChange={(e) => handleInputChange(e, "signup")}
                          required
                          disabled={isLoading}
                        />
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="mb-3 w-50 me-2">
                          <label className="form-label">Password</label>
                          <input
                            type="password"
                            name="password"
                            className="form-control"
                            value={signupData.password}
                            onChange={(e) => handleInputChange(e, "signup")}
                            required
                            disabled={isLoading}
                          />
                        </div>
                        <div className="mb-3 w-50 ms-2">
                          <label className="form-label">Confirm Password</label>
                          <input
                            type="password"
                            name="confirmPassword"
                            className="form-control"
                            value={signupData.confirmPassword}
                            onChange={(e) => handleInputChange(e, "signup")}
                            required
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                      {signupError && (
                        <div className="alert alert-danger text-center">
                          {signupError}
                        </div>
                      )}
                      <div className="d-flex justify-content-center align-items-center">
                        <button
                          type="submit"
                          className="btn body-dark-bg-color body-light-text-color fw-bold w-75 mt-4"
                          disabled={isLoading}
                        >
                          {isLoading ? "Creating account..." : "Signup"}
                        </button>
                      </div>

                      <p className="mt-2 text-center body-text-color fw-bold">
                        Already have an account?{" "}
                        <span
                          className="text-primary"
                          style={{ cursor: "pointer" }}
                          onClick={() => setActiveTab("login")}
                        >
                          Login
                        </span>
                      </p>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginSignupModal;
