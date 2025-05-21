import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import RecomendPlantCardComponent from "../components/RecomendPlantCardComponent";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import LoadingSkeleton from "../components/LoadingSkeleton";
import Success_Alert from "./Success_Alert";

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const PlantChecking = ({
  cartCount,
  wishlistCount,
  setCartCount,
  setWishlistCount,
}) => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [plantData, setPlantData] = useState(null);
  const [recommendedPlants, setRecommendedPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zipcode, setZipcode] = useState("");
  // const [zipcode, setZipcode] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [showModal, setShowModal] = useState(false);

  const [verify, setVerify] = useState(false);
  const [show_recommendation_section, setShow_recommendation_section] =
    useState(false);
  const [show_error_section, setshow_error_section] = useState(false);
  const [Skeleton_loding, setSkeleton_loding] = useState(false);
  const [growing_chance, setgrowing_chance] = useState(0);
  const [user_info, setUser_info] = useState({
    min_temperature: 0,
    max_temperature: 0,
    avg_temperature: 0,
    avg_rainfall: 0,
    humidity: 0,
    sunlight: 0,
    zone: "",
    soil: "",
  });
  // const [cartItems, setCartItems] = useState(JSON.parse(localStorage.getItem('cartItems')) || []);
  // const [wishlistItems, setWishlistItems] = useState(JSON.parse(localStorage.getItem('wishlistItems')) || []);

  // Fetch plant data from MongoDB
  useEffect(() => {
    const fetchPlantData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/plants/${id}`);
        if (!response.ok) throw new Error("Failed to fetch plant data");
        const data = await response.json();
        setPlantData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlantData();
  }, [id]);

  // Cart and wishlist functions
  const addToCart = async () => {
    if (!isLoggedIn) {
      setShowModal(true);
      return;
    }

    try {
      const response = await api.post("/api/cart", {
        plant_id: plantData._id,
      });
      console.log(response);

      if (response.status == 200) {
        Success_Alert(response.data.message);
        // store user_id into session
        setCartCount(response.data.cart.plantList.length);
        localStorage.setItem("cartCount", response.data.cart.plantList.length);
      } else {
        //  hjh
        Success_Alert(response.data.message);
      }
    } catch (error) {
      const show_noti = error.response.data.message;
      Success_Alert(show_noti, true);
    }
  };

  const addToWishlist = async () => {
    if (!isLoggedIn) {
      setShowModal(true);
      return;
    }

    try {
      // setIsLoading(true);
      const response = await api.post("/api/wishlist", {
        plant_id: plantData._id,
      });
      console.log(response);

      if (response.status == 200) {
        Success_Alert(response.data.message);
        // store user_id into session
        setWishlistCount(response.data.wishlist.plantList.length);
        localStorage.setItem(
          "wishlistCount",
          response.data.wishlist.plantList.length
        );
      } else {
        //  hjh
        Success_Alert(response.data.message);
      }
    } catch (error) {
      const show_noti = error.response.data.message;
      Success_Alert(show_noti, true);
    }
  };

  const handleLoginSuccess = (status) => {
    setIsLoggedIn(status);
    setShowModal(false);
    localStorage.setItem("isLoggedIn", status.toString());
  };

  const LOCAL_KEY = "pincode_cache";

  const getPincodeCache = () => {
    const data = localStorage.getItem(LOCAL_KEY);
    return data ? JSON.parse(data) : {};
  };

  const setPincodeCache = (pincode, info) => {
    const currentCache = getPincodeCache();
    currentCache[pincode] = info;
    localStorage.setItem(LOCAL_KEY, JSON.stringify(currentCache));
  };

  const getAllData = async (zipcode) => {
    try {
      const cache = getPincodeCache();

      if (cache[zipcode]) {
        const cached = cache[zipcode];
        setUser_info({
          min_temperature: cached.mintemp_c,
          max_temperature: cached.maxtemp_c,
          avg_temperature: cached.avgtemp_c,
          avg_rainfall: cached.ANNUAL_RAINFALL,
          humidity: cached.avghumidity,
          sunlight: cached.UV_INDEX,
          zone: cached.ZONE,
          soil: cached.SOIL,
        });
        setVerify(true);
        plant_recommendations();
        return;
      }

      // 1. Get Latitude and Longitude
      const latLonRes = await axios.get(
        `https://app.zipcodebase.com/api/v1/search?apikey=5a449850-727c-11ef-b10c-a3c9ba76b792&codes=${zipcode}`
      );
      const { latitude, longitude } = latLonRes.data.results[zipcode][0];
      console.log(latitude, longitude);

      // 2. Get State and District
      const stateDistrictRes = await axios.get(
        `https://api.postalpincode.in/pincode/${zipcode}`
      );
      const { State, District } = stateDistrictRes.data[0].PostOffice[0];
      console.log(State, District);

      // 3. Get Weather Data
      const weatherRes = await axios.get(
        `http://api.weatherapi.com/v1/forecast.json?key=194d332f04aa406687e135252251304&q=${latitude},${longitude}&days=1&aqi=no&alerts=no`
      );
      const { maxtemp_c, mintemp_c, avgtemp_c, avghumidity } =
        weatherRes.data.forecast.forecastday[0].day;
      console.log(maxtemp_c, mintemp_c, avgtemp_c, avghumidity);

      // 4. Get Zone and Soil
      const zoneSoilRes = await api.get(
        `api/detailsFromPincode/${State}/${District}`
      );
      const { ANNUAL_RAINFALL, ZONE, SOIL, UV_INDEX } = zoneSoilRes.data.data;
      console.log(ANNUAL_RAINFALL, ZONE, SOIL, UV_INDEX);
      console.log(zoneSoilRes);

      // Save everything
      const fullData = {
        latitude,
        longitude,
        State,
        District,
        maxtemp_c,
        mintemp_c,
        avgtemp_c,
        avghumidity,
        ANNUAL_RAINFALL,
        ZONE,
        SOIL,
        UV_INDEX,
      };

      setPincodeCache(zipcode, fullData);

      setUser_info({
        min_temperature: mintemp_c,
        max_temperature: maxtemp_c,
        avg_temperature: avgtemp_c,
        avg_rainfall: ANNUAL_RAINFALL,
        humidity: avghumidity,
        sunlight: UV_INDEX,
        zone: ZONE,
        soil: SOIL,
      });

      setVerify(true);
      plant_recommendations();
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setshow_error_section(true);
      setSkeleton_loding(false);
    }
  };

  useEffect(() => {
    if (verify) {
      plant_recommendations();
    }
  }, [verify]);

  const plant_recommendations = async () => {
    if (verify) {
      console.log(`${plantData.name} ${user_info}`);

      try {
        const response = await axios.post(
          `https://5ab8-34-138-137-86.ngrok-free.app/recommend/?plant_name=${plantData.name}`,
          user_info
        );

        const { current_plant_info, recommendations } = response.data; // ✅ access .data
        console.log(current_plant_info, recommendations);

        setgrowing_chance(current_plant_info.match_score);
        setRecommendedPlants(recommendations);
        setShow_recommendation_section(true);
        setSkeleton_loding(false);
      } catch (error) {
        console.error("API Error:", error);
      }
    }
  };

  const checkZipcode = () => {
    if (zipcode.length === 6) {
      setshow_error_section(false);
      setSkeleton_loding(true);
      getAllData(zipcode);
    }
  };

  const show_plant = (id, index) => {
    setgrowing_chance(recommendedPlants[index].match_score);
    navigate(`/plantchecker/${id}`);
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" />
      </div>
    );

  if (error)
    return (
      <Alert variant="danger" className="mt-3">
        Error loading plant: {error}
      </Alert>
    );

  if (!plantData) return null;

  return (
    <>
      {/* <Header /> */}
      <div className="container body-bg-color py-4">
        <div className="row">
          <div className="col-lg-5 p-3 d-flex justify-content-center flex-column align-items-center">
            <img
              src={plantData.image}
              className="img-fluid rounded p-2"
              alt={plantData.name}
              style={{ height: "auto", width: "70%", objectFit: "cover" }}
              onError={(e) => {
                e.target.src = "/placeholder-plant.jpg";
              }}
            />

            <div className="mt-3 p-3 body-dark-bg-color text-light rounded w-100">
              <h3>{plantData.name}</h3>
              <p className="mb-0 fs-5">
                Price:{" "}
                <span className="badge text-bg-warning">
                  ₹{plantData.price.toFixed(2)}
                </span>{" "}
              </p>
              {plantData.discount > 0 && (
                <p className="text-light fs-5">
                  Discount:{" "}
                  <span className="badge text-bg-danger">
                    {plantData.discount}%
                  </span>
                  <span className="badge text-bg-warning ms-2">
                    {" "}
                    (₹
                    {(
                      plantData.price -
                      (plantData.price * plantData.discount) / 100
                    ).toFixed(2)}
                    )
                  </span>
                </p>
              )}
            </div>

            <div className="mt-3 p-3 bg-light rounded">
              <h4>Description</h4>
              <p>{plantData.description || "No description available."}</p>
            </div>

            <div className="mt-3 p-3 bg-light rounded w-100">
              <h4>Other Names</h4>
              <p>{plantData.othername || "No data available."}</p>
            </div>
          </div>

          <div className="col-lg-7 p-3">
            <div className="input-group mb-3">
              <input
                type="number"
                value={zipcode}
                onChange={(e) => setZipcode(e.target.value)}
                className="form-control"
                placeholder="Enter 6-digit zipcode"
                maxLength="6"
              />
              <button
                className="btn btn-success"
                onClick={checkZipcode}
                disabled={zipcode.length !== 6}
              >
                Check Availability
              </button>
            </div>

            {/* show if verify is true */}

            {!Skeleton_loding ? (
              <>
                {show_recommendation_section && (
                  <div className="mt-4">
                    {growing_chance >= 60 ? (
                      <>
                        <div className="d-flex gap-3 mb-4">
                          <button
                            className="btn btn-dark-green text-light"
                            onClick={addToCart}
                          >
                            <i className="bi bi-cart me-2"></i>Add to Cart
                          </button>
                          <button
                            className="btn btn-orange text-light"
                            onClick={addToWishlist}
                          >
                            <i className="bi bi-heart me-2"></i>Add to Wishlist
                          </button>
                        </div>
                      </>
                    ) : (
                      <></>
                    )}

                    <div className="">
                      <div
                        className="progress mb-3"
                        role="progressbar"
                        aria-label="Animated striped example"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        style={{ height: "30px" }}
                      >
                        <div
                          className={`progress-bar progress-bar-striped progress-bar-animated fw-bold ${
                            growing_chance >= 75
                              ? "bg-success"
                              : growing_chance >= 60
                              ? "bg-warning"
                              : "bg-danger"
                          }`}
                          style={{ width: `${Math.round(growing_chance)}%` }}
                        >
                          {Math.round(growing_chance)}%
                        </div>
                      </div>
                    </div>

                    <Alert
                      variant={
                        growing_chance >= 75
                          ? "success"
                          : growing_chance >= 60
                          ? "warning"
                          : "danger"
                      }
                    >
                      <i className="bi bi-check-circle-fill me-2"></i>
                      {growing_chance >= 75
                        ? `This plant is highly suitable for your area (Zipcode: ${zipcode})`
                        : growing_chance >= 60
                        ? `This plant is moderately suitable for your area (Zipcode: ${zipcode})`
                        : `This plant is less suitable for your area (Zipcode: ${zipcode})`}
                    </Alert>
                    {growing_chance < 60 ? (
                      <>
                        <span className="badge text-bg-danger fs-5 text-center fw-bold">
                          <i class="bi bi-x-circle pe-3"></i>You are not allowed
                          to purchase the plant.
                        </span>
                      </>
                    ) : (
                      <></>
                    )}

                    <div className="body-dark-bg-color text-light p-3 rounded mt-3">
                      <h3 className="text-warning">Growing Requirements</h3>
                      <hr />
                      <ul className="list-unstyled">
                        <li>
                          <h4>{plantData.category || "No Data"} Plant</h4>
                        </li>
                        <li>
                          <strong>Soil Type:</strong>{" "}
                          {plantData.soilTypes.join(", ") || "No Data"}
                        </li>
                        <li>
                          <strong>Sunlight:</strong>{" "}
                          {plantData.sunlight || "No Data"}
                        </li>
                        <li>
                          <strong>Water Tollerence:</strong>{" "}
                          {plantData.waterTollerence || "No Data"}
                        </li>
                        <li>
                          <strong>Min Temperature:</strong>{" "}
                          {plantData.mintemp || "No Data"}
                        </li>
                        <li>
                          <strong>Max Temperature:</strong>{" "}
                          {plantData.maxtemp || "No Data"}
                        </li>
                        <li>
                          <strong>Min Rainfall:</strong>{" "}
                          {plantData.minrainfall || "No Data"}
                        </li>
                        <li>
                          <strong>Max Rainfall:</strong>{" "}
                          {plantData.maxrainfall || "No Data"}
                        </li>
                        <li>
                          <strong>Humidity:</strong>{" "}
                          {plantData.humidity || "No Data"}
                        </li>
                        <li>
                          <strong>Soil PH:</strong> {plantData.ph || "No Data"}
                        </li>
                      </ul>
                    </div>

                    {show_recommendation_section &&
                      recommendedPlants.length > 0 && (
                        <div className="mt-4">
                          <h4 className="ps-2 orange-text-color">
                            Recommended Plants
                          </h4>
                          <div className="d-flex overflow-auto gap-3 py-2">
                            {recommendedPlants.map((plant, index) => (
                              <RecomendPlantCardComponent
                                key={plant._id}
                                plant={plant}
                                onClick={() => show_plant(plant._id, index)}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </>
            ) : (
              <LoadingSkeleton />
            )}
            {show_error_section && (
              <>
                <div>
                  <span className="badge text-bg-warning p-3 fs-5">
                    Your Pincode is Invalid.Give a Valid Pincode.
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PlantChecking;
