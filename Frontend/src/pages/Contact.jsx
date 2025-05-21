import React, { useState } from "react";
import contactimg from "../assets/contact_us.png";
import axios from "axios";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id.replace("contact_", "")]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await axios.post("/api/contact", formData);
      if (response.data.success) {
        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container body-bg-color">
      <div className="row">
        {/* 1st part */}
        <div className="col-md-6 d-flex justify-content-center">
          <img
            src={contactimg}
            style={{ width: "80%", height: "auto" }}
            alt=""
          />
        </div>
        {/* 2nd part */}
        <div className="col-md-6 d-flex justify-content-center flex-column p-5">
          {submitStatus === "success" && (
            <div className="alert alert-success">
              Thank you for your message! We'll get back to you soon.
            </div>
          )}
          {submitStatus === "error" && (
            <div className="alert alert-danger">
              There was an error submitting your form. Please try again.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label
                htmlFor="contact_name"
                className="form-label body-text-color fw-bold fs-6"
              >
                Your Name
              </label>
              <input
                type="text"
                className="form-control"
                id="contact_name"
                placeholder="E.g : Tom Holland"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="contact_email"
                className="form-label body-text-color fw-bold fs-6"
              >
                Email address
              </label>
              <input
                type="email"
                className="form-control"
                id="contact_email"
                placeholder="name@gmail.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="contact_subject"
                className="form-label body-text-color fw-bold fs-6"
              >
                Subject
              </label>
              <input
                type="text"
                className="form-control"
                id="contact_subject"
                placeholder="E.g : Subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="contact_message"
                className="form-label body-text-color fw-bold fs-6"
              >
                Your message
              </label>
              <textarea
                className="form-control"
                id="contact_message"
                rows="3"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <div className="mb-3">
              <button
                type="submit"
                className="form-control w-50 mx-auto bg-warning body-text-color fw-bold fs-5"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
