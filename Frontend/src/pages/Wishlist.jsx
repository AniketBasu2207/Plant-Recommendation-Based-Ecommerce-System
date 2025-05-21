import React, { useEffect, useState } from "react";
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

const Wishlist = ({
  cartCount,
  wishlistCount,
  setCartCount,
  setWishlistCount,
}) => {
  const [final_wishlist, setFinalWishlist] = useState([]);
  const [final_wishlist_length, setfinal_wishlist_length] = useState(0);
  const [reload, setReload] = useState(true);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await api.get("/api/wishlist");
        console.log(response);

        if (response.status == 200) {
          const plant_data = response.data.wishlist.plantList;
          setFinalWishlist(plant_data);
          setfinal_wishlist_length(plant_data.length);
          setWishlistCount(plant_data.length);
          localStorage.setItem("wishlistCount", plant_data.length);
        } else {
          console.log("something went wrong");
        }
        setReload(false);
      } catch (err) {
        console.log(err);
        setfinal_wishlist_length(0);
        setWishlistCount(0);
        localStorage.setItem("wishlistCount", 0);
      }
    };

    fetchPlants();
  }, [reload]);

  const remove_from_wishlist = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to remove this plant from your wishlist?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      try {
        const response = await api.get(`/api/wishlist/${id}`);
        console.log(response);

        if (response.status == 200) {
          setReload(true);
          setfinal_wishlist_length(final_wishlist.length);
        } else {
          console.log("something went wrong");
          setReload(true);
        }
      } catch (error) {
        const show_noti = error.response.data.message;
        Success_Alert(show_noti, true);
      }
    }
  };

  const add_to_cart = async (id) => {
    try {
      const response = await api.post("/api/cart", {
        plant_id: id,
      });
      console.log(response);

      if (response.status == 200) {
        Success_Alert("plant added");
        // store user_id into session
        setCartCount(response.data.cart.plantList.length);
        localStorage.setItem("cartCount", response.data.cart.plantList.length);
      } else {
        //  hjh
      }
    } catch (error) {
      const show_noti = error.response.data.message;
      Success_Alert(show_noti, true);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-center align-items-center p-3 flex-wrap body-bg-color">
        {final_wishlist_length > 0 ? (
          final_wishlist.map((obj) => (
            <div
              className="card m-3 body-bg-color"
              key={obj._id}
              style={{ width: "30rem", border: "1px solid #2b3c2c" }}
            >
              <h5 className="card-header body-dark-bg-color text-light">
                Wishlist
              </h5>
              <div className="card-body">
                <div className="card-container">
                  <div className="image-container">
                    <img src={obj.image} alt={obj.name} />
                  </div>

                  <div className="text-container">
                    <h5 className="card-title body-text-color fw-bold fs-4">
                      {obj.name}
                    </h5>
                    <div className="price-container mt-3">
                      <span className="original-price fs-5">
                        <i className="bi bi-currency-rupee"></i>
                        {obj.price.toFixed(2)}
                      </span>

                      <span className="discounted-price text-danger ms-2 fs-5">
                        <i className="bi bi-currency-rupee"></i>
                        {obj.price -
                          ((obj.price * obj.discount) / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 d-flex justify-content-center align-items-center">
                  <button
                    className="btn btn-light body-dark-bg-color  rounded-pill ps-5 pe-5"
                    onClick={() => add_to_cart(obj._id)}
                  >
                    <i className="bi bi-cart4 fs-5 text-light fw-bold"></i>
                  </button>
                  <button
                    className="btn bg-orange rounded-pill ps-5 pe-5  ms-3"
                    onClick={() => remove_from_wishlist(obj._id)}
                  >
                    <i className="fs-5 bi bi-bag-x-fill text-light fw-bold"></i>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <img
            src="../empty-wishlist.png"
            alt=""
            style={{ width: "500px", margin: "0 auto" }}
          />
        )}
      </div>
    </div>
  );
};

export default Wishlist;
