import React, { useEffect, useRef } from "react";
import {
  BsCheckCircle,
  BsGear,
  BsBoxSeam,
  BsTruck,
  BsHouseCheck,
  BsXCircle,
  BsClipboardCheck,
} from "react-icons/bs";
import "./OrderTracker.css";

const OrderTracker = ({ currentPhase }) => {
  const progressRef = useRef(null);
  const steps = [
    { id: "accepted", label: "Accepted", icon: <BsCheckCircle /> },
    { id: "under processing", label: "Processing", icon: <BsGear /> },
    { id: "packaging", label: "Packaging", icon: <BsBoxSeam /> },
    { id: "shipped", label: "Shipped", icon: <BsTruck /> },
    { id: "out of delivery", label: "Out for Delivery", icon: <BsClipboardCheck /> },
    { id: "delivered", label: "Delivered", icon: <BsHouseCheck /> },
    { id: "cancelled", label: "Cancelled", icon: <BsXCircle /> },
  ];

  const currentIndex = currentPhase
    ? steps.findIndex((step) => step.id === currentPhase.toLowerCase())
    : -1;

  useEffect(() => {
    if (progressRef.current && currentIndex >= 0) {
      const progressPercentage = (currentIndex / (steps.length - 1)) * 100;
      progressRef.current.style.width = `${progressPercentage + 10}%`;
    }
  }, [currentIndex, steps.length]);

  return (
    <div className="order-tracker body-bg-color">
      <div className="tracker-container">
        <div className="progress-line">
          {currentPhase != "cancelled" ? (
            <div className="progress-filled" ref={progressRef}></div>
          ) : (
            <div className="progress-filled-danger" ref={progressRef}></div>
          )}
        </div>

        {currentPhase != "cancelled" ? (
          <>
            {steps
              .filter((step) => step.id !== "cancelled") // Exclude 'cancelled' step early
              .map((step, index) => {
                const isCompleted = index < currentIndex;
                const isActive = index === currentIndex;

                return (
                  <div className="tracker-step" key={step.id}>
                    <div
                      className={`step-icon ${isCompleted ? "completed" : ""} ${
                        isActive ? "active" : ""
                      }`}
                    >
                      {step.icon}
                    </div>
                    <div className="step-label">{step.label}</div>
                  </div>
                );
              })}
          </>
        ) : (
          <>
            {steps.map((step, index) => {
              const isCompleted = index < currentIndex;
              const isActive = index === currentIndex;

              return (
                <div className="tracker-step" key={step.id}>
                  <div
                    className={`step-icon ${isCompleted ? "fail" : ""} ${
                      isActive ? "fail" : ""
                    }`}
                  >
                    {step.icon}
                  </div>

                  <div className="step-label">{step.label}</div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default OrderTracker;
