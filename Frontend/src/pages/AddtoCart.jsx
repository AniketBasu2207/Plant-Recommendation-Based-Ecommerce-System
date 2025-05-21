import React, { useEffect, useState } from "react";
import RazorpayButton from "./RazorpayButton";
import axios from "axios";
import Success_Alert from "./Success_Alert";
import Swal from "sweetalert2";

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const AddtoCart = ({
  cartCount,
  wishlistCount,
  setCartCount,
  setWishlistCount,
}) => {
  const [plants, setPlants] = useState([]);
  const [reload, setReload] = useState(true);
  const [calculate_price, setCalculate_price] = useState({
    total: 0,
    discount: 0,
    grand_total: 0,
  });

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await api.get("/api/cart");

        if (response.status == 200) {
          const plant_data = response.data.cart.plantList;
          const new_plant_data = plant_data.map((plant) => ({
            ...plant,
            quantity: 1,
            new_price: plant.price,
          }));
          setCartCount(plant_data.length);
          localStorage.setItem("cartCount", plant_data.length);
          console.log(new_plant_data);
          setPlants(new_plant_data);
        } else {
          console.log("something went wrong");
        }
        setReload(false);
      } catch (err) {
        console.log(err);
        setPlants([]);
        setCartCount(0);
        localStorage.setItem("cartCount", 0);
        setReload(false);
      }
    };

    fetchPlants();
  }, [reload]);

  useEffect(() => {
    const price_calculation = () => {
      let total = 0;
      let discount = 0;

      plants.forEach((plant) => {
        const plantTotal = plant.price * plant.quantity;
        const plantDiscount = (plant.discount / 100) * plantTotal;

        total += plantTotal;
        discount += plantDiscount;
      });

      const grand_total = total - discount + 5;

      setCalculate_price({
        total,
        discount,
        grand_total,
      });
      // console.log(plants);
    };

    price_calculation();
  }, [plants]);

  const handle_decrement = (id) => {
    setPlants((prev_plants) =>
      prev_plants.map((plant) =>
        plant._id == id
          ? {
              ...plant,
              quantity: plant.quantity - 1,
              new_price: (plant.quantity - 1) * plant.price,
            }
          : plant
      )
    );
  };

  const handle_increment = (id) => {
    setPlants((prev_plants) =>
      prev_plants.map((plant) =>
        plant._id === id
          ? {
              ...plant,
              quantity: plant.quantity + 1,
              new_price: (plant.quantity + 1) * plant.price,
            }
          : plant
      )
    );
  };

  const removeFromCart = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to remove this plant from your Cart?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      try {
        const response = await api.get(`/api/cart/${id}`);
        console.log(response);

        if (response.status == 200) {
          setReload(true);
        } else {
          console.log("something went wrong");
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const add_to_wishlist = async (id) => {
    try {
      const response = await api.post("/api/wishlist", {
        plant_id: id,
      });
      console.log(response);

      if (response.status == 200) {
        Success_Alert("plant added to cart");
        setWishlistCount(response.data.wishlist.plantList.length);
        localStorage.setItem(
          "wishlistCount",
          response.data.wishlist.plantList.length
        );
      } else {
        //  hjh
        Success_Alert(response.data.message, true);
      }
    } catch (error) {
      console.log(error);
      Success_Alert(error.response.data.message, true);
    }
  };

  return (
    <div className="container pt-4 body-bg-color">
      <div className="row">
        {/* Cart Items Section */}
        <div className="col-md-8">
          {plants.map((plant) => (
            <div
              key={plant._id}
              className="card mb-3 body-bg-color"
              style={{ border: "1px solid #2b3c2c" }}
            >
              <div className="card-body d-flex">
                <img
                  src={plant.image}
                  alt={plant.name}
                  className="img-fluid"
                  style={{
                    maxWidth: "150px",
                    maxHeight: "150px",
                    borderRadius: "50%",
                    marginRight: "20px",
                  }}
                />
                <div className="flex-grow-1">
                  <h5 className="body-text-color fw-bold fs-4">{plant.name}</h5>
                  <p className="body-text-color fw-bold">
                    Price: ₹{plant.price}
                  </p>
                  <div className="d-flex align-items-center">
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => handle_decrement(plant._id)}
                      disabled={plant.quantity == 1}
                    >
                      -
                    </button>
                    <span className="mx-2 fw-bold">{plant.quantity}</span>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => handle_increment(plant._id)}
                    >
                      +
                    </button>
                  </div>
                  <div className="d-flex justify-content-end align-items-center mt-4">
                    <button
                      className="btn btn-orange me-3 text-light fw-bold"
                      onClick={() => removeFromCart(plant._id)}
                    >
                      <i className="bi bi-trash3-fill fs-5 "></i> Remove
                    </button>
                    <button
                      className="btn btn-dark-green text-light fw-bold"
                      onClick={() => add_to_wishlist(plant._id)}
                    >
                      <i className="bi bi-bag-heart-fill fs-5"></i> Add Wishlist
                    </button>
                  </div>
                </div>
                <p className="text-end fw-bold fs-4 fs-md-6 orange-text-color">
                  ₹{plant.new_price}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Section */}
        {plants.length > 0 ? (
          <div className="col-md-4 mb-4">
            <div
              className="card body-bg-color"
              style={{ border: "1px solid #2b3c2c" }}
            >
              <div className="card-header body-dark-bg-color text-light">
                Price Details
              </div>
              <div className="card-body">
                <p className="d-flex justify-content-between">
                  <span>Price ({plants.length} items)</span>
                  <span>₹{calculate_price.total}</span>
                </p>
                <p className="d-flex justify-content-between">
                  <span>Discount</span>
                  <span> ₹{calculate_price.discount.toFixed(2)}</span>
                </p>
                <p className="d-flex justify-content-between">
                  <span>Platform Fee</span>
                  <span>₹5</span>
                </p>
                <p className="d-flex justify-content-between">
                  <span>Delivery Charges</span>
                  <span>Free</span>
                </p>
                <hr />
                <h5 className="d-flex justify-content-between">
                  <span>Total Amount</span>
                  <span>₹{calculate_price.grand_total.toFixed(2)}</span>
                </h5>
                <p className="text-bg-success fw-bold badge">
                  You will save ₹{calculate_price.discount.toFixed(2)} on this
                  order
                </p>
                {/* <button className="btn btn-warning w-100">Place Order</button> */}
                <RazorpayButton
                  plants={plants}
                  calculate_price={calculate_price}
                  cartCount={cartCount}
                  setCartCount={setCartCount}
                />
              </div>
            </div>
          </div>
        ) : (
          <img
            src="../empty-cart.png"
            alt=""
            style={{ width: "500px", margin: "0 auto" }}
          />
        )}
      </div>
    </div>
  );
};

export default AddtoCart;
