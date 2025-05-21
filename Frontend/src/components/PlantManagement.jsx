import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import Chart from "chart.js/auto";
import {
  getPlants,
  getPlant,
  createPlant,
  updatePlant,
  deletePlant,
  getEcomStats,
  getOrderStats,
} from "../serviceS/plantService";
import MonthlySalesChart from "./MonthlySalesChart";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const fetchEcomStats = async () => {
  try {
    const response = await api.get("/api/plants/stats/ecom");
    setStats((prev) => ({ ...prev, ecomStats: response.data }));
  } catch (error) {
    console.error("Fetch Ecom Stats Error:", error);
  }
};

const PlantManagement = () => {
  const [activeTab, setActiveTab] = useState("managePlants");
  const [plants, setPlants] = useState([]);
  const [plant, setPlant] = useState({
    name: "",
    othername: "",
    description: "",
    price: 0,
    discount: 0,
    stock: 0,
    mintemp: "",
    maxtemp: "",
    minrainfall: "",
    maxrainfall: "",
    ph: "",
    category: "",
    waterTollerence: "",
    zones: [],
    soilTypes: [],
    humidity: "",
    sunlight: "",
    image: "",
  });
  const [viewPlant, setViewPlant] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  // const [stats, setStats] = useState({
  //   ecomStats: null,
  //   orderStats: null,
  // });

  const [stats, setStats] = useState({ orderStats: null });
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    fetchOrderStats();
  }, []);

  const categories = ["Indoor", "Fruit", "Flower"];
  const zones = [
    "AF",
    "AM",
    "AW",
    "BSH",
    "BWH",
    "CFA",
    "CSA",
    "CWA",
    "CWB",
    "DFC",
    "ET",
  ];
  const soilTypes = [
    "Alluvial",
    "Arid",
    "Black",
    "Laterite",
    "Mountain",
    "Red & Yellow",
  ];
  const sunlights = ["Full Sun", "Partial Sun"];
  const humiditys = ["High", "Low", "Moderate"];
  const waterTollerences = ["High", "Low", "Moderate"];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/api/order/admin/all");
      setOrders(response.data.orders);
    } catch (error) {
      console.error("Fetch Orders Error:", error);
    }
  };

  // Fetch plants from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const plantsData = await getPlants();
        setPlants(plantsData);

        if (activeTab === "ecomStats") {
          const ecomStats = await getEcomStats();
          setStats((prev) => ({ ...prev, ecomStats }));
        }

        if (activeTab === "orderStats") {
          const orderStats = await getOrderStats();
          setStats((prev) => ({ ...prev, orderStats }));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  // Handle Status Change
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await api.put("/api/order/admin/status", {
        orderId,
        newStatus,
      });
      if (response.data.success) {
        alert("Status updated successfully!");
        fetchOrders(); // Refresh the list after successful update
      } else {
        alert("Failed to update status.");
      }
    } catch (error) {
      console.error("Update Status Error:", error);
      alert("Error updating status.");
    }
  };

  // Handle Status submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Frontend validation
      if (plant.zones.length === 0) {
        throw new Error("At least one zone must be selected");
      }
      if (plant.soilTypes.length === 0) {
        throw new Error("At least one soil type must be selected");
      }

      let result;
      if (isEditing) {
        result = await updatePlant(plant._id, plant);
        setPlants(plants.map((p) => (p._id === plant._id ? result : p)));
      } else {
        // const newPlant = { ...plant };
        result = await createPlant(plant);
        setPlants([...plants, result]);
        console.log(result);
      }
      resetForm();
    } catch (err) {
      setError(err.message || "Failed to save plant");
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setPlant({
      name: "",
      othername: "",
      description: "",
      price: 0,
      discount: 0,
      stock: 0,
      mintemp: "",
      maxtemp: "",
      minrainfall: "",
      maxrainfall: "",
      ph: "",
      category: "",
      waterTollerence: "",
      zones: [],
      soilTypes: [],
      humidity: "",
      sunlight: "",
      image: "",
    });
    setImageFile(null);
    setIsEditing(false);
  };

  // Handle edit
  const handleEdit = (id) => {
    const selectedPlant = plants.find((p) => p._id === id);
    setPlant({
      ...selectedPlant,
      zones: selectedPlant.zones || [],
      soilTypes: selectedPlant.soilTypes || [],
    });
    setImageFile(selectedPlant.image);
    setIsEditing(true);
  };

  // Handle view
  const handleView = (plant) => {
    setViewPlant(plant);
  };

  // Handle close view
  const handleCloseView = () => {
    setViewPlant(null);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this plant?")) {
      try {
        setLoading(true);
        await deletePlant(id);
        setPlants(plants.filter((p) => p._id !== id));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle image change - UPDATED TO FIX ADD PLANT ISSUE
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "Florus_Image_Cloudinary");
    data.append("cloud_name", "dpizvdkya");

    try {
      // Upload image to Cloudinary
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dpizvdkya/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const cloudinaryResponse = await res.json();
      const imageUrl = cloudinaryResponse.secure_url; // Use secure_url instead of url

      // Update local state with the image URL
      setPlant((prev) => ({ ...prev, image: imageUrl }));
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Failed to upload image");
    }
  };

  // Handle zone checkbox changes
  const handleZoneChange = (e) => {
    const value = e.target.value;
    const isChecked = e.target.checked;

    setPlant((prevPlant) => {
      if (isChecked) {
        return { ...prevPlant, zones: [...prevPlant.zones, value] };
      } else {
        return {
          ...prevPlant,
          zones: prevPlant.zones.filter((zone) => zone !== value),
        };
      }
    });
  };

  // Handle soil type checkbox changes
  const handleSoilTypeChange = (e) => {
    const value = e.target.value;
    const isChecked = e.target.checked;

    setPlant((prevPlant) => {
      if (isChecked) {
        return { ...prevPlant, soilTypes: [...prevPlant.soilTypes, value] };
      } else {
        return {
          ...prevPlant,
          soilTypes: prevPlant.soilTypes.filter((soil) => soil !== value),
        };
      }
    });
  };

  const fetchOrderStats = async () => {
    try {
      const response = await api.get("/api/plants/stats/orders");
      setStats({ orderStats: response.data });

      // Prepare Pie Chart data
      setOrderData({
        labels: [
          "Accepted",
          "Under Processing",
          "Packaging",
          "Shipped",
          "Out of Delivery",
          "Delivered",
          "Cancelled",
        ],
        datasets: [
          {
            label: "Order Status",
            data: [
              response.data.accepted,
              response.data.underProcessing,
              response.data.packaging,
              response.data.shipped,
              response.data.outOfDelivery,
              response.data.delivered,
              response.data.cancelled,
            ],
            backgroundColor: [
              "#9400D3", // Violet
              "#FF7F00", // Orange
              "#FFFF00", // Yellow
              "#0000FF", // Blue
              "#4B0082", // Indigo
              "#00FF00", // Green
              "#FF0000", // Red
            ],

            borderColor: ["#FFFFFF"],
            borderWidth: 2,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching order stats:", error);
    }
  };

  return (
    <div className="container mt-4">
      {error && (
        <div className="alert alert-danger">
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError(null)}
          ></button>
        </div>
      )}

      {loading && (
        <div className="text-center my-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${
              activeTab === "managePlants" ? "active" : ""
            }`}
            onClick={() => setActiveTab("managePlants")}
          >
            Manage Plants
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "plantList" ? "active" : ""}`}
            onClick={() => setActiveTab("plantList")}
          >
            Plant Details
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${
              activeTab === "orderDetails" ? "active" : ""
            }`}
            onClick={() => setActiveTab("orderDetails")}
          >
            Order Details
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "orderStats" ? "active" : ""}`}
            onClick={() => setActiveTab("orderStats")}
          >
            Order Statistics
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "ecomStats" ? "active" : ""}`}
            onClick={() => setActiveTab("ecomStats")}
          >
            E-commerce Statistics
          </button>
        </li>
      </ul>

      {/* Order Stats Tab */}
      {activeTab === "orderStats" && stats.orderStats && (
        <div className="card mb-4">
          <div className="card-header">
            <h5>Order Stats</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <p>
                  <strong>Total Orders:</strong> {stats.orderStats.totalOrders}
                </p>
                <p>
                  <strong>Accepted:</strong> {stats.orderStats.accepted}
                </p>
                <p>
                  <strong>Under Processing:</strong>{" "}
                  {stats.orderStats.underProcessing}
                </p>
                <p>
                  <strong>Packaging:</strong> {stats.orderStats.packaging}
                </p>
                <p>
                  <strong>Shipped:</strong> {stats.orderStats.shipped}
                </p>
                <p>
                  <strong>Out of Delivery:</strong>{" "}
                  {stats.orderStats.outOfDelivery}
                </p>
                <p>
                  <strong>Delivered:</strong> {stats.orderStats.delivered}
                </p>
                <p>
                  <strong>Cancelled:</strong> {stats.orderStats.cancelled}
                </p>
              </div>
              <div className="col-md-6">
                {orderData && (
                  <div className="card w-100 body-bg-color p-4">
                    <Pie data={orderData} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Tab*/}
      {activeTab === "orderDetails" && (
        <div className="card md-4">
          <div className="card-header">
            <h5>Order Details</h5>
          </div>
          <div className="overflow-x-auto">
            <table className="table-auto w-full border border-gray-300">
              <thead className="">
                <tr>
                  <th className="p-2 border">User Name</th>
                  <th className="p-2 border">Order ID</th>
                  <th className="p-2 border">Plant Details</th>
                  <th className="p-2 border">Total Amount</th>
                  <th className="p-2 border">Current Status</th>
                  <th className="p-2 border">Change Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="p-2 border">
                      {order.user_id?.name || "No Name"}
                    </td>
                    <td className="p-2 border">{order._id}</td>
                    <td className="p-2 border">
                      <ul className="space-y-1">
                        {order.order_details?.plant_lists?.map(
                          (item, index) => (
                            <li key={index} className="flex justify-between">
                              <span>
                                {item.plant?.name ? (
                                  <span className="font-medium">
                                    {item.plant.name}
                                  </span>
                                ) : (
                                  <span className="text-red-500">
                                    [Deleted Product]
                                  </span>
                                )}
                                <span className="text-gray-500 ml-2">
                                  × {item.quantity}
                                </span>
                              </span>
                              {item.plant?.price && (
                                <span className="text-gray-600">
                                  ₹
                                  {(item.plant.price * item.quantity).toFixed(
                                    2
                                  )}
                                </span>
                              )}
                            </li>
                          )
                        )}
                      </ul>
                    </td>
                    <td className="p-2 border">
                      ₹{order.order_details?.total_price}
                    </td>
                    <td className="p-2 border">{order.status}</td>
                    <td className="p-2 border">
                      <select
                        className="border p-1 rounded"
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                      >
                        <option value="Accepted">Accepted</option>
                        <option value="Under Processing">
                          Under Processing
                        </option>
                        <option value="Packaging">Packaging</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out of Delivery">Out of Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Manage Plants Tab */}
      {activeTab === "managePlants" && (
        <div className="card mb-4">
          <div className="card-header">
            <h5>{isEditing ? "Edit Plant" : "Add Plant"}</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                {/* Plant Name */}
                <div className="col-md-6">
                  <label className="form-label">Plant Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={plant.name}
                    onChange={(e) =>
                      setPlant({ ...plant, name: e.target.value })
                    }
                    required
                  />
                </div>
                {/* Other Name */}
                <div className="col-md-6">
                  <label className="form-label">Other Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={plant.othername}
                    onChange={(e) =>
                      setPlant({ ...plant, othername: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Upload Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    onChange={handleImageChange}
                  />
                  {imageFile && (
                    <div className="mt-2">
                      <small>uploaded image: </small>
                      <img
                        src={imageFile}
                        style={{
                          height: "100px",
                          width: "auto",
                          display: "block", // Optional: ensures proper spacing
                        }}
                        alt="Plant preview" // Always include alt text for accessibility
                      />
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    value={plant.description}
                    onChange={(e) =>
                      setPlant({ ...plant, description: e.target.value })
                    }
                    required
                  ></textarea>
                </div>
              </div>

              <div className="row mb-3">
                {/* price */}
                <div className="col-md-6">
                  <label className="form-label">Price (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={plant.price}
                    onChange={(e) =>
                      setPlant({ ...plant, price: parseFloat(e.target.value) })
                    }
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                {/* Stock */}
                <div className="col-md-6">
                  <label className="form-label">Stock</label>
                  <input
                    type="number"
                    className="form-control"
                    value={plant.stock}
                    onChange={(e) =>
                      setPlant({ ...plant, stock: parseInt(e.target.value) })
                    }
                    min="0"
                    required
                  />
                </div>
              </div>
              <div className="row mb-3">
                {/* Discount */}
                <div className="col-md-6">
                  <label className="form-label">Discount (%)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={plant.discount}
                    onChange={(e) =>
                      setPlant({
                        ...plant,
                        discount: parseFloat(e.target.value),
                      })
                    }
                    min="0"
                    step="1"
                    required
                  />
                </div>
                {/* Min Temperature */}
                <div className="col-md-6">
                  <label className="form-label">Min Temperature</label>
                  <input
                    type="text"
                    className="form-control"
                    value={plant.mintemp}
                    onChange={(e) =>
                      setPlant({
                        ...plant,
                        mintemp: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                {/* Max Temperature */}
                <div className="col-md-6">
                  <label className="form-label">Max Temperature</label>
                  <input
                    type="text"
                    className="form-control"
                    value={plant.maxtemp}
                    onChange={(e) =>
                      setPlant({
                        ...plant,
                        maxtemp: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                {/* Min Rainfall */}
                <div className="col-md-6">
                  <label className="form-label">Min Rainfall</label>
                  <input
                    type="text"
                    className="form-control"
                    value={plant.minrainfall}
                    onChange={(e) =>
                      setPlant({
                        ...plant,
                        minrainfall: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                {/* Max Rainfall */}
                <div className="col-md-6">
                  <label className="form-label">Max Rainfall</label>
                  <input
                    type="text"
                    className="form-control"
                    value={plant.maxrainfall}
                    onChange={(e) =>
                      setPlant({
                        ...plant,
                        maxrainfall: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                {/* ph_value */}
                <div className="col-md-6">
                  <label className="form-label">PH value</label>
                  <input
                    type="text"
                    className="form-control"
                    value={plant.ph}
                    onChange={(e) =>
                      setPlant({
                        ...plant,
                        ph: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="row mb-3">
                {/* category */}
                <div className="col-md-4">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={plant.category}
                    onChange={(e) =>
                      setPlant({ ...plant, category: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                {/* humidity */}
                <div className="col-md-4">
                  <label className="form-label">Humidity</label>
                  <select
                    className="form-select"
                    value={plant.humidity}
                    onChange={(e) =>
                      setPlant({ ...plant, humidity: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Humidity</option>
                    {humiditys.map((humidity) => (
                      <option key={humidity} value={humidity}>
                        {humidity}
                      </option>
                    ))}
                  </select>
                </div>
                {/* waterTollerence */}
                <div className="col-md-4">
                  <label className="form-label">Water Tollerence</label>
                  <select
                    className="form-select"
                    value={plant.waterTollerence}
                    onChange={(e) =>
                      setPlant({ ...plant, waterTollerence: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Water Tollerence</option>
                    {waterTollerences.map((waterTollerence) => (
                      <option key={waterTollerence} value={waterTollerence}>
                        {waterTollerence}
                      </option>
                    ))}
                  </select>
                </div>
                {/* sunlight */}
                <div className="col-md-4">
                  <label className="form-label">Sunlight</label>
                  <select
                    className="form-select"
                    value={plant.sunlight}
                    onChange={(e) =>
                      setPlant({ ...plant, sunlight: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Sunlight</option>{" "}
                    {/* Fixed from "Select Category" */}
                    {sunlights.map((sunlight) => (
                      <option key={sunlight} value={sunlight}>
                        {sunlight}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Zone Checkboxes */}
              <div className="row mb-3">
                <div className="col-md-12">
                  <label className="form-label">Zones</label>
                  <div className="d-flex flex-wrap gap-3">
                    {zones.map((zone) => (
                      <div key={zone} className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`zone-${zone}`}
                          value={zone}
                          checked={plant.zones.includes(zone)}
                          onChange={handleZoneChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`zone-${zone}`}
                        >
                          {zone}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Soil Type Checkboxes */}
              <div className="row mb-3">
                <div className="col-md-12">
                  <label className="form-label">Soil Types</label>
                  <div className="d-flex flex-wrap gap-3">
                    {soilTypes.map((soil) => (
                      <div key={soil} className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`soil-${soil}`}
                          value={soil}
                          checked={plant.soilTypes.includes(soil)}
                          onChange={handleSoilTypeChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`soil-${soil}`}
                        >
                          {soil}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading
                  ? "Processing..."
                  : isEditing
                  ? "Update Plant"
                  : "Add Plant"}
              </button>

              {isEditing && (
                <button
                  type="button"
                  className="btn btn-secondary ms-2"
                  onClick={resetForm}
                  disabled={loading}
                >
                  Cancel
                </button>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Plant List Tab */}
      {activeTab === "plantList" && (
        <div className="card mb-4">
          <div className="card-header">
            <h5>Plant List</h5>
          </div>

          <div className="card-body">
            {plants.length === 0 ? (
              <div className="alert alert-info">
                No plants found. Add some plants to get started.
              </div>
            ) : (
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {plants.map((p) => (
                    <tr key={p._id}>
                      <td>{p.name}</td>
                      <td>₹{p.price.toFixed(2)}</td>
                      <td>{p.stock}</td>
                      <td>
                        <button
                          onClick={() => handleView(p)}
                          className="btn btn-info btn-sm me-1"
                          title="View"
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                        <button
                          onClick={() => handleEdit(p._id)}
                          className="btn btn-warning btn-sm me-1"
                          title="Edit"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="btn btn-danger btn-sm"
                          title="Delete"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {activeTab === "ecomStats" && stats.ecomStats && (
        <div className="card mb-4">
          <div className="card-header">
            <h5>E-commerce Stats</h5>
          </div>

          <div className="card-body">
            {/* Basic Stats */}
            <p>
              <strong>Total Sales:</strong> ₹{stats.ecomStats.totalSales}
            </p>
            <p>
              <strong>Total Orders:</strong> {stats.ecomStats.totalOrders}
            </p>
            <p>
              <strong>Best Selling Plant:</strong>{" "}
              {stats.ecomStats.bestSellingPlant}
            </p>

            <hr />

            {/* Top 3 Best-Selling Plants */}
            <h6>Top 3 Best-Selling Plants:</h6>
            <ol>
              {stats.ecomStats.top3SellingPlants?.map((plant, index) => (
                <li key={index}>
                  {plant.name} - {plant.quantity} sold
                </li>
              ))}
            </ol>

            <hr />

            {/* Monthly Sales Chart */}
            <h6>Monthly Sales:</h6>
            {stats.ecomStats.monthlySales && (
              <MonthlySalesChart salesData={stats.ecomStats.monthlySales} />
            )}
          </div>
        </div>
      )}

      {/* View Plant Modal */}
      {viewPlant && (
        <div
          className="modal fade show"
          tabIndex="-1"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{viewPlant.name}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseView}
                ></button>
              </div>

              <div className="modal-body">
                {viewPlant.image && (
                  <img
                    src={viewPlant.image}
                    alt={viewPlant.name}
                    className="img-fluid mb-3"
                    style={{ maxHeight: "300px" }}
                  />
                )}
                <table className="table">
                  <tbody>
                    <tr>
                      <td>
                        <strong>Description:</strong>
                      </td>
                      <td>{viewPlant.description}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Other Names:</strong>
                      </td>
                      <td>{viewPlant.othername}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Price:</strong>
                      </td>
                      <td>₹{viewPlant.price?.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Discount:</strong>
                      </td>
                      <td>{viewPlant.discount}%</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Stock:</strong>
                      </td>
                      <td>{viewPlant.stock}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Min Temperature:</strong>
                      </td>
                      <td>{viewPlant.mintemp}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Max Temperature:</strong>
                      </td>
                      <td>{viewPlant.maxtemp}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Min Rainfall:</strong>
                      </td>
                      <td>{viewPlant.minrainfall}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Max Rainfall:</strong>
                      </td>
                      <td>{viewPlant.maxrainfall}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>PH value:</strong>
                      </td>
                      <td>{viewPlant.ph}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Category:</strong>
                      </td>
                      <td>{viewPlant.category}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Zones:</strong>
                      </td>
                      <td>{viewPlant.zones?.join(", ") || "N/A"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Soil Types:</strong>
                      </td>
                      <td>{viewPlant.soilTypes?.join(", ") || "N/A"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Humidity:</strong>
                      </td>
                      <td>{viewPlant.humidity}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Water Tollerence:</strong>
                      </td>
                      <td>{viewPlant.waterTollerence}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Sunlight:</strong>
                      </td>
                      <td>{viewPlant.sunlight}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseView}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantManagement;
