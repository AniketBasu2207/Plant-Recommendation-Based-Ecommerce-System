import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const MenuComponent = ({ isVisible, toggleMenu, cartCount, wishlistCount }) => {
  const logout = async () => {
    try {
      // Clear all data from localStorage
      localStorage.removeItem("isLoggedIn");
      const response = await api.get("/logout");
      console.log(response);
    } catch (err) {
      console.log(err);
    }
    // Redirect to homepage
    window.location.href = "/";
  };

  return (
    <div className={`body-bg-color menu ${isVisible ? "show" : "hide"}`}>
      <div className="menu-item border-bottom" onClick={toggleMenu}>
        <Link to="/profile" className="nav-link fw-bold body-text-color">
          <i className="bi bi-person-lines-fill fw-bold pe-3"></i>Profile
        </Link>
      </div>
      <div className="menu-item border-bottom" onClick={toggleMenu}>
        <Link to="/plantgallery" className="nav-link fw-bold body-text-color">
          <i className="bi bi-shop fw-bold pe-3"></i>Plant Gallery
        </Link>
      </div>
      <div className="menu-item border-bottom" onClick={toggleMenu}>
        <Link to="/viewcart" className="nav-link fw-bold body-text-color">
          <i className="bi bi-cart4 fw-bold pe-3"></i>Viewcart
        </Link>
        <span className="badge body-dark-bg-color">{cartCount}</span>
      </div>
      <div className="menu-item border-bottom" onClick={toggleMenu}>
        <Link to="/orders" className="nav-link fw-bold body-text-color">
          <i className="bi bi-box-seam-fill  fw-bold pe-3"></i>Orders
        </Link>
      </div>
      <div className="menu-item border-bottom" onClick={toggleMenu}>
        <Link to="/wishlist" className="nav-link fw-bold body-text-color">
          <i className="bi bi-bag-heart-fill fw-bold pe-3"></i>Wishlist
        </Link>
        <span className="badge body-dark-bg-color">{wishlistCount}</span>{" "}
        {/* Badge for Wishlist count */}
      </div>
      <div className="menu-item border-bottom" onClick={toggleMenu}>
        <Link to="/contact" className="nav-link fw-bold body-text-color">
          <i className="bi bi-headset fw-bold pe-3"></i>Contact Us
        </Link>
      </div>
      <div className="menu-item" onClick={toggleMenu}>
        <button
          className="btn bg-orange text-light fw-bold w-100"
          onClick={logout}
        >
          Logout<i className="bi bi-box-arrow-right fw-bold ps-3"></i>
        </button>
      </div>
    </div>
  );
};

export default MenuComponent;
