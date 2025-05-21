import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footer-bg-color text-light">
      {/* Social Media Links */}
      <div className="d-md-flex text-md-center justify-content-between align-items-center mb-3 p-4 footer-up-bg-color">
        <h5 className="body-text-color">
          Get connected with us on social networks:
        </h5>
        <ul className="nav justify-content-center">
          <li className="nav-item">
            <a href="#" className="nav-link body-text-color">
              <i className="bi bi-facebook"></i>
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link body-text-color">
              <i className="bi bi-twitter"></i>
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link body-text-color">
              <i className="bi bi-google"></i>
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link body-text-color">
              <i className="bi bi-instagram"></i>
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link body-text-color">
              <i className="bi bi-linkedin"></i>
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link body-text-color">
              <i className="bi bi-github"></i>
            </a>
          </li>
        </ul>
      </div>

      {/* Footer Links */}
      <div className="container text-center text-md-start p-4">
        <div className="row">
          {/* Company Info */}
          <div className="col-md-4 footer-text-color">
            <h5 className="footer-heading-color">F L O R U S</h5>
            <p>
              Florus is a smart plant recommendation-based e-commerce system
              that provides personalized gardening tips and plant suggestions
              based on your location. Grow smarter, live greener with Florus.
            </p>
          </div>

          {/* Useful Links Section */}
          <div className="col-md-4 text-center">
            <h5 className="footer-heading-color">USEFUL LINKS</h5>
            <ul className="list-unstyled footer-link-color">
              <li>
                <Link to="/profile" className="text-light">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/plantgallery" className="text-light">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="text-light">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link to="/viewcart" className="text-light">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="col-md-4 text-center">
            <h5 className="footer-heading-color">CONTACT</h5>
            <ul className="list-unstyled footer-text-color">
              <li>
                <i className="bi bi-geo-alt-fill me-2"></i>Konnagar, KOG 712235,
                INDIA
              </li>
              <li>
                <i className="bi bi-envelope-fill me-2"></i>info@florus.com
              </li>
              <li>
                <i className="bi bi-phone-fill me-2"></i>+033 2675 8827
              </li>
              <li>
                <i className="bi bi-printer-fill me-2"></i>+033 2759 3485
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center py-3 border-top mt-4">
        <span>© {new Date().getFullYear()} Copyright: Company, Inc</span>

      </div>
    </div>
  );
};

export default Footer;
