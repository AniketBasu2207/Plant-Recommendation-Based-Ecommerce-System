import React from "react";

const RecomendPlantCardComponent = ({ plant, onClick }) => {
  return (
    <div onClick={onClick} style={{ cursor: "pointer" }} className="m-2">
      <div
        className="card p-0 body-bg-color orange-border-color"
        style={{ width: "11rem" }}
      >
        <div className="d-flex justify-content-center mt-3">
          <img
            src={plant.image} // ✅ dynamically use plant image
            alt={plant.plant} // ✅ add alt for accessibility
            className="rounded-circle img-fluid img-thumbnail body-bg-color border border-0"
            style={{ width: "8rem", height: "8rem", objectFit: "cover" }}
          />
        </div>
        <p className="text-center fw-bold m-0 fs-5">{plant.plant}</p>{" "}
        <div className="p-2">
          <div
            className="progress mb-3"
            role="progressbar"
            aria-label="Animated striped example"
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <div
              className="progress-bar body-dark-bg-color progress-bar-striped progress-bar-animated fw-bold"
              style={{ width: `${Math.round(plant.match_score)}%` }}
            >
              {Math.round(plant.match_score)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecomendPlantCardComponent;
