import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const steps = [
  {
    label: "Sign Up or Log In to Your Account",
    description: `
            <strong>Action:</strong> Click on the <b>Login/Signup</b> button on the navbar. Create a new account or log in with your existing one. <br/>
            <strong>Outcome:</strong> This allows you to check recommdended plants based on your pincode.
        `,
  },
  {
    label: 'Begin by Clicking "Click Here"',
    description: `
            <strong>Action:</strong> On the Homepage, click the <b>Click Here</b> button in the Hero Section.<br/>
            <strong>Outcome:</strong> This takes you to the <b>Plant Gallery</b> page, where you can explore various plants displayed with images, names and it's price.
        `,
  },
  {
    label: "Select a Plant",
    description: `
            <strong>Action:</strong> In the Plant Gallery, either use the search bar to find a specific plant or scroll to select one.<br/>
            <strong>Outcome:</strong> This opens a detailed page with plant information including Plant name. Plant price and other names of that plant.
        `,
  },
  {
    label: "Enter Zip Code to Check Availability",
    description: `
            <strong>Action:</strong> On the plant details page, enter your <b>Zip Code</b> in the input field. <br/>
            <strong>Outcome:</strong> The ML model analyzes your local conditions (rainfall, UV index, soil type, etc.) and tells you whether this plant will grow well in your area.
        `,
  },
  {
    label: "Add Suitable Plant to Cart or Wishlist",
    description: `
            <strong>Action:</strong> If the plant is recommended for your area, click <b>Add to Cart</b> to buy now or <b>Add to Wishlist</b> to save it for later. <br/>
            <strong>Outcome:</strong> Your selections are stored securely, and you can manage them from your <b>Cart</b> or <b>Wishlist</b> pages.
        `,
  },
  {
    label: "Proceed to Checkout",
    description: `
            <strong>Action:</strong> Go to the <b>Cart</b> page and click <b>Proceed to Checkout</b>. Fill in your shipping address and payment information. <br/>
            <strong>Outcome:</strong> The order is placed, and you will receive confirmation. Your order can be viewed from the <b>Orders</b> page.
        `,
  },
  {
    label: "Track Your Orders and Recommendations",
    description: `
            <strong>Action:</strong> Navigate to the <b>Order</b> page to check the status of your placed orders. <br/>
            <strong>Outcome:</strong> View order history, get delivery updates, and continue browsing personalized plant suggestions.
        `,
  },
];

export default function VerticalStepper1() {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleReset = () => setActiveStep(0);

  return (
    <div className="container pt-5 pb-5 body-bg-color">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <h3 className="text-center mb-4 body-heading-color">How To Use ?</h3>
          <hr className="mb-5" />

          <div className="stepper">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`step p-3 mb-4 ${
                  index <= activeStep ? "body-bg-color" : ""
                }`}
              >
                {/* Step Header */}
                <div className="step-header d-flex align-items-center mb-2">
                  <div
                    className={`circle me-3 ${
                      index === activeStep
                        ? "body-dark-bg-color text-white"
                        : "bg-light text-dark"
                    }`}
                  >
                    {index < activeStep ? "✔" : index + 1}
                  </div>
                  <h5 className="mb-0 body-text-color fw-bold">{step.label}</h5>
                </div>

                {index === activeStep ? (
                  <>
                    {/* Step Description */}
                    <div
                      className="step-description mb-2 mt-4 p-4 body-text-color"
                      dangerouslySetInnerHTML={{ __html: step.description }}
                    />

                    {/* Optional Image */}
                    {step.image && (
                      <div className="step-image mb-2 mt-4 p-4">
                        <img
                          src={step.image}
                          alt={`Step ${index + 1}`}
                          className="img-fluid"
                        />
                      </div>
                    )}
                  </>
                ) : null}

                {/* Navigation Buttons */}
                {index === activeStep && (
                  <div className="step-navigation d-flex justify-content-between">
                    <button
                      className="btn fs-3 fw-bold border border-0"
                      onClick={handleBack}
                      disabled={index === 0}
                    >
                      <i className="bi bi-arrow-left ps-3 pe-3"></i>
                    </button>
                    <button className="btn fs-3 fw-bold" onClick={handleNext}>
                      {index === steps.length - 1 ? (
                        <i className="bi bi-arrow-right ps-3 pe-3 text-danger"></i>
                      ) : (
                        <i className="bi bi-arrow-right ps-3 pe-3 text-success"></i>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))}

            {activeStep === steps.length && (
              <div className="card mt-3">
                <div className="card-body text-center body-dark-bg-color text-light">
                  <h5>All steps completed - you're finished</h5>
                  <button
                    className="btn btn-warning mt-2 fs-5 fw-bold ps-5 pe-5"
                    onClick={handleReset}
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
