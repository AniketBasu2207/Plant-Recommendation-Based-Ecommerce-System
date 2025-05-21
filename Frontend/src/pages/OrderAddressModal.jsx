import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Spinner } from "react-bootstrap";
import axios from "axios";

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
const OrderAddressModal = ({
  show,
  handleClose,
  fetchBasicInfo, // Function to fetch basic info from API
  saveOrderAddress, // Function to save address via POST
}) => {
  const [sameAsBasic, setSameAsBasic] = useState(false);
  const [orderAddress, setOrderAddress] = useState({
    name: "",
    email: "",
    country: "",
    state: "",
    district: "",
    block: "",
    pincode: "",
    phone: "",
    address: "",
    address2: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!show) {
      setOrderAddress({
        name: "",
        email: "",
        country: "",
        state: "",
        district: "",
        block: "",
        pincode: "",
        phone: "",
        address: "",
        address2: "",
      });
      setSameAsBasic(false);
    }
  }, [show]);

  const [pincodeLookup, setPincodeLookup] = useState({
    district: "",
    block: "",
    state: "",
    country: "",
  });

  useEffect(() => {
    const lookupPincode = async () => {
      if (orderAddress.pincode && orderAddress.pincode.length === 6) {
        try {
          const response = await axios.get(
            `https://api.postalpincode.in/pincode/${orderAddress.pincode}`
          );
          if (response.data && response.data[0].Status === "Success") {
            const postOffice = response.data[0].PostOffice[0];
            setPincodeLookup({
              district: postOffice.District,
              block: postOffice.Block || postOffice.Name,
              state: postOffice.State,
              country: postOffice.Country,
            });

            // Auto-fill the basic info with pincode details
            setOrderAddress((prev) => ({
              ...prev,
              country: postOffice.Country,
              state: postOffice.State,
              district: postOffice.District,
              block: postOffice.Block || postOffice.Name,
              address: `${postOffice.Block},P.O: ${postOffice.Name}`,
            }));
          }
        } catch (error) {
          console.error("Error fetching pincode details:", error);
        }
      }
    };

    const timer = setTimeout(() => {
      lookupPincode();
    }, 500);

    return () => clearTimeout(timer);
  }, [orderAddress.pincode]);

  // Handle checkbox change
  const handleCheckboxChange = async (checked) => {
    setSameAsBasic(checked);
    if (checked) {
      setIsFetching(true);
      try {
        const basicInfo = await fetchBasicInfo();
        setOrderAddress((prev) => ({
          ...prev,
          ...basicInfo,
        }));
      } catch (error) {
        console.error("Error fetching basic info:", error);
      } finally {
        setIsFetching(false);
      }
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      //console.log(orderAddress);
      saveOrderAddress(orderAddress);
      handleClose();
    } catch (error) {
      console.error("Error saving address:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton style={{ backgroundColor: "#eaf4e8" }}>
        <Modal.Title>Order Address</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: "#eaf4e8" }}>
        <Form>
          <Form.Check
            type="checkbox"
            label="Same as Basic Information"
            checked={sameAsBasic}
            onChange={(e) => handleCheckboxChange(e.target.checked)}
            className="mb-3"
            disabled={isFetching}
          />
          {isFetching && (
            <div className="text-center mb-3">
              <Spinner animation="border" size="sm" />
            </div>
          )}

          <Row>
            <Col md={6} lg={4} className="mb-3">
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={orderAddress.name}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>

            <Col md={6} lg={4} className="mb-3">
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="text"
                  name="email"
                  value={orderAddress.email}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>

            <Col md={6} lg={4} className="mb-3">
              <Form.Group>
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={orderAddress.phone}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>

            <Col md={6} lg={4} className="mb-3">
              <Form.Group>
                <Form.Label>Zipcode</Form.Label>
                <Form.Control
                  type="text"
                  name="pincode"
                  value={orderAddress.pincode}
                  onChange={handleInputChange}
                  maxLength="6"
                />
              </Form.Group>
            </Col>

            <Col md={6} lg={4} className="mb-3">
              <Form.Group>
                <Form.Label>Country</Form.Label>
                <Form.Control
                  type="text"
                  name="country"
                  value={orderAddress.country}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>

            {/* Other fields in the same pattern */}
            <Col md={6} lg={4} className="mb-3">
              <Form.Group>
                <Form.Label>State</Form.Label>
                <Form.Control
                  type="text"
                  name="state"
                  value={orderAddress.state}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>

            <Col md={6} lg={4} className="mb-3">
              <Form.Group>
                <Form.Label>District</Form.Label>
                <Form.Control
                  type="text"
                  name="district"
                  value={orderAddress.district}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6} lg={4} className="mb-3">
              <Form.Group>
                <Form.Label>Block</Form.Label>
                <Form.Control
                  type="text"
                  name="block"
                  value={orderAddress.block}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  as="textarea"
                  name="address"
                  value={orderAddress.address}
                  onChange={handleInputChange}
                  rows={3}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Address 2 (Optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  name="address2"
                  value={orderAddress.address2}
                  onChange={handleInputChange}
                  rows={3}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: "#eaf4e8" }}>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Saving...
            </>
          ) : (
            "Save Address"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrderAddressModal;
