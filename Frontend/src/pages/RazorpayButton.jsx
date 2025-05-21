import React, { useState } from "react";
import axios from "axios";
import OrderAddressModal from "./OrderAddressModal";
import { useNavigate } from "react-router-dom";
import Success_Alert from "./Success_Alert";
// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const RazorpayButton = ({
  plants,
  calculate_price,
  cartCount,
  setCartCount,
}) => {
  const navigate = useNavigate();
  const Total_amount = calculate_price.grand_total;

  const order_details = {
    plant_lists: plants.map((plant) => ({
      plant: plant._id, // Use the _id as plant reference
      quantity: plant.quantity,
    })),
    total_price: calculate_price.grand_total,
    discount: calculate_price.discount,
  };

  console.log(order_details);
  const [userAddress, SetuserAddress] = useState({});

  const handlePayment = async (userAddress) => {
    const loadScript = (src) => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!res) {
      Success_Alert("Razorpay SDK failed to load. Are you online?", true);
      return;
    }

    // ✅ Step 1: Fetch fresh order_id from backend
    try {
      const response = await api.post("/api/payment", {
        amount: Total_amount,
      });
      console.log(response.data);
      const { order_id } = await response.data;
      console.log(response);

      // ✅ Step 2: Use order_id in Razorpay options
      const options = {
        key: "rzp_test_xvocWkZYSKWbhF", //rzp_test_xvocWkZYSKWbhF
        amount: 50000,
        currency: "INR",
        name: "Florus",
        description: "Florus is Plant Recommendation System",
        image: "/logo.png",
        order_id, // dynamically from backend
        callback_url: "https://eneqd3r9zrjok.x.pipedream.net/",
        prefill: {
          name: response.data.name,
          email: response.data.email,
        },
        theme: {
          color: "#3399cc",
        },
        handler: async function (response) {
          try {
            const save_order = await api.post("/api/order", {
              order_details: order_details,
              userAddress,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });
            // set sweet alert
            // save_order . data . message or response true/false setup accordingly
            if (save_order.data.response) {
              setCartCount(0);
              localStorage.setItem("cartCount", 0);
              Success_Alert(save_order.data.message, false, true);
              navigate(`/orders`);
            } else {
              Success_Alert(save_order.data.message, true);
            }
            console.log(save_order);
            console.log(response);
          } catch (error) {
            console.log(error);
          }
        },
        modal: {
          ondismiss: () => {
            Success_Alert("Transaction was cancelled.", true);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment API Error:", err.response?.data || err.message);
      console.log(err);
    }
  };

  const [showAddressModal, setShowAddressModal] = useState(false);
  // Function to fetch basic info from API
  const fetchBasicInfo = async () => {
    const response = await api.get("/api/order/userAddress");
    console.log(response);
    return response.data.message;
  };

  // Function to save order address
  const saveOrderAddress = async (addressData) => {
    // Replace with your actual API call
    // console.log(addressData);
    //SetuserAddress(addressData); // Update state, but don't expect it to update instantly.

    // Directly use addressData here if you need it immediately
    console.log("Address you just received:", addressData);
    // console.log('Address saved successfully',userAddress);

    await handlePayment(addressData);
    // You might want to update some state here
    console.log("Address saved successfully");
  };

  return (
    <>
      <button
        onClick={() => setShowAddressModal(true)}
        className="btn bg-orange w-100 body-light-text-color"
      >
        Place Order
      </button>

      <OrderAddressModal
        show={showAddressModal}
        handleClose={() => setShowAddressModal(false)}
        fetchBasicInfo={fetchBasicInfo}
        saveOrderAddress={saveOrderAddress}
      />
    </>
  );
};

export default RazorpayButton;
