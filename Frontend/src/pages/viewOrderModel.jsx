import React, { useState } from "react";
import { Modal, Button, Table } from "react-bootstrap";

const ViewOrderModal = ({ show, onHide, order }) => {
  if (!order) return null;

  const plantLists = order.order_details.plant_lists;
  const address = order.userAddress;

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton style={{ backgroundColor: "#eaf4e8" }}>
        <Modal.Title>Order Details</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: "#eaf4e8" }}>
        <div className="m-2 p-3 my-border">
          <h5 className="text-primary fw-bold fs-4">
            <i className="bi bi-list-check"></i> Plant Details
          </h5>
          <hr />
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Plant Name</th>
                <th>Quantity</th>
                <th>Price (₹)</th>
                <th>Discount</th>
                <th>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {plantLists.map((item, index) => {
                const plant = item.plant;
                const quantity = item.quantity;
                const amount = (plant.price - plant.discount) * quantity;

                return (
                  <tr key={index}>
                    <td>{plant.name}</td>
                    <td>{quantity}</td>
                    <td>{plant.price}</td>
                    <td>{plant.discount}</td>
                    <td>{amount}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
        <div className="d-flex">
          <div className="mt-4 p-3 my-border w-50 m-2">
            <h5 className="orange-text-color fw-bold fs-4">
              <i className="bi bi-truck"></i> Delivery Address
            </h5>
            <hr />
            <p>
              <strong>Name:</strong> {address.name}
            </p>
            <p>
              <strong>Phone:</strong> {address.phone}
            </p>
            <p>
              <strong>Email:</strong> {address.email}
            </p>
            <p>
              <strong>Pincode:</strong> {address.pincode}
            </p>
            <p>
              <strong>State & District:</strong> {address.state} ||{" "}
              {address.district}
            </p>
            <p>
              <strong>Address:</strong> {address.address}
            </p>
            <p>
              <strong>Secondary Address:</strong> {address.address2}
            </p>
          </div>
          <div className="mt-4 p-3 my-border w-50 m-2">
            <h5 className="text-danger fw-bold fs-4">
              <i className="bi bi-list-ul"></i> Order Summary
            </h5>
            <hr />

            <p>
              <strong>Order Id:</strong> {order.razorpay_order_id}
            </p>
            <p>
              <strong>Status:</strong> {order.status}
            </p>
            <p>
              <strong>Payment Mode:</strong> {order.payment_mode}
            </p>
            <p>
              <strong>Order Date:</strong>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Total Price:</strong> ₹{order.order_details.total_price}
            </p>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: "#eaf4e8" }}>
        <Button variant="danger" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewOrderModal;
