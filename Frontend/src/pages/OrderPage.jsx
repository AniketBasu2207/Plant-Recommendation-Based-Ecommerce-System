import React, { useEffect, useState } from "react";
// utils/formatTime.js
import { formatDistanceToNow, differenceInHours } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import Swal from "sweetalert2";
import axios from "axios";
import ViewOrderModal from "./viewOrderModel";
import OrderAddressModal from "./OrderAddressModal";
import OrderTracker from "./OrderTracker";

import Success_Alert from "./Success_Alert";

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const OrderSummary = () => {
  const [orders, setOrders] = useState([]);
  // const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const fetchOrders = async () => {
    try {
      const response = await api.get("/api/order");
      const orders = response.data;
      if (orders.response) {
        setOrders(orders.order);
      } else {
        console.log("something went wrong.");
      }
    } catch (error) {
      console.error("Error fetching orders data:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // const handleSearch = (e) => {
  //   const term = e.target.value.toLowerCase();
  //   setSearchTerm(term);
  //   setFilteredOrders(
  //     orders.filter((order) => order.plant_name.toLowerCase().includes(term))
  //   );
  // };

  // const openRatingModal = (order) => {
  //   setSelectedOrder(order);
  //   setShowModal(true);
  // };

  const submitRating = () => {
    console.log(`Rated ${rating} stars for:`, selectedOrder);
    console.log("Feedback:", feedback);
    setShowModal(false);
    setRating(5);
    setFeedback("");
  };

  const handleStarClick = (star) => {
    setRating(star);
  };

  const formatTimeAgo = (isoString) => {
    // Convert UTC to Indian time (IST)
    const indianTime = toZonedTime(isoString, "Asia/Kolkata");
    return formatDistanceToNow(indianTime, { addSuffix: true });
  };

  const is24HoursPassed = (isoString) => {
    const indianTime = toZonedTime(isoString, "Asia/Kolkata");
    const hoursDifference = differenceInHours(new Date(), indianTime);
    return hoursDifference >= 24;
  };

  // Cancel Order
  const cancelOrder = async (orderId) => {
    const result = await Swal.fire({
      title: "You want to cancel this order?",
      text: "You have 24 hours to reorder the items; otherwise, you will not be able to do so.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, cancel it!",
    });
    if (result.isConfirmed) {
      try {
        const response = await axios.post(`/api/order/cancel/${orderId}`);
        const updatedOrder = response.data.order;

        // 🔁 Update the specific order in the list
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === updatedOrder._id
              ? { ...order, status: updatedOrder.status }
              : order
          )
        );
      } catch (err) {
        console.error("Cancel failed:", err.response?.data || err.message);
        Success_Alert("Failed to cancel the order.", true);
      }
    }
  };

  // Re-Order
  const reOrder = async (orderId) => {
    const result = await Swal.fire({
      title: "Do you want to reorder this item?",
      text: "",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, i do!",
    });
    if (result.isConfirmed) {
      try {
        const response = await axios.post(`/api/order/reorder/${orderId}`);
        const newOrder = response.data.order;

        await fetchOrders(); // ✅ manually trigger refresh
        Success_Alert("Order re-placed successfully.");
      } catch (err) {
        console.error("Reorder failed:", err.response?.data || err.message);
        Success_Alert("Failed to Re-order.", true);
      }
    }
  };

  const [showViewOrderModal, setshowViewOrderModal] = useState(false);
  const [selectedViewOrder, setselectedViewOrder] = useState(null);

  const viewOrder = (index) => {
    setselectedViewOrder(orders[index]);
    setshowViewOrderModal(true);
    // console.log(orders[index]);
  };

  const [click_index, setClick_index] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);

  // Function to fetch basic info from API
  const changeOrder = (index) => {
    setClick_index(index);
    setShowAddressModal(true);
  };

  const fetchBasicInfo = () => orders[click_index].userAddress;

  // Function to save order address
  const saveOrderAddress = async (addressData) => {
    const response = await api.post(`/api/order/changeAddress`, {
      order_id: orders[click_index]._id,
      userAddress: addressData,
    });
    if (response.data.response) {
      await fetchOrders(); // ✅ manually trigger refresh
      Success_Alert(response.data.message);
    } else {
      Success_Alert(response.data.message, true);
    }
  };

  return (
    <div className="container pt-4 p-4 body-bg-color">
      {/* Order Details */}
      {orders.map((order, orderIndex) => (
        <div className="my-4 mx-auto my-border" key={orderIndex}>
          <div className="border rounded p-3">
            {/* Status */}
            <div className="mb-3">
              <p className="body-text-color fw-bold text-end">
                Order placed: {formatTimeAgo(order.createdAt)}
              </p>
            </div>
            <hr />

            {/* Main Row */}
            <div className="row">
              {/* Left Side: Images + Texts */}
              <div className="col-md-8">
                {order.order_details.plant_lists.map((plant, plantIndex) => (
                  <div
                    className="d-flex align-items-center mb-3"
                    key={plantIndex}
                  >
                    <img
                      src={plant.plant.image}
                      alt="Plant"
                      className="rounded-circle me-3"
                      width="50"
                      height="50"
                    />
                    <div>
                      <p className="mb-1 fw-bold fs-5 body-text-color">
                        Plant Name: {plant.plant.name}
                      </p>
                      <p className="mb-0 text-muted body-text-color">
                        Price: ₹{plant.plant.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Side: Buttons */}
              <div className="col-md-4 d-flex flex-column justify-content-start">
                <button
                  className="btn body-dark-bg-color fw-bold text-light mb-2 w-75 mx-auto"
                  onClick={() => viewOrder(orderIndex)}
                >
                  View Order
                </button>
                {["Accepted", "Under Processing"].includes(order.status) ? (
                  <>
                    <button
                      className="btn bt-bgcolor fw-bold text-light mb-2 w-75 mx-auto"
                      onClick={() => changeOrder(orderIndex)}
                    >
                      Change Address
                    </button>

                    <button
                      className="btn border border-danger fw-bold text-danger mb-2 w-75 mx-auto"
                      onClick={() => cancelOrder(order._id)}
                    >
                      Cancel Order
                    </button>
                  </>
                ) : null}

                {order.status == "Cancelled" ? (
                  !is24HoursPassed(order.createdAt) ? (
                    <button
                      className="btn border border-danger fw-bold text-danger mb-2 w-75 mx-auto"
                      onClick={() => reOrder(order._id)}
                    >
                      Order Again
                    </button>
                  ) : null
                ) : null}

                <ViewOrderModal
                  show={showViewOrderModal}
                  onHide={() => setshowViewOrderModal(false)}
                  order={selectedViewOrder}
                />

                <OrderAddressModal
                  show={showAddressModal}
                  handleClose={() => setShowAddressModal(false)}
                  fetchBasicInfo={fetchBasicInfo}
                  saveOrderAddress={saveOrderAddress}
                />

                {/* <button className="btn btn-primary mb-2">Rate Product</button> */}
              </div>
            </div>
          </div>
          <OrderTracker currentPhase={order.status.toLowerCase()} />
        </div>
      ))}

      {/* Rating Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              {/* Rate & Review */}
              <div className="modal-header">
                <h5 className="modal-title">
                  Rate & Review {selectedOrder?.title}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              {/* Rate Product */}
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Rate Product</label>
                  <div>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i
                        key={star}
                        className={`bi ${
                          star <= rating
                            ? "bi-star-fill text-warning"
                            : "bi-star text-secondary"
                        } ps-2 fw-bold`}
                        style={{ cursor: "pointer" }}
                        onClick={() => handleStarClick(star)}
                      ></i>
                    ))}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Feedback</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  ></textarea>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={submitRating}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
