import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import MenuComponent from "./MenuComponent";
import LoginSignupModal from "../pages/LoginSignupModal";

import { useEffect } from "react";
import axios from "axios";

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
const Header = ({
  cartCount,
  wishlistCount,
  setCartCount,
  setWishlistCount,
}) => {
  const style = ({ isActive }) => {
    return {
      color: isActive ? "#fde00a" : "#fffdec",
      fontSize: isActive ? "20px" : "18px",
    };
  };

  const [isMenuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [pageopen, setpageopen] = useState(false);

  useEffect(() => {
    // create logic

    check_login();
  }, []);

  const check_login = async () => {
    try {
      const response = await api.get("/islogin");
      if (response.data.response) {
        setIsLoggedIn(true);
        localStorage.setItem("isLoggedIn", JSON.stringify(true));
      } else {
        // set not login
        setIsLoggedIn(false);
        localStorage.setItem("isLoggedIn", JSON.stringify(false));
      }
    } catch (error) {
      // setIsLoggedIn(false)
      localStorage.setItem("isLoggedIn", JSON.stringify(false));
      console.log(error);
    }
  };

  const handleLoginSuccess = (status) => {
    setIsLoggedIn(status);
    setShowModal(false);
  };

  const login = () => {
    if (!isLoggedIn) {
      // means user not log-in
      setpageopen(true);
      setShowModal(true);
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg header-bg-color p-3">
        <div className="container-fluid">
          <NavLink to="/" className="navbar-brand text-light">
            F L O R U S
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item ">
                <NavLink to="/" className="nav-link" style={style}>
                  Home
                </NavLink>
              </li>
              <li className="nav-item ">
                <NavLink to="/how-to-use" className="nav-link" style={style}>
                  How To Use
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/about" className="nav-link" style={style}>
                  About us
                </NavLink>
              </li>
              {!isLoggedIn ? (
                <>
                  <li className="nav-item">
                    <NavLink to="/contact" className="nav-link" style={style}>
                      Contact us
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <button
                      className="btn bt-bgcolor bt-text-color ps-4 pe-4"
                      onClick={login}
                    >
                      Login
                    </button>
                  </li>
                  {
                    <LoginSignupModal
                      onLoginChange={handleLoginSuccess}
                      page_open={pageopen}
                    />
                  }
                </>
              ) : (
                <>
                  <li className="nav-item d-flex align-items-center ps-3">
                    <div
                      className=""
                      style={{ cursor: "pointer" }}
                      onClick={toggleMenu}
                    >
                      <i className="fs-3 bi bi-person-circle text-warning"></i>
                    </div>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
        {isMenuVisible && (
          <MenuComponent
            isVisible={isMenuVisible}
            toggleMenu={toggleMenu}
            cartCount={cartCount}
            wishlistCount={wishlistCount}
            setCartCount={setCartCount}
            setWishlistCount={setWishlistCount}
          />
        )}
      </nav>
    </div>
  );
};

export default Header;
