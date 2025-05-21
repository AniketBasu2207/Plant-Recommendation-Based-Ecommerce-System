import { useEffect, useState } from "react";
import "./App.css";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Contact from "./pages/Contact";
import PlantGallery from "./pages/PlantGallery";
import PlantChecking from "./pages/PlantChecking";
import VerticalStepper1 from "./components/Vertical-Stepper";
import Wishlist from "./pages/Wishlist";
import AddtoCart from "./pages/AddtoCart";
import OrderPage from "./pages/OrderPage";
import RazorpayButton from "./pages/RazorpayButton";
import Noti from "./pages/noti";

import { ReactNotifications } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import ProfilePage from "./pages/Profile";
import ReviewSlider from "./components/Reviews";
import PlantCarousel from "./pages/Plantslider";

import Admin from "./pages/Admin";
import Login from "./components/Login"; // Import the Login component

import { Toaster } from "react-hot-toast";

// Create axios instance with base URL
import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

function App() {
  const location = useLocation(); // Get the current location (route)

  const isPlantCheckingPage = location.pathname.startsWith("/plantchecker");
  const isAdminPage = location.pathname.startsWith("/admin");

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(
    localStorage.getItem("AdminloggedIn") === "true"
  );

  const handleLogin = () => {
    setIsAdminLoggedIn(true);
    localStorage.setItem("AdminloggedIn", true);
  };

  const handleLogout = () => {
    localStorage.removeItem("AdminloggedIn");
    setIsAdminLoggedIn(false);
  };

  useEffect(() => {
    // Check if the user is logged in on mount
    const AdminloggedInStatus =
      localStorage.getItem("AdminloggedIn") === "true";
    setIsAdminLoggedIn(AdminloggedInStatus);
    //----------------------------
    Count_Items();
  }, []);

  const Count_Items = async () => {
    const response = await api.get("/count");

    if (response.data.response) {
      setCartCount(response.data.message.cart_count);
      setWishlistCount(response.data.message.wishlist_count);
    } else {
      setCartCount(0);
      setWishlistCount(0);
    }
  };

  //----------------- add line on 02-05-25 for count cart and wishlist items
  const [cartCount, setCartCount] = useState(() => {
    return Number(localStorage.getItem("cartCount")) || 0;
  });

  const [wishlistCount, setWishlistCount] = useState(() => {
    return Number(localStorage.getItem("wishlistCount")) || 0;
  });

  useEffect(() => {
    localStorage.setItem("cartCount", cartCount);
  }, [cartCount]);

  useEffect(() => {
    localStorage.setItem("wishlistCount", wishlistCount);
  }, [wishlistCount]);

  return (
    <>
      <ReactNotifications />
      <Toaster
        position="top-center"
        // toastOptions={{
        //   style: {
        //     minWidth: '300px',
        //     maxWidth: '600px',
        //     padding: '16px',
        //     fontSize: '16px',
        //   },
        // }}
      />
      <div className="container">
        {/* -----age chilo -------------- {!isPlantCheckingPage && !isAdminPage && <Header/>} */}
        {!isAdminPage && (
          <Header
            cartCount={cartCount}
            wishlistCount={wishlistCount}
            setCartCount={setCartCount}
            setWishlistCount={setWishlistCount}
          />
        )}

        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/contact" element={<Contact />}></Route>
          <Route path="/how-to-use" element={<VerticalStepper1 />}></Route>
          <Route
            path="/plantgallery"
            element={
              localStorage.getItem("isLoggedIn") === "true" ? (
                <>
                  <PlantGallery />
                </>
              ) : (
                (() => {
                  // alert('Please login before proceeding.');
                  return <Navigate to="/" />;
                })()
              )
            }
          ></Route>
          {/* <Route path="/plantchecker" element={<PlantChecking/>}></Route> */}
          <Route
            path="/plantchecker/:id"
            element={
              <PlantChecking
                cartCount={cartCount}
                wishlistCount={wishlistCount}
                setCartCount={setCartCount}
                setWishlistCount={setWishlistCount}
              />
            }
          ></Route>
          <Route
            path="/wishlist"
            element={
              <Wishlist
                cartCount={cartCount}
                wishlistCount={wishlistCount}
                setCartCount={setCartCount}
                setWishlistCount={setWishlistCount}
              />
            }
          ></Route>
          <Route
            path="/viewcart"
            element={
              <AddtoCart
                cartCount={cartCount}
                wishlistCount={wishlistCount}
                setCartCount={setCartCount}
                setWishlistCount={setWishlistCount}
              />
            }
          ></Route>
          <Route path="/orders" element={<OrderPage />}></Route>
          <Route path="/pay" element={<RazorpayButton />}></Route>

          <Route path="/noti" element={<Noti />}></Route>
          <Route path="/profile" element={<ProfilePage />}></Route>
          <Route path="/review" element={<ReviewSlider />}></Route>
          <Route path="/plantslider" element={<PlantCarousel />}></Route>
          <Route
            path="/admin"
            element={
              isAdminLoggedIn ? (
                <Admin onLogout={handleLogout} />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
        </Routes>

        {!isAdminPage && <Footer />}
      </div>
    </>
  );
}

export default App;
// old one
