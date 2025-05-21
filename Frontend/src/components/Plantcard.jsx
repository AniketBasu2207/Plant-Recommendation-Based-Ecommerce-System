import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const PlantCard = ({ plant }) => {
  const [hovered, setHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  const handleCheckAvailability = () => {
    navigate(`/plantchecker/${plant._id}`);
  };

  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => setHovered(false);

  // Calculate discounted price if discount exists
  const discountedPrice =
    plant.discount > 0
      ? plant.price - (plant.price * plant.discount) / 100
      : null;

  return (
    <div
      className="card plant-card p-0 border border-0"
      style={{
        width: "16rem",
        backgroundColor: "#eaf4e8",
        boxShadow: hovered
          ? "rgba(0, 0, 0, 0.2) 0px 8px 16px"
          : "rgba(0, 0, 0, 0) 0px 4px 8px",
        margin: "3px",
        transition: "box-shadow 0.3s ease",
        cursor: "pointer",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCheckAvailability}
    >
      <div
        className="card-img-top"
        style={{ width: "100%", height: "250px", objectFit: "cover" }}
      >
        <img
          src={imageError ? "/placeholder-plant.jpg" : plant.image}
          className="card-img-top h-100 w-100"
          style={{ objectFit: "cover" }}
          alt={plant.name}
          onError={() => setImageError(true)}
          loading="lazy"
        />

        {hovered && (
          <div
            className="icon-overlay"
            style={{ backgroundColor: "rgb(255, 255, 255)" }}
          >
            <i className="bi bi-search"></i>
          </div>
        )}
      </div>

      <div className="card-body text-center">
        <h5 className="card-title fw-bold">{plant.name}</h5>
        <div className="price-container mt-3">
          <span className="original-price fs-5">
            <i className="bi bi-currency-rupee"></i>
            {plant.price.toFixed(2)}
          </span>

          {discountedPrice && (
            <span className="discounted-price text-danger ms-2 fs-5">
              <i className="bi bi-currency-rupee"></i>
              {discountedPrice.toFixed(2)}
            </span>
          )}
        </div>

        {plant.category && (
          <div className="mt-2">
            <span className="badge bg-success">{plant.category}</span>
          </div>
        )}
      </div>
    </div>
  );
};

PlantCard.propTypes = {
  plant: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    discount: PropTypes.number,
    image: PropTypes.string.isRequired,
    category: PropTypes.string,
  }).isRequired,
};

export default PlantCard;
