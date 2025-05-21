import React, { useEffect, useState } from "react";
import "./PlantSlider.css";
import { useNavigate } from "react-router-dom";

const PlantCarousel = () => {
  const [plants, setPlants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [centerIndex, setCenterIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/plant_details.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch plants data");
        }
        return response.json();
      })
      .then((data) => {
        setPlants(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false);
      });
  }, []);

  const handleNext = () => {
    setCenterIndex((prevIndex) => (prevIndex + 1) % plants.length);
  };

  const handlePrev = () => {
    setCenterIndex(
      (prevIndex) => (prevIndex - 1 + plants.length) % plants.length
    );
  };

  const getPlant = (offset) => {
    const index = (centerIndex + offset + plants.length) % plants.length;
    return plants[index];
  };

  const handlePlantClick = (id) => {
    navigate(`/plantchecker/${id}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div style={{ border: "2px solid #2b3c2c" }}></div>
      <div className="body-bg-color p-3">
        <h2 className="fw-bold text-center pt-3">Latest Products</h2>
      </div>
      <div className="carousel-container body-bg-color">
        <button className="carousel-btn prev" onClick={handlePrev}>
          <i className="bi bi-caret-left-fill body-text-color"></i>
        </button>
        <div className="carousel">
          {[getPlant(-1), getPlant(0), getPlant(1)].map((plant, i) =>
            plant ? (
              <div
                key={plant._id}
                className={`carousel-card ${i === 1 ? "center" : "blur"} ${
                  i === 0 ? "slide-left" : i === 2 ? "slide-right" : ""
                }`}
              >
                <img
                  src={plant.image}
                  alt={plant.name}
                  className="plant-img"
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                />
                {i === 1 && (
                  <>
                    <div
                      className="icon-overlay body-bg-color"
                      onMouseEnter={() => setHovered(true)}
                      onMouseLeave={() => setHovered(false)}
                      style={{ opacity: hovered ? "1" : "0" }}
                    >
                      <i
                        className="bi bi-search"
                        onClick={() => handlePlantClick(plant._id)}
                      >
                        <h5>{plant.name}</h5>
                      </i>
                    </div>
                  </>
                )}
              </div>
            ) : null
          )}
        </div>
        <button className="carousel-btn next" onClick={handleNext}>
          <i className="bi bi-caret-right-fill body-text-color"></i>
        </button>
      </div>
    </>
  );
};

export default PlantCarousel;
